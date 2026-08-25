import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ response: 'Please type a question!' });
    }

    const q = query.toLowerCase().trim();

    const intents = [
      {
        keywords: ['admission', 'apply', 'register', 'signup', 'sign up', 'enrol', 'application', 'status', 'portal', 'tracker', 'gce', 'transcript', 'document', 'process'],
        response: `To apply to Liah Academy:
1. Go to the Admissions page.
2. Complete Step 1 (Personal Info) & Step 2 (Select Degree & Track).
3. Step 3: Upload your GCE results or transcripts (PDF/DOCX) and submit.
4. Pay the 10,000 XAF application fee via Mobile Money (Campay/MTN/Orange).
5. Log in to your portal using your email and password to track your review status!`
      },
      {
        keywords: ['fee', 'tuition', 'cost', 'pay', 'finance', 'price', 'amount', 'installment', 'split', 'xaf', 'francs', 'cash', 'money', 'expensive', 'cheap'],
        response: `Liah Academy Tuition Fees:
• HND: 250,000 XAF/year
• ND (National Diploma): 150,000 XAF/year
• Professional Certifications: 350,000 XAF
• Application Auditing Fee: 10,000 XAF

💡 Discounts: 15% discount for Online study format, 10% discount for Part-Time study, and 5% off if you pay the full tuition upfront. Installment payments (2 or 3 parts) are fully supported!`
      },
      {
        keywords: ['course', 'program', 'track', 'degree', 'major', 'study', 'learn', 'teach', 'hnd', 'nd', 'certification', 'software', 'marketing', 'accounting', 'devops', 'network', 'secretaryship', 'science', 'engineering'],
        response: `We offer courses in 3 major tracks:
• HND: Software Engineering, Web & Graphics Design, Digital Marketing, Network & Maintenance, Accounting, Management, HR.
• ND: Computer Engineering, ICT, Web Design, Graphics Design & Printing, Office Automation Secretaryship, Computerized Accounting.
• Certifications: Data Science (9 mos), DevOps (9 mos), Industrial Web Design (6 mos), Digital Marketing & SEO.

All tracks feature project-first labs and corporate internships!`
      },
      {
        keywords: ['location', 'address', 'buea', 'backweri', 'bakweri', 'where', 'find', 'map', 'campus', 'coordinates', 'direction', 'place', 'cameroon'],
        response: `Liah Academy is located in Backweri Town, Buea, Southwest Region, Cameroon.
Our campus features dedicated server labs and interactive workspaces nestled in the foothills of Mount Cameroon. Visit our Contact page to view our interactive location map!`
      },
      {
        keywords: ['housing', 'hostel', 'accommodation', 'dorm', 'room', 'rent', 'live', 'stay', 'apartment'],
        response: `We don't have direct on-campus student dorms. However, our Student Affairs office helps newly admitted students find secure, clean, and highly affordable hostels or apartments in Backweri Town and around Buea.`
      },
      {
        keywords: ['internship', 'job', 'work', 'employ', 'career', 'corporate', 'placement', 'company', 'hire', 'industry'],
        response: `All Liah Academy students undergo direct practical internship placements in our Corporate Software Development & IT Services Division. Students build real-world products for global companies and graduate with solid work experience.`
      },
      {
        keywords: ['scholarship', 'financial', 'aid', 'discount', 'free', 'reduction', 'merit', 'help'],
        response: `Yes! We offer need-based and merit-based financial aid. You also get a 15% discount for online formats, 10% for part-time, and a 5% discount if you pay the full amount upfront. Reach out to info@liahacademy.com.`
      },
      {
        keywords: ['wifi', 'internet', 'lab', 'computer', 'facility', 'power', 'generator', 'security', 'classroom', 'equipment'],
        response: `Our campus workspace is equipped with high-speed fiber-optic Wi-Fi, modern computer labs, an automatic power-generator backup system, and 24/7 security with CCTV.`
      },
      {
        keywords: ['hello', 'hi', 'hey', 'greetings', 'morning', 'afternoon', 'evening', 'assistant', 'bot'],
        response: `Hello! I am Liah Assist Bot 🤖, your virtual student coordinator. I can guide you through admissions, course details, tuition calculators, hostel assistance, and internship questions. What can I help you with today?`
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
      return NextResponse.json({ response: bestIntent.response });
    }

    return NextResponse.json({
      response: `Thank you for asking Liah Assist Bot! For personalized guidance, please contact our admissions office at info@liahacademy.com, call +237 652 154 095, or visit our campus in Backweri Town, Buea.`
    });
  } catch (error) {
    return NextResponse.json({ response: 'I am currently having trouble answering. Please contact info@liahacademy.com.' });
  }
}
