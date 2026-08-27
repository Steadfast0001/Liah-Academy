import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query || typeof query !== 'string') {
      return NextResponse.json({ 
        response: 'Hello! I am Liah Assist Bot. How can I help you today with admissions, courses, or tuition payments?' 
      });
    }

    const q = query.toLowerCase().trim();

    // 1. Check for Status Lookup Intent (Email or Student ID detection)
    const emailMatch = query.match(/[\w.-]+@[\w.-]+\.\w+/i);
    const idMatch = query.match(/(?:id|#|student\s*id|application\s*id)\s*[:#]?\s*(\d{3,6})/i);
    const isStatusQuery = q.includes('status') || q.includes('track') || q.includes('check') || q.includes('dossier') || q.includes('application');

    if ((emailMatch || idMatch) && isStatusQuery) {
      let student = null;
      if (emailMatch) {
        student = adminStore.getStudentByEmail(emailMatch[0]);
      } else if (idMatch) {
        student = adminStore.getStudentById(parseInt(idMatch[1]));
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
          response: `I couldn't find an application matching **${emailMatch ? emailMatch[0] : (idMatch ? idMatch[1] : query)}**. Please make sure you registered on the Admissions page, or you can start a new application right now!`,
          actionType: 'apply_action'
        });
      }
    }

    // 2. Check for Payment Intent
    const paymentKeywords = ['pay', 'payment', 'tuition payment', 'momo', 'mobile money', 'campay', 'deposit', 'fee', 'settle', 'clearance', 'orange', 'mtn'];
    const isPaymentIntent = paymentKeywords.some(kw => q.includes(kw)) && (q.includes('pay') || q.includes('momo') || q.includes('money') || q.includes('deposit') || q.includes('fee') || q.includes('tuition'));

    if (isPaymentIntent) {
      let matchedStudent = null;
      if (emailMatch) {
        matchedStudent = adminStore.getStudentByEmail(emailMatch[0]);
      }

      return NextResponse.json({
        response: `I can process your Mobile Money payment (MTN / Orange) directly right here! Please select your payment item and enter your details below:`,
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

    // 3. Knowledge Base & Intent Matching
    const intents = [
      {
        keywords: ['admission', 'apply', 'register', 'signup', 'sign up', 'enrol', 'enroll', 'gce', 'transcript', 'process', 'requirement'],
        response: `To apply to Liah Academy:
1. **Choose Program**: Select from our HND, ND, or Professional Certification tracks.
2. **Online Registration**: Fill out Step 1 (Personal Details) & Step 2 (Degree Track).
3. **Upload Documents**: Attach your GCE A-Level, O-Level, or Academic Transcripts.
4. **Complete Payment**: Pay the 10,000 XAF registration fee via Mobile Money directly in this chat or on the portal.
5. **Receive Decision**: Once reviewed, your official admission letter is generated immediately!`,
        actionType: 'apply_action'
      },
      {
        keywords: ['fee', 'tuition', 'cost', 'price', 'amount', 'installment', 'split', 'xaf', 'francs', 'expensive', 'cheap', 'discount'],
        response: `Liah Academy Tuition Fees & Financial Aid:
• **HND Tracks**: 250,000 XAF/year
• **ND (National Diploma)**: 150,000 XAF/year
• **Professional Certifications**: 350,000 XAF
• **Application Auditing Fee**: 10,000 XAF

💡 **Payment Information**:
- Transparent, fixed semester tuition fees
- Convenient Mobile Money payment options (MTN MoMo & Orange Money)

You can pay your tuition directly in this chat using Mobile Money!`,
        actionType: 'tuition_action'
      },
      {
        keywords: ['course', 'program', 'track', 'degree', 'major', 'study', 'learn', 'teach', 'hnd', 'nd', 'certification', 'software', 'marketing', 'accounting', 'devops', 'network', 'cybersecurity', 'data science'],
        response: `We offer cutting-edge industry-standard programs:
• **School of Engineering & Technology**: Software Engineering (HND), Cybersecurity & Cloud Defense (HND), Computer Engineering (ND), Web & Graphics Design.
• **School of Business & Management**: Accounting, Marketing, Human Resource Management, Management.
• **Certification Programs**: Data Science & Machine Learning (9 mos), DevOps & Cloud Specialist (9 mos), Industrial Web Design (6 mos).

All programs feature 100% lab-based projects and direct corporate integration!`,
        actionType: 'programs_action'
      },
      {
        keywords: ['location', 'address', 'buea', 'backweri', 'bakweri', 'where', 'find', 'map', 'campus', 'coordinates', 'direction', 'place', 'cameroon'],
        response: `📍 **Campus Location**:
Liah Academy is located in **Backweri Town, Buea, Southwest Region, Cameroon**, nestled near the foothills of Mount Cameroon.

Our modern facility includes high-speed fiber labs, dedicated corporate software development centers, and 24/7 security with standby generator backup.`,
        actionType: 'location_action'
      },
      {
        keywords: ['housing', 'hostel', 'accommodation', 'dorm', 'room', 'rent', 'live', 'stay', 'apartment'],
        response: `Student Accommodation & Hostels:
While we do not operate on-campus dormitories, our Student Affairs office directly assists all admitted students in securing clean, safe, and highly affordable student hostels located 2–5 minutes from campus in Backweri Town, Buea.`
      },
      {
        keywords: ['internship', 'job', 'work', 'employ', 'career', 'corporate', 'placement', 'company', 'hire', 'industry'],
        response: `💼 **Corporate Internship Guarantee**:
All Liah Academy students undergo practical work placements in our **Corporate Software Development & IT Services Division**. Students develop live client systems, collaborate with senior software engineers, and graduate with documented real-world experience.`
      },
      {
        keywords: ['scholarship', 'financial', 'aid', 'reduction', 'merit', 'help', 'grant'],
        response: `🎓 **Scholarships & Aid**:
We offer merit-based and need-based financial assistance for deserving candidates. Apply early during admissions or contact **info@liahacademy.com** / **+237 652 154 095**.`
      },
      {
        keywords: ['wifi', 'internet', 'lab', 'computer', 'facility', 'power', 'generator', 'security', 'classroom', 'equipment'],
        response: `⚡ **Campus Amenities & Infrastructure**:
• High-speed fiber-optic Wi-Fi throughout campus
• Modern workstations with Linux & Windows dev environments
• Automatic power generator backup system
• 24/7 on-site security and CCTV coverage`
      },
      {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'assistant', 'bot', 'who are you'],
        response: `Hello! I am **Liah Assist AI** 🤖, your virtual academic advisor.
I can help you:
1. 💳 **Pay Application Fees & Tuition via Mobile Money (MTN / Orange)**
2. 🔍 **Check Application & Admission Review Status**
3. 📚 **Explore Degrees, Syllabi & Course Details**
4. 💰 **Calculate Tuition Fees & Discounts**

What would you like to do?`
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
      response: `Thank you for asking! For personalized admissions guidance, course advising, or tuition clearance, you can chat with me, email **info@liahacademy.com**, or call **+237 652 154 095** / **+237 699 526 607**.`,
      actionType: 'general_action'
    });
  } catch (error: any) {
    return NextResponse.json({ 
      response: 'I am currently having trouble processing this request. Please contact admissions at info@liahacademy.com.' 
    });
  }
}
