import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { sanitizeInput, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

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
    const agentCode = sanitizeInput(body.agent_code || body.code);
    const amount = Number(body.amount);
    const momoNumber = sanitizeInput(body.momo_number || body.phone);

    if (!agentCode || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Please specify your agent code and a valid withdrawal amount.' },
        { status: 400 }
      );
    }

    if (amount < 2000) {
      return NextResponse.json(
        { success: false, message: 'Minimum withdrawal amount is 2,000 XAF.' },
        { status: 400 }
      );
    }

    await ensureMySQLTables();

    const agent = adminStore.getReferralAgentByCode(agentCode);
    if (!agent) {
      return NextResponse.json(
        { success: false, message: 'Referral agent account not found.' },
        { status: 404 }
      );
    }

    if (agent.balance < amount) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Insufficient balance. Your available balance is ${agent.balance.toLocaleString()} XAF.` 
        },
        { status: 400 }
      );
    }

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        const pool = getMySQLPool();
        const [agentRows] = await pool.execute('SELECT * FROM referral_agents WHERE UPPER(code) = ? LIMIT 1', [agentCode.toUpperCase()]);
        if (Array.isArray(agentRows) && agentRows.length > 0) {
          const dbAgent = (agentRows as any[])[0];
          if (Number(dbAgent.balance || 0) >= amount) {
            await pool.execute(
              `INSERT INTO referral_payouts (agent_id, agent_code, agent_name, momo_number, amount, status, transaction_id, proof_screenshot, admin_notes, requested_at)
               VALUES (?, ?, ?, ?, ?, 'pending', '', NULL, '', NOW())`,
              [dbAgent.id, dbAgent.code, dbAgent.full_name, momoNumber || dbAgent.momo_number, amount]
            );
            await pool.execute(
              `UPDATE referral_agents SET balance = balance - ?, updated_at = NOW() WHERE id = ?`,
              [amount, dbAgent.id]
            );
          }
        }
      } catch (sqlErr) {
        console.warn('MySQL payout request insert fallback:', sqlErr);
      }
    }

    const payout = adminStore.createPayoutRequest({
      agent_id: agent.id,
      agent_code: agent.code,
      agent_name: agent.full_name,
      momo_number: momoNumber || agent.momo_number,
      amount
    });

    if ('error' in payout) {
      return NextResponse.json(
        { success: false, message: payout.error },
        { status: 400 }
      );
    }

    // Notify administrators of payout request
    setImmediate(() => {
      try {
        import('@/lib/email').then(({ logEmailEvent }) => {
          logEmailEvent({
            recipient: 'info@liahacademy.com',
            recipient_type: 'admin',
            subject: `🔔 New MoMo Payout Request: ${amount.toLocaleString()} XAF by ${agent.full_name}`,
            type: 'admin_alert',
            status: 'logged',
            preview: `Agent ${agent.full_name} (${agent.code}) requested a payout of ${amount.toLocaleString()} XAF to MoMo ${momoNumber || agent.momo_number}.`
          });
        }).catch(() => {});
      } catch {}
    });

    return NextResponse.json({
      success: true,
      message: `Your withdrawal request of ${amount.toLocaleString()} XAF has been submitted to Administration. Once the MoMo deposit is made, payment screenshot proof will be available in your dashboard!`,
      data: payout
    });

  } catch (err: any) {
    console.error('Payout request error:', err);
    return NextResponse.json(
      { success: false, message: 'Could not process payout request. Please try again.' },
      { status: 500 }
    );
  }
}
