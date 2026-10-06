import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, ReferralAgent, ReferralItem, ReferralPayout } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';
import { sanitizeInput, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let agents: ReferralAgent[] = [];
    let referrals: ReferralItem[] = [];
    let payouts: ReferralPayout[] = [];

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        const [aRows] = await pool.execute('SELECT * FROM referral_agents ORDER BY id DESC');
        const [rRows] = await pool.execute('SELECT * FROM referrals ORDER BY id DESC');
        const [pRows] = await pool.execute('SELECT * FROM referral_payouts ORDER BY id DESC');
        agents = (aRows as any[]).map(a => ({
          ...a,
          commission_per_student: Number(a.commission_per_student || 5000),
          total_referrals: Number(a.total_referrals || 0),
          paid_referrals: Number(a.paid_referrals || 0),
          total_earned: Number(a.total_earned || 0),
          total_paid: Number(a.total_paid || 0),
          balance: Number(a.balance || 0)
        }));
        referrals = (rRows as any[]).map(r => ({
          ...r,
          commission_amount: Number(r.commission_amount || 5000)
        }));
        payouts = (pRows as any[]).map(p => ({
          ...p,
          amount: Number(p.amount || 0)
        }));
      } catch (sqlErr) {
        console.warn('MySQL referrals query fallback to adminStore:', sqlErr);
        agents = adminStore.getReferralAgents();
        referrals = adminStore.getAllReferrals();
        payouts = adminStore.getPayoutRequests();
      }
    } else {
      agents = adminStore.getReferralAgents();
      referrals = adminStore.getAllReferrals();
      payouts = adminStore.getPayoutRequests();
    }

    const stats = {
      total_agents: agents.length,
      total_referrals: referrals.length,
      paid_referrals: referrals.filter(r => (r.payment_status || '').toLowerCase().includes('paid')).length,
      total_earned: agents.reduce((acc, a) => acc + (a.total_earned || 0), 0),
      total_paid_out: agents.reduce((acc, a) => acc + (a.total_paid || 0), 0),
      pending_payouts_count: payouts.filter(p => p.status === 'pending').length,
      pending_payouts_amount: payouts.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0)
    };

    return NextResponse.json({
      success: true,
      data: {
        stats,
        agents,
        referrals,
        payouts
      }
    });

  } catch (err: any) {
    console.error('Admin referrals fetch error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not load referral management data.' },
      { status: 500 }
    );
  }
}

// Admin Process / Complete Payout
export async function POST(request: Request) {
  try {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin request rejected.' },
        { status: 403 }
      );
    }

    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const payoutId = Number(body.payout_id);
    const transactionId = sanitizeInput(body.transaction_id || '');
    const proofScreenshot = sanitizeInput(body.proof_screenshot || '');
    const adminNotes = sanitizeInput(body.admin_notes || '');

    if (!payoutId) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid payout ID.' },
        { status: 400 }
      );
    }

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        await pool.execute(
          `UPDATE referral_payouts 
           SET status = 'completed', transaction_id = ?, proof_screenshot = ?, admin_notes = ?, processed_at = NOW() 
           WHERE id = ?`,
          [transactionId, proofScreenshot || null, adminNotes || '', payoutId]
        );
      } catch (sqlErr) {
        console.warn('MySQL payout update notice:', sqlErr);
      }
    }

    const result = adminStore.completePayoutRequest(payoutId, transactionId, proofScreenshot, adminNotes);
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Payout request not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'MoMo payout marked as completed! Deposit proof is now available to the referral agent.',
      data: result
    });

  } catch (err: any) {
    console.error('Admin process payout error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not process payout.' },
      { status: 500 }
    );
  }
}

// Admin Update Agent Status or Commission
export async function PUT(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const agentId = Number(body.agent_id);
    const status = body.status as 'active' | 'suspended';
    const commissionPerStudent = body.commission_per_student ? Number(body.commission_per_student) : undefined;

    if (!agentId) {
      return NextResponse.json(
        { success: false, message: 'Invalid agent ID.' },
        { status: 400 }
      );
    }

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        const updates: string[] = [];
        const params: any[] = [];
        if (status) { updates.push('status = ?'); params.push(status); }
        if (commissionPerStudent !== undefined) { updates.push('commission_per_student = ?'); params.push(commissionPerStudent); }
        if (updates.length > 0) {
          updates.push('updated_at = NOW()');
          params.push(agentId);
          await pool.execute(`UPDATE referral_agents SET ${updates.join(', ')} WHERE id = ?`, params);
        }
      } catch (sqlErr) {
        console.warn('MySQL agent update notice:', sqlErr);
      }
    }

    const agent = adminStore.getReferralAgents().find(a => a.id === agentId);
    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Agent not found.' },
        { status: 404 }
      );
    }

    if (status) agent.status = status;
    if (commissionPerStudent !== undefined) agent.commission_per_student = commissionPerStudent;

    const updated = adminStore.saveReferralAgent(agent);

    return NextResponse.json({
      success: true,
      message: 'Agent details updated successfully.',
      data: updated
    });

  } catch (err: any) {
    console.error('Admin update agent error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not update agent details.' },
      { status: 500 }
    );
  }
}
