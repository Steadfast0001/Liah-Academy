import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const query = typeof body?.query === 'string' ? body.query : '';
    if (!query || !query.trim()) {
      return NextResponse.json({ 
        response: 'Hello! I am Liah Assist AI 🤖. How can I help you today with admissions, degree programs, or tuition payments?' 
      });
    }

    const q = query.toLowerCase().trim();

    // 1. Check for Status Lookup Intent (Email or Student ID detection)
    const emailMatch = query.match(/[\w.-]+@[\w.-]+\.\w+/i);
    const idMatch = query.match(/(?:id|#|student\s*id|application\s*id)\s*[:#]?\s*(\d{1,6})/i);
    const isStatusQuery = q.includes('status') || q.includes('track') || q.includes('check') || q.includes('dossier') || q.includes('application') || q.includes('my admission');

    if ((emailMatch || idMatch || isStatusQuery) && (emailMatch || idMatch)) {
      let student = null;
      try {
        if (emailMatch) {
          student = adminStore.getStudentByEmail(emailMatch[0]);
        } else if (idMatch) {
          student = adminStore.getStudentById(parseInt(idMatch[1]));
        }
      } catch (err) {
        console.error('Student lookup error:', err);
      }

      if (student) {
        return NextResponse.json({
          response: `I found the application dossier for **${student.full_name}**! Here are your live enrollment details:`,
          actionType: 'status_card',
          studentData: {
            id: student.id,
            full_name: student.full_name,
            email: student.email,
            phone: student.phone,
            degree_type: student.degree_type,
            program_type: student.program_type,
            study_format: student.study_format,
            admission_status: student.admission_status,
            payment_status: student.payment_status,
            created_at: student.created_at
          }
        });
      } else {
        return NextResponse.json({
          response: `I couldn't find an application matching **${emailMatch ? emailMatch[0] : (idMatch ? idMatch[1] : query)}**. Please ensure you registered on the Admissions portal, or you can start a new application right now!`,
          actionType: 'apply_action'
        });
      }
    }

    // 2. Check for Payment / MoMo Intent
    const paymentKeywords = ['pay', 'payment', 'tuition payment', 'momo', 'mobile money', 'deposit', 'fee', 'settle', 'clearance', 'mtn', 'short code', '*126*'];
    const isPaymentIntent = paymentKeywords.some(kw => q.includes(kw));

    if (isPaymentIntent && (q.includes('pay') || q.includes('momo') || q.includes('money') || q.includes('deposit') || q.includes('fee') || q.includes('tuition') || q.includes('code'))) {
      let matchedStudent = null;
      if (emailMatch) {
        try {
          matchedStudent = adminStore.getStudentByEmail(emailMatch[0]);
        } catch {}
      }

      return NextResponse.json({
        response: `Here is the official MTN Mobile Money instant payment short code: **\*126\*14\*670265493\*Amount#**.\n\nSelect your fee amount below, then tap **"Pay Now — Open MTN MoMo"** to dial the code and enter your secret PIN on your phone:`,
        actionType: 'payment_form',
        prefillData: matchedStudent ? {
          studentId: matchedStudent.id,
          email: matchedStudent.email,
          phone: matchedStudent.phone,
          fullName: matchedStudent.full_name,
          program: matchedStudent.program_type
        } : null
      });
    }

    // 3. Comprehensive Knowledge Base & Intent Matching
    const intents = [
      {
        keywords: ['admission', 'apply', 'register', 'signup', 'sign up', 'enrol', 'enroll', 'gce', 'transcript', 'process', 'requirement', 'step', 'portal'],
        response: `📋 **How to Apply to Liah Academy**:
1. **Choose Program**: Select from our HND (2 Years), ND (1 Year), or Professional Certification tracks.
2. **Personal & Academic Details**: Fill out Step 1 & Step 2 on our Admissions page.
3. **Upload Documents**: Attach your GCE A-Level, O-Level, or Academic Transcripts.
4. **Complete Payment**: Settle the 10,000 XAF registration fee via MTN Mobile Money short code: **\*126\*14\*670265493\*10000#**.
5. **Instant Decision**: Once reviewed, your official admission letter is generated on the portal!`,
        actionType: 'apply_action'
      },
      {
        keywords: ['fee', 'tuition', 'cost', 'price', 'amount', 'installment', 'split', 'xaf', 'francs', 'expensive', 'cheap', 'discount', 'how much'],
        response: `💰 **Liah Academy Tuition Fees & Structure**:
• **Higher National Diploma (HND)**: 250,000 XAF / academic year (Installments accepted)
• **National Diploma (ND)**: 150,000 XAF / academic year
• **Professional Certifications**: 350,000 XAF (Comprehensive 6–9 months)
• **Application Registration Fee**: 10,000 XAF

💡 **Official MTN MoMo Short Code**:
\`*126*14*670265493*<Amount>#\`
You can initiate fee payments directly inside this chat or on the admissions portal!`,
        actionType: 'tuition_action'
      },
      {
        keywords: ['course', 'program', 'track', 'degree', 'major', 'study', 'learn', 'teach', 'hnd', 'nd', 'certification', 'software', 'devops', 'network', 'cybersecurity', 'data science', 'cloud'],
        response: `🎓 **Technical Degree Programs Offered**:
• **Higher National Diplomas (HND - 2 Years)**:
  - Software Engineering
  - Cybersecurity & Cloud Defense
  - Network and Maintenance
  - Web and Graphics Design
  - Digital Marketing & E-Commerce

• **National Diplomas (ND - 1 Year)**:
  - Computer Engineering
  - Information & Communication Tech (ICT)
  - Web Design
  - Computerized Accounting
  - Graphics Design & Printing
  - Basic Computer

• **Professional Certifications**:
  - Data Science & Machine Learning
  - DevOps & Cloud Architecture
  - Industrial Web Design
  - Digital Marketing & SEO

All programs feature 100% lab-based projects with live corporate internships!`,
        actionType: 'programs_action'
      },
      {
        keywords: ['location', 'address', 'buea', 'backweri', 'bakweri', 'where', 'find', 'map', 'campus', 'coordinates', 'direction', 'place', 'cameroon', 'southwest'],
        response: `📍 **Campus Location & Address**:
Liah Academy is located in **Backweri Town, Buea, Southwest Region, Cameroon**, right by the foothills of Mount Cameroon.

🏢 **Facilities include**: High-speed fiber computer labs, software incubation center, air-conditioned lecture halls, standby power generators, and 24/7 security.`,
        actionType: 'location_action'
      },
      {
        keywords: ['contact', 'phone', 'call', 'email', 'whatsapp', 'reach', 'talk', 'human', 'support', 'help', 'number'],
        response: `📞 **Contact Liah Academy Admissions**:
• **Phone / WhatsApp**: +237 652 154 095 / +237 699 526 607
• **Email**: info@liahacademy.com / admissions@liahacademy.com
• **Campus**: Backweri Town, Buea, Cameroon
• **Hours**: Monday – Saturday, 8:00 AM – 5:00 PM WAT`,
        actionType: 'general_action'
      },
      {
        keywords: ['internship', 'job', 'work', 'employ', 'career', 'corporate', 'placement', 'company', 'hire', 'industry', 'experience'],
        response: `💼 **Corporate Internship & Job Placement**:
Every student at Liah Academy is guaranteed practical work experience in our **Corporate Software Engineering Division**. You will build live commercial web and mobile applications for global clients and graduate with a verified production portfolio!`,
        actionType: 'general_action'
      },
      {
        keywords: ['scholarship', 'financial', 'aid', 'reduction', 'merit', 'help', 'grant', 'discount'],
        response: `🎓 **Scholarships & Financial Grants**:
We provide merit-based awards and need-based fee reductions for promising students in Cameroon and across Africa. Contact **info@liahacademy.com** or WhatsApp **+237 652 154 095** to submit your scholarship request!`,
        actionType: 'general_action'
      },
      {
        keywords: ['housing', 'hostel', 'accommodation', 'dorm', 'room', 'rent', 'live', 'stay', 'apartment'],
        response: `🏠 **Student Accommodation**:
Our Student Affairs department directly assists newly admitted students in securing clean, safe, and furnished student hostels within 2–5 minutes walking distance from the campus in Backweri Town, Buea.`
      },
      {
        keywords: ['format', 'online', 'evening', 'part time', 'weekend', 'full time', 'distance', 'hybrid'],
        response: `🕒 **Study Formats Available**:
• **Full-Time On-Campus**: Monday to Friday hands-on laboratory workshops.
• **Evening & Part-Time**: Designed for working professionals (5:00 PM – 8:00 PM).
• **Weekend Track**: Saturdays intensive practical sessions.
• **Hybrid / Online**: Remote lectures with localized lab assessments.`
      },
      {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'assistant', 'bot', 'who are you'],
        response: `Hello! I am **Liah Assist AI** 🤖, your 24/7 Academic Advisor at Liah Academy.

Here is how I can assist you:
1. 💳 **MTN MoMo Fees Payment**: Generate short codes and auto-confirm transactions
2. 🔍 **Track Application**: Check your admission and document verification status
3. 📚 **Programs & Syllabi**: Explore HND, ND, and Certification course tracks
4. 💰 **Tuition & Grants**: Review fee breakdown and installments
5. 📍 **Campus Location & Contact**: Directions and direct WhatsApp support

How can I help you today?`
      }
    ];

    let bestIntent: any = null;
    let maxScore = 0;

    intents.forEach(intent => {
      let score = 0;
      intent.keywords.forEach(keyword => {
        if (q.includes(keyword)) {
          score += keyword.length;
        }
      });
      if (score > maxScore) {
        maxScore = score;
        bestIntent = intent;
      }
    });

    if (bestIntent && maxScore > 0) {
      return NextResponse.json({ 
        response: bestIntent.response,
        actionType: bestIntent.actionType || 'none'
      });
    }

    return NextResponse.json({
      response: `Thank you for asking! For detailed admissions inquiries, course registration, or fee payments, you can chat with me, email **info@liahacademy.com**, or call/WhatsApp **+237 652 154 095** / **+237 699 526 607**.`,
      actionType: 'general_action'
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      response: 'Hello! I am Liah Assist AI 🤖. How can I help you today with admissions, degree programs, or tuition payments?' 
    });
  }
}
