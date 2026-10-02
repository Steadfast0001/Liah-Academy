import { NextResponse } from 'next/server';
import { getDatabaseSourceMode } from '@/lib/db';
import { sanitizeInput } from '@/lib/security';
import { getChatSessionId } from '@/lib/chat-session';
import { getChatSession, markChatSessionRead, saveChatMessage } from '@/lib/chat-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const authorizedSessionId = getChatSessionId(request);

    if (!sessionId || !authorizedSessionId || sessionId !== authorizedSessionId) {
      return NextResponse.json({ success: false, message: 'Chat session is unavailable.' }, { status: 401 });
    }

    const session = await getChatSession(sessionId);
    if (!session) {
      return NextResponse.json({ success: true, messages: [] });
    }

    // Mark as read by user
    await markChatSessionRead(sessionId, 'user');

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      status: session.status,
      messages: session.messages || []
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Chat is temporarily unavailable.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const query = sanitizeInput(body?.query);
    const incomingSessionId = sanitizeInput(body?.sessionId);
    const sessionId = getChatSessionId(request);
    if (!sessionId || (incomingSessionId && incomingSessionId !== sessionId)) {
      return NextResponse.json({ success: false, message: 'Chat session is unavailable.' }, { status: 401 });
    }
    const userName = sanitizeInput(body?.userName);
    const userEmail = sanitizeInput(body?.userEmail);
    const userPhone = sanitizeInput(body?.userPhone);

    if (!query || !query.trim()) {
      return NextResponse.json({ 
        success: true,
        sessionId,
        response: 'Hello! Welcome to Liah Academy Admissions & Support Desk. How can we help you today?' 
      });
    }

    // 1. Record User Message in Chat Session for Admin
    await saveChatMessage(
      sessionId,
      { sender: 'user', text: query.trim(), sender_name: userName || 'Student / Visitor' },
      { user_name: userName, user_email: userEmail, user_phone: userPhone }
    );

    const q = query.toLowerCase().trim();

    // Helpful instant knowledge-base responses for common student questions
    let autoReply = '';

    if (q.includes('program') || q.includes('course') || q.includes('track') || q.includes('major') || q.includes('what do you offer') || q.includes('degree')) {
      autoReply = `🎓 **Academic Programs at Liah Academy**:

• **Higher National Diploma (HND - 2 Years)**:
  - Software Engineering
  - Cybersecurity & Cloud Defense
  - Network and Maintenance
  - Web and Graphics Design
  - Digital Marketing and E-Commerce

• **National Diploma (ND - 1 Year)**:
  - Computerized Accounting
  - Web Design
  - Information & Communication Tech (ICT)
  - Computer Engineering
  - Graphics Design and Printing
  - Basic Computer

• **Professional Certifications (6–9 Months)**:
  - DevOps Certification
  - Data Science Certification
  - Digital Marketing and SEO
  - Industrial Web Design

An admissions counselor is also available here to assist you with specific course details!`;
    } else if (q.includes('fee') || q.includes('tuition') || q.includes('cost') || q.includes('price') || q.includes('how much') || q.includes('pay') || q.includes('momo')) {
      autoReply = `💰 **Official Tuition Schedule**:

• **HND Programs**: 250,000 XAF / academic year (Installments accepted)
• **ND Programs**: 150,000 XAF / academic year
• **Professional Certifications**: 350,000 XAF
• **Application Fee**: 15,000 XAF (HND & ND) / 25,000 XAF (Certifications)

Direct MTN MoMo Merchant Code: \`*126*14*670265493*<Amount>#\` (Liah Academy).
Our admissions team is available to help confirm your payment.`;
    } else if (q.includes('admission') || q.includes('apply') || q.includes('enrol') || q.includes('register') || q.includes('how to apply') || q.includes('requirement')) {
      autoReply = `📋 **Admission & Enrolment Information**:

1. **Requirements**: GCE A-Level (min 2 passes) for HND or GCE O-Level (min 3 passes) for ND, certified birth certificate, and National ID/passport copy.
2. **Online Portal**: You can enrol directly through our Student Portal at [/portal?tab=enrol](/portal?tab=enrol).
3. **Tuition/App Fee**: Settle your application fee via MTN Mobile Money.

Feel free to ask any further questions right here!`;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('good morning') || q.includes('good afternoon') || q.includes('bonjour')) {
      autoReply = `Hello ${userName ? userName : ''}! 👋 Thank you for contacting Liah Academy. How can our admissions team assist you today?`;
    } else if (q.includes('hostel') || q.includes('accommodation') || q.includes('housing') || q.includes('dorm') || q.includes('room')) {
      autoReply = `🏠 **Accommodation Policy**:
Liah Academy does **not** provide on-campus dormitories or guaranteed hostel accommodation. Admitted students independently arrange off-campus housing.
Our campus is centrally located in **Bakweri Town, Buea**, surrounded by numerous independent private hostels and rental apartments within short walking distance.`;
    } else if (q.includes('online') || q.includes('remote') || q.includes('distance') || q.includes('e-learning') || q.includes('virtual')) {
      autoReply = `🏫 **Study Format Notice**:
There is **no online study format**. All academic programs at Liah Academy are conducted **100% on-campus** at our Bakweri Town campus in Buea to provide intensive hands-on lab work and physical workstation access. We offer full-time day cohorts and evening sessions for working learners.`;
    } else if (q.includes('where') || q.includes('location') || q.includes('campus') || q.includes('address') || q.includes('buea')) {
      autoReply = `📍 **Campus Location**:
Liah Academy Higher Institute of Technology is located at **Bakweri Town Campus, Buea, South West Region, Cameroon**.
All practical classes, coding labs, and lectures are held 100% on campus with 24/7 power backup and high-speed fiber internet.`;
    } else {
      autoReply = `Thank you for your message! Our admissions team and support staff have received your message and will reply to you directly here.`;
    }

    // Save auto-reply to thread
    await saveChatMessage(
      sessionId,
      { sender: 'agent', text: autoReply, sender_name: 'Liah Admissions Desk' }
    );

    return NextResponse.json({
      success: true,
      sessionId,
      response: autoReply
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Chat is temporarily unavailable.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
