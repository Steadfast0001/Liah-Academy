import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, ReferralAgent } from '@/lib/db';
import { sanitizeInput, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

function generateUniqueCode(fullName: string): string {
  const cleanName = (fullName || 'REF').replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'LIA';
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const digits = Math.floor(10 + Math.random() * 90);
  return `LIAH-${cleanName}${rand}${digits}`;
}

export async function POST(request: Request) {
  try {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin request rejected.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const fullName = sanitizeInput(body.full_name || body.name);
    const momoNumber = sanitizeInput(body.momo_number || body.phone);
    const momoName = sanitizeInput(body.momo_name || body.account_name) || '';
    const email = sanitizeInput(body.email) || '';
    const studentId = body.student_id ? Number(body.student_id) : null;
    const studentMatricule = sanitizeInput(body.student_matricule) || '';

    if (!fullName || !momoNumber) {
      return NextResponse.json(
        { success: false, message: 'Please provide both your Full Name and Mobile Money (MoMo) Number for payouts.' },
        { status: 400 }
      );
    }

    const cleanMomo = momoNumber.replace(/[\s\-\+]/g, '');
    if (cleanMomo.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid Mobile Money number (MTN or Orange Money).' },
        { status: 400 }
      );
    }

    await ensureMySQLTables();

    let existingAgent: ReferralAgent | undefined;

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        let existingRows: any[] = [];
        if (studentId) {
          const [rows] = await pool.execute('SELECT * FROM referral_agents WHERE student_id = ? LIMIT 1', [studentId]);
          existingRows = rows as any[];
        }
        if (existingRows.length === 0) {
          const [rows] = await pool.execute('SELECT * FROM referral_agents WHERE REPLACE(REPLACE(REPLACE(momo_number, " ", ""), "-", ""), "+", "") = ? LIMIT 1', [cleanMomo]);
          existingRows = rows as any[];
        }
        if (existingRows.length > 0) {
          existingAgent = existingRows[0] as ReferralAgent;
          if (studentId && (!existingAgent.student_id || !existingAgent.student_matricule)) {
            existingAgent.student_id = studentId;
            existingAgent.student_matricule = studentMatricule || existingAgent.student_matricule;
            await pool.execute('UPDATE referral_agents SET student_id = ?, student_matricule = ?, updated_at = NOW() WHERE id = ?', [studentId, existingAgent.student_matricule, existingAgent.id]);
          }
        }
      } catch (sqlErr) {
        console.warn('MySQL agent lookup fallback:', sqlErr);
      }
    }

    if (!existingAgent) {
      if (studentId) {
        existingAgent = adminStore.getReferralAgentByStudentId(studentId);
      }
      if (!existingAgent) {
        existingAgent = adminStore.getReferralAgentByMoMo(cleanMomo);
      }
    }

    if (existingAgent) {
      // If student is linking their profile, update it
      if (studentId && (!existingAgent.student_id || !existingAgent.student_matricule)) {
        existingAgent.student_id = studentId;
        existingAgent.student_matricule = studentMatricule || existingAgent.student_matricule;
        adminStore.saveReferralAgent(existingAgent);
      }

      return NextResponse.json({
        success: true,
        message: 'Welcome back! Your referral link and dashboard are ready.',
        is_existing: true,
        data: {
          ...existingAgent,
          referral_link: `${process.env.NEXT_PUBLIC_APP_URL || 'https://liahacademy.com'}/admissions?ref=${existingAgent.code}`
        }
      });
    }

    // Create new referral agent
    let newCode = generateUniqueCode(fullName);
    let attempts = 0;
    while (adminStore.getReferralAgentByCode(newCode) && attempts < 10) {
      newCode = generateUniqueCode(fullName);
      attempts++;
    }

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        const pool = getMySQLPool();
        const [insResult] = await pool.execute(
          `INSERT INTO referral_agents (code, full_name, momo_number, momo_name, email, phone, student_id, student_matricule, commission_per_student, total_referrals, paid_referrals, total_earned, total_paid, balance, status, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 15000, 0, 0, 0, 0, 0, 'active', NOW(), NOW())`,
          [newCode, fullName, cleanMomo, momoName || fullName, email, cleanMomo, studentId, studentMatricule || '']
        );
      } catch (sqlInsErr) {
        console.warn('MySQL agent insert notice:', sqlInsErr);
      }
    }

    const newAgent = adminStore.saveReferralAgent({
      code: newCode,
      full_name: fullName,
      momo_number: cleanMomo,
      momo_name: momoName || fullName,
      email,
      phone: cleanMomo,
      student_id: studentId,
      student_matricule: studentMatricule,
      commission_per_student: 15000,
      total_referrals: 0,
      paid_referrals: 0,
      total_earned: 0,
      total_paid: 0,
      balance: 0,
      status: 'active'
    });

    return NextResponse.json({
      success: true,
      message: '🎉 Congratulations! You are now an official Liah Academy Referral Agent.',
      is_existing: false,
      data: {
        ...newAgent,
        referral_link: `${process.env.NEXT_PUBLIC_APP_URL || 'https://liahacademy.com'}/admissions?ref=${newAgent.code}`
      }
    });

  } catch (err: any) {
    console.error('Referral registration error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not register referral agent. Please try again.' },
      { status: 500 }
    );
  }
}
