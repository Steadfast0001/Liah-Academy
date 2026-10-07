import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, ReferralAgent, ReferralItem, ReferralPayout } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = sanitizeInput(searchParams.get('code') || '');
    const momo = sanitizeInput(searchParams.get('momo') || '');
    const studentIdParam = searchParams.get('student_id');

    if (!code && !momo && !studentIdParam) {
      return NextResponse.json(
        { success: false, message: 'Please provide a referral code, MoMo number, or student ID.' },
        { status: 400 }
      );
    }

    let agent: ReferralAgent | undefined;
    let referrals: ReferralItem[] = [];
    let agentPayouts: ReferralPayout[] = [];

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        let agentRows: any[] = [];
        if (studentIdParam) {
          const [rows] = await pool.execute('SELECT * FROM referral_agents WHERE student_id = ? LIMIT 1', [Number(studentIdParam)]);
          agentRows = rows as any[];
        } else if (code) {
          const [rows] = await pool.execute('SELECT * FROM referral_agents WHERE UPPER(code) = ? LIMIT 1', [code.toUpperCase()]);
          agentRows = rows as any[];
        } else if (momo) {
          const cleanMomo = momo.replace(/[\s\-\+]/g, '');
          const [rows] = await pool.execute('SELECT * FROM referral_agents WHERE REPLACE(REPLACE(REPLACE(momo_number, " ", ""), "-", ""), "+", "") = ? LIMIT 1', [cleanMomo]);
          agentRows = rows as any[];
        }

        if (agentRows.length > 0) {
          const a = agentRows[0];
          agent = {
            ...a,
            commission_per_student: Number(a.commission_per_student || 15000),
            total_referrals: Number(a.total_referrals || 0),
            paid_referrals: Number(a.paid_referrals || 0),
            total_earned: Number(a.total_earned || 0),
            total_paid: Number(a.total_paid || 0),
            balance: Number(a.balance || 0)
          };

          const [refRows] = await pool.execute('SELECT * FROM referrals WHERE agent_id = ? OR UPPER(agent_code) = ? ORDER BY id DESC', [agent.id, agent.code.toUpperCase()]);
          referrals = (refRows as any[]).map(r => ({
            ...r,
            commission_amount: Number(r.commission_amount || 15000)
          }));

          const [payoutRows] = await pool.execute('SELECT * FROM referral_payouts WHERE agent_id = ? OR UPPER(agent_code) = ? ORDER BY id DESC', [agent.id, agent.code.toUpperCase()]);
          agentPayouts = (payoutRows as any[]).map(p => ({
            ...p,
            amount: Number(p.amount || 0)
          }));
        }
      } catch (mysqlErr) {
        console.warn('MySQL referral stats fallback:', mysqlErr);
      }
    }

    if (!agent) {
      if (code) {
        agent = adminStore.getReferralAgentByCode(code);
      } else if (momo) {
        agent = adminStore.getReferralAgentByMoMo(momo);
      } else if (studentIdParam) {
        agent = adminStore.getReferralAgentByStudentId(Number(studentIdParam));
      }

      if (agent) {
        referrals = adminStore.getReferralsByAgent(agent.id);
        const allPayouts = adminStore.getPayoutRequests();
        agentPayouts = allPayouts.filter(p => p.agent_id === agent!.id || p.agent_code.toUpperCase() === agent!.code.toUpperCase());
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://liahacademy.com';
    const siteSettings = adminStore.getSettings();
    const regEndDateStr = siteSettings.registration_end_date || '2026-10-31';
    const regPeriodTitle = siteSettings.registration_period_title || 'Fall 2026 Admissions Intake';
    const isUnlocked = Boolean(siteSettings.payouts_unlocked);
    const now = new Date();
    const deadlineDate = new Date(regEndDateStr);
    // Allow payout if deadline has passed OR admin manually unlocked payouts
    const canRequestPayout = isUnlocked || now >= deadlineDate;

    return NextResponse.json({
      success: true,
      data: {
        agent: {
          ...agent,
          referral_link: `${appUrl}/admissions?ref=${agent.code}`,
          portal_link: `${appUrl}/portal?ref=${agent.code}`
        },
        downline: referrals,
        payouts: agentPayouts,
        registration_period: {
          end_date: regEndDateStr,
          title: regPeriodTitle,
          is_unlocked: isUnlocked,
          is_ended: now >= deadlineDate,
          can_request_payout: canRequestPayout
        },
        summary: {
          total_referrals: agent.total_referrals || referrals.length,
          paid_referrals: referrals.filter(r => (r.payment_status || '').toLowerCase().includes('paid')).length,
          total_earned: agent.total_earned,
          total_paid: agent.total_paid,
          balance: agent.balance,
          can_request_payout: canRequestPayout,
          payout_available_date: regEndDateStr
        }
      }
    });

  } catch (err: any) {
    console.error('Referral stats error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not load referral dashboard data.' },
      { status: 500 }
    );
  }
}
