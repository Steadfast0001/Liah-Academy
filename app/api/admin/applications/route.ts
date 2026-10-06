import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { sendDecisionSignal } from '@/lib/email';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';
import { createStudentView, stripStudentPassword } from '@/lib/student-view';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    let applications;
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute('SELECT * FROM students ORDER BY id DESC');
        applications = rows as any[];
      } catch (mysqlErr) {
        console.warn('MySQL applications query failed, falling back to local database store:', mysqlErr);
        applications = adminStore.getStudents();
      }
    } else {
      applications = adminStore.getStudents();
    }
    return NextResponse.json({ success: true, data: applications.map(createStudentView) });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load applications.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, admission_status, payment_status, notify_applicant } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Application ID is required.' }, { status: 400 });
    }

    let previous: any;
    let updated: any;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const pool = getMySQLPool();
      const [previousRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
      previous = (previousRows as any[])[0];
      if (!previous) {
        return NextResponse.json({ success: false, message: 'Application not found.' }, { status: 404 });
      }

      const nextAdmission = (payment_status === 'Paid' && !admission_status && previous.admission_status !== 'Rejected')
        ? 'Approved'
        : (admission_status || previous.admission_status);
      const nextPayment = payment_status || previous.payment_status;

      if (admission_status && !['Under Review', 'Pending Review', 'Approved', 'Rejected'].includes(admission_status)) {
        return NextResponse.json({ success: false, message: 'Invalid admission status.' }, { status: 400 });
      }
      if (payment_status && !['Pending', 'Pending Verification', 'Deposit Paid', 'Paid', 'Failed', 'Rejected'].includes(payment_status)) {
        return NextResponse.json({ success: false, message: 'Invalid payment status.' }, { status: 400 });
      }

      await pool.execute(
        'UPDATE students SET admission_status = ?, payment_status = ? WHERE id = ?',
        [nextAdmission, nextPayment, id]
      );

      if (payment_status) {
        const [paymentRows] = await pool.execute(
          'SELECT reference, status FROM payments WHERE student_id = ? ORDER BY created_at DESC LIMIT 1',
          [id]
        );
        const latestPayment = (paymentRows as any[])[0];
        if (latestPayment && payment_status === 'Paid' && latestPayment.status !== 'APPROVED') {
          await pool.execute('UPDATE payments SET status = ?, verified_by = ?, verified_at = NOW() WHERE reference = ?', ['APPROVED', 'Admin Office', latestPayment.reference]);
        } else if (latestPayment && payment_status === 'Rejected' && latestPayment.status !== 'REJECTED') {
          await pool.execute('UPDATE payments SET status = ?, verified_by = ?, verified_at = NOW() WHERE reference = ?', ['REJECTED', 'Admin Office', latestPayment.reference]);
        }
        if (payment_status === 'Paid') {
          try {
            const [refRows] = await pool.execute(
              'SELECT id, agent_id, commission_amount, commission_status FROM referrals WHERE student_id = ?',
              [id]
            );
            if (Array.isArray(refRows) && refRows.length > 0) {
              const refItem = (refRows as any[])[0];
              if (refItem.commission_status !== 'approved' && refItem.commission_status !== 'paid') {
                const comm = Number(refItem.commission_amount || 5000);
                await pool.execute(
                  'UPDATE referrals SET payment_status = "Paid", commission_status = "approved", updated_at = NOW() WHERE id = ?',
                  [refItem.id]
                );
                await pool.execute(
                  'UPDATE referral_agents SET paid_referrals = paid_referrals + 1, total_earned = total_earned + ?, balance = balance + ?, updated_at = NOW() WHERE id = ?',
                  [comm, comm, refItem.agent_id]
                );
              }
            }
            adminStore.creditReferralCommission(Number(id));
          } catch (commErr) {
            console.warn('MySQL referral credit notice:', commErr);
          }
        }
      }

      const [updatedRows] = await pool.execute('SELECT * FROM students WHERE id = ?', [id]);
      updated = (updatedRows as any[])[0];
    } else {
      previous = adminStore.getStudentById(id);
    }
    if (!previous) {
      return NextResponse.json({ success: false, message: 'Application not found.' }, { status: 404 });
    }

    const nextAdmission = (payment_status === 'Paid' && !admission_status && previous.admission_status !== 'Rejected')
      ? 'Approved' 
      : admission_status;

    if (getDatabaseSourceMode() !== 'mysql') {
      updated = adminStore.updateStudentStatus(id, nextAdmission, payment_status);

      // If marked Paid or Rejected, also update corresponding payment proof record
      if (payment_status) {
        const payments = adminStore.getPayments().filter(p => p.student_id === Number(id));
        if (payments.length > 0) {
          const latestPayment = payments[0];
          if (payment_status === 'Paid' && latestPayment.status !== 'APPROVED') {
            adminStore.verifyPayment(latestPayment.reference, 'APPROVED', 'Admin Office');
          } else if (payment_status === 'Rejected' && latestPayment.status !== 'REJECTED') {
            adminStore.verifyPayment(latestPayment.reference, 'REJECTED', 'Admin Office');
          }
        }
      }
    }

    // If status changed to Approved or Rejected, trigger decision email notification asynchronously
    if (
      notify_applicant !== false && 
      ((nextAdmission && nextAdmission !== previous.admission_status && (nextAdmission === 'Approved' || nextAdmission === 'Rejected')) ||
       (payment_status === 'Paid' && previous.payment_status !== 'Paid'))
    ) {
      const decisionType = (nextAdmission === 'Rejected') ? 'Rejected' : 'Approved';
      if (updated) {
        sendDecisionSignal({
          id: updated.id,
          full_name: updated.full_name,
          email: updated.email,
          program_type: updated.program_type,
          degree_type: updated.degree_type
        }, decisionType as 'Approved' | 'Rejected').catch(mailErr => {
          console.warn('Decision email signal notice:', mailErr);
        });
      }
    }


    return NextResponse.json({
      success: true,
      message: `Application #${id} updated successfully. Status: ${updated.admission_status}`,
      data: updated ? createStudentView(updated) : null
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to update application.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    const idsStr = searchParams.get('ids');
    const filterParam = searchParams.get('filter');

    // Handle body payload if provided
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      // Empty body is valid for query string parameters
    }

    const targetIds = body.ids || (idsStr ? idsStr.split(',').map((s: string) => s.trim()).filter(Boolean) : null);
    const targetFilter = body.filter || filterParam;

    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      let where = '';
      let params: any[] = [];
      if (targetFilter === 'rejected') {
        where = "admission_status = 'Rejected'";
      } else if (targetFilter === 'unpaid') {
        where = "payment_status = 'Pending'";
      } else if (Array.isArray(targetIds) && targetIds.length > 0) {
        const ids = targetIds.map((targetId: unknown) => Number(targetId)).filter((targetId: number) => Number.isSafeInteger(targetId) && targetId > 0);
        if (ids.length === 0) return NextResponse.json({ success: false, message: 'Valid application IDs are required.' }, { status: 400 });
        where = `id IN (${ids.map(() => '?').join(', ')})`;
        params = ids;
      } else if (idStr) {
        const id = Number(idStr);
        if (!Number.isSafeInteger(id) || id <= 0) return NextResponse.json({ success: false, message: 'Invalid application ID.' }, { status: 400 });
        where = 'id = ?';
        params = [id];
      } else {
        return NextResponse.json({ success: false, message: 'Application ID, IDs list, or filter criterion is required.' }, { status: 400 });
      }

      const pool = getMySQLPool();
      const [rows] = await pool.execute(`SELECT id FROM students WHERE ${where}`, params);
      const deletedIds = (rows as any[]).map(row => Number(row.id));
      if (deletedIds.length > 0) {
        await pool.execute(`DELETE FROM students WHERE id IN (${deletedIds.map(() => '?').join(', ')})`, deletedIds);
      }
      return NextResponse.json({
        success: true,
        message: `Deleted ${deletedIds.length} applicant(s).`,
        deletedCount: deletedIds.length,
        deletedIds
      });
    }

    if (targetFilter === 'rejected') {
      const res = adminStore.deleteStudentsByFilter({ admission_status: 'Rejected' });
      return NextResponse.json({
        success: true,
        message: `Purged ${res.deletedCount} rejected applicants.`,
        deletedCount: res.deletedCount,
        deletedIds: res.deletedIds
      });
    }

    if (targetFilter === 'unpaid') {
      const res = adminStore.deleteStudentsByFilter({ payment_status: 'Pending' });
      return NextResponse.json({
        success: true,
        message: `Purged ${res.deletedCount} unpaid applicants.`,
        deletedCount: res.deletedCount,
        deletedIds: res.deletedIds
      });
    }

    if (Array.isArray(targetIds) && targetIds.length > 0) {
      const res = adminStore.deleteStudents(targetIds);
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${res.deletedCount} selected applicants.`,
        deletedCount: res.deletedCount,
        deletedIds: res.deletedIds
      });
    }

    if (idStr) {
      const success = adminStore.deleteStudent(parseInt(idStr));
      return NextResponse.json({
        success,
        message: `Application #${idStr} removed.`,
        deletedCount: success ? 1 : 0
      });
    }

    return NextResponse.json({ success: false, message: 'Application ID, IDs list, or filter criterion is required.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to delete applications.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
