import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface EmailLog {
  id: string;
  recipient: string;
  recipient_type: 'applicant' | 'admin' | 'user';
  subject: string;
  type: 'application_submitted' | 'admin_alert' | 'inquiry_submitted' | 'application_approved' | 'application_rejected' | 'custom';
  status: 'sent' | 'logged';
  preview: string;
  created_at: string;
}

// Get admin notification email
export function getAdminEmail(): string {
  try {
    const configPath = path.join(process.cwd(), 'data', 'liah_academy_store.json');
    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (data.settings && data.settings.admin_email) {
        return data.settings.admin_email;
      }
    }
  } catch (e) {}
  return process.env.ADMIN_EMAIL || 'info@liahacademy.com';
}

// Log email event to file and data store
export function logEmailEvent(log: Omit<EmailLog, 'id' | 'created_at'>) {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const storePath = path.join(dataDir, 'liah_academy_store.json');
    let store: any = { email_logs: [] };
    if (fs.existsSync(storePath)) {
      store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
    }
    if (!store.email_logs) store.email_logs = [];

    const newLog: EmailLog = {
      id: `em_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      created_at: new Date().toISOString(),
      ...log
    };

    store.email_logs.unshift(newLog);
    // Keep last 200 logs
    if (store.email_logs.length > 200) {
      store.email_logs = store.email_logs.slice(0, 200);
    }
    fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');

    // Also write to email_notifications.log text file
    const logFilePath = path.join(dataDir, 'email_notifications.log');
    const logLine = `[${newLog.created_at}] [${newLog.status.toUpperCase()}] TO: ${newLog.recipient} | TYPE: ${newLog.type} | SUBJECT: "${newLog.subject}"\n`;
    fs.appendFileSync(logFilePath, logLine, 'utf-8');

    return newLog;
  } catch (err) {
    console.error('Error logging email event:', err);
    return null;
  }
}

// Core mail dispatcher
export async function sendEmail({
  to,
  subject,
  html,
  text,
  type,
  recipientType
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  type: EmailLog['type'];
  recipientType: EmailLog['recipient_type'];
}) {
  let status: 'sent' | 'logged' = 'logged';

  // If SMTP environment credentials exist, attempt real transmission
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      await transporter.sendMail({
        from: `"Liah Academy" <${process.env.SMTP_FROM || 'info@liahacademy.com'}>`,
        to,
        subject,
        text,
        html
      });
      status = 'sent';
    } catch (err) {
      console.warn('SMTP delivery notice (logged to store):', err);
      status = 'logged';
    }
  } else {
    // Development / Local operational mode: safely logs and registers the signal
    status = 'logged';
  }

  // Register the signal in logs & admin dashboard outbox
  logEmailEvent({
    recipient: to,
    recipient_type: recipientType,
    subject,
    type,
    status,
    preview: text.substring(0, 160)
  });

  return { success: true, status, recipient: to };
}

// 1. SIGNAL ON ADMISSION APPLICATION SUBMISSION
export async function sendApplicationSignals(student: {
  id: number | string;
  full_name: string;
  email: string;
  phone?: string;
  degree_type: string;
  program_type: string;
  study_format: string;
}) {
  const adminEmail = getAdminEmail();

  // A. Email to Applicant
  const applicantHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="color: #F5A623; margin: 0 0 6px 0; font-size: 24px;">Liah Academy</h1>
        <p style="margin: 0; color: #cbd5e1; font-size: 14px;">Higher Technical Institute &bull; Buea, Cameroon</p>
      </div>
      <div style="padding: 28px 24px; color: #334155; line-height: 1.6;">
        <h2 style="color: #081F3E; margin-top: 0;">Application Received, ${student.full_name}!</h2>
        <p>Thank you for applying to <strong>Liah Academy</strong>. Your application has been registered successfully and is currently under review by our admissions board.</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #F5A623; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <h4 style="margin: 0 0 10px 0; color: #081F3E;">Application Reference Details</h4>
          <p style="margin: 4px 0;"><strong>Application ID:</strong> #${student.id}</p>
          <p style="margin: 4px 0;"><strong>Degree Level:</strong> ${student.degree_type}</p>
          <p style="margin: 4px 0;"><strong>Program Track:</strong> ${student.program_type}</p>
          <p style="margin: 4px 0;"><strong>Study Format:</strong> ${student.study_format.toUpperCase()}</p>
          <p style="margin: 4px 0;"><strong>Status:</strong> <span style="color: #B45309; font-weight: bold;">Under Review</span></p>
        </div>

        <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 14px; border-radius: 4px; margin: 18px 0; color: #92400E; font-size: 13px;">
          <strong>⚠️ IMPORTANT ENROLLMENT POLICY:</strong><br/>
          Please note that <em>all registrations and seat reservations are complete only after the applicant has completed payment</em> (tuition deposit / registration installment).
        </div>

        <h4 style="color: #081F3E; margin-bottom: 8px;">What Happens Next?</h4>
        <ol style="padding-left: 20px; margin-top: 4px;">
          <li>Our academic committee reviews your qualifications and transcripts.</li>
          <li>You will receive an email signal with your final admission decision and payment schedule.</li>
          <li>You can track your live application status anytime on the <a href="http://localhost:3000/admissions" style="color: #081F3E; font-weight: bold;">Admissions Portal</a> using your registered email.</li>
        </ol>

        <p style="margin-top: 24px; font-size: 13px; color: #64748B;">For immediate assistance, visit our campus in Backweri Town, Buea or call +237 652 154 095.</p>
      </div>
      <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Liah Academy. All rights reserved.
      </div>
    </div>
  `;

  const applicantText = `Application Received at Liah Academy! Reference ID: #${student.id}. Track: ${student.program_type} (${student.degree_type}). Status: Under Review. Log in to http://localhost:3000/admissions to check status.`;

  // B. Email to Admin
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 20px; text-align: center; color: #ffffff;">
        <span style="background: #F5A623; color: #081F3E; font-size: 12px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">ADMIN NOTIFICATION</span>
        <h2 style="margin: 10px 0 0 0; color: #ffffff;">New Admission Application Submitted</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>A new applicant has just submitted an application through the admissions portal.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Application ID</td><td style="padding: 8px 0; color: #081F3E; font-weight: bold;">#${student.id}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Full Name</td><td style="padding: 8px 0; color: #081F3E;">${student.full_name}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Email Address</td><td style="padding: 8px 0; color: #081F3E;">${student.email}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Phone</td><td style="padding: 8px 0; color: #081F3E;">${student.phone || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Degree Level</td><td style="padding: 8px 0; color: #081F3E;">${student.degree_type}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Program Track</td><td style="padding: 8px 0; color: #081F3E;">${student.program_type}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Study Format</td><td style="padding: 8px 0; color: #081F3E;">${student.study_format.toUpperCase()}</td></tr>
        </table>

        <div style="margin-top: 24px; text-align: center;">
          <a href="http://localhost:3000/admin" style="background: #F5A623; color: #081F3E; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Open Admin Panel to Review Application &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  const adminText = `🚨 New Application #${student.id} submitted by ${student.full_name} for ${student.program_type} (${student.degree_type}). Email: ${student.email}. Open admin panel at http://localhost:3000/admin to review.`;

  // Dispatch both asynchronously
  await Promise.all([
    sendEmail({
      to: student.email,
      subject: `Application Confirmation #${student.id} - Liah Academy`,
      html: applicantHtml,
      text: applicantText,
      type: 'application_submitted',
      recipientType: 'applicant'
    }),
    sendEmail({
      to: adminEmail,
      subject: `🚨 [New Application] #${student.id}: ${student.full_name} - ${student.program_type}`,
      html: adminHtml,
      text: adminText,
      type: 'admin_alert',
      recipientType: 'admin'
    })
  ]);
}

// 2. SIGNAL ON DIRECT INQUIRY SUBMISSION
export async function sendInquirySignals(inquiry: {
  id: number | string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const adminEmail = getAdminEmail();

  // A. Confirmation to Sender
  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 24px; text-align: center; color: #ffffff;">
        <h2 style="color: #F5A623; margin: 0;">Liah Academy</h2>
        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 14px;">Direct Inquiry Receipt</p>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>Hello <strong>${inquiry.name}</strong>,</p>
        <p>We have received your message regarding <strong>"${inquiry.subject}"</strong>. Our admissions and corporate support team in Buea will review your inquiry and get back to you shortly.</p>
        
        <div style="background: #f8fafc; padding: 14px; border-radius: 6px; margin: 16px 0; font-size: 14px; color: #64748B;">
          <strong>Your Message:</strong><br/>
          <em>"${inquiry.message}"</em>
        </div>

        <p style="font-size: 13px; color: #64748B;">If your inquiry is urgent, please feel free to call our campus telephone lines at +237 652 154 095.</p>
      </div>
    </div>
  `;

  // B. Alert to Admin
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 20px; text-align: center; color: #ffffff;">
        <span style="background: #F5A623; color: #081F3E; font-size: 12px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">DIRECT INQUIRY ALERT</span>
        <h2 style="margin: 10px 0 0 0; color: #ffffff;">New Message from Website</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p><strong>From:</strong> ${inquiry.name} (<a href="mailto:${inquiry.email}">${inquiry.email}</a>)</p>
        <p><strong>Subject:</strong> ${inquiry.subject}</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #081F3E; padding: 14px; margin: 16px 0; border-radius: 4px;">
          ${inquiry.message}
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="http://localhost:3000/admin" style="background: #081F3E; color: #F5A623; font-weight: bold; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage Inquiries in Admin Panel &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  await Promise.all([
    sendEmail({
      to: inquiry.email,
      subject: `Inquiry Received: ${inquiry.subject} - Liah Academy`,
      html: userHtml,
      text: `Hello ${inquiry.name}, thank you for contacting Liah Academy regarding "${inquiry.subject}". We will reply shortly.`,
      type: 'inquiry_submitted',
      recipientType: 'user'
    }),
    sendEmail({
      to: adminEmail,
      subject: `📬 [Direct Inquiry] ${inquiry.subject} (from ${inquiry.name})`,
      html: adminHtml,
      text: `New Direct Inquiry from ${inquiry.name} (${inquiry.email}). Subject: ${inquiry.subject}. Message: ${inquiry.message}`,
      type: 'admin_alert',
      recipientType: 'admin'
    })
  ]);
}

// 3. SIGNAL ON ADMISSION DECISION (APPROVED / REJECTED)
export async function sendDecisionSignal(student: {
  id: number | string;
  full_name: string;
  email: string;
  program_type: string;
  degree_type: string;
}, decision: 'Approved' | 'Rejected') {
  const isApproved = decision === 'Approved';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: ${isApproved ? '#081F3E' : '#1E293B'}; padding: 24px; text-align: center; color: #ffffff;">
        <h1 style="color: ${isApproved ? '#F5A623' : '#F87171'}; margin: 0 0 6px 0; font-size: 22px;">
          ${isApproved ? '🎉 Official Offer of Admission' : 'Application Status Update'}
        </h1>
        <p style="margin: 0; color: #cbd5e1; font-size: 14px;">Liah Academy &bull; Buea Campus</p>
      </div>
      <div style="padding: 28px 24px; color: #334155; line-height: 1.6;">
        <p>Dear <strong>${student.full_name}</strong>,</p>
        
        ${isApproved ? `
          <p>Congratulations! We are delighted to inform you that your application for admission to <strong>${student.program_type} (${student.degree_type})</strong> at Liah Academy has been <strong>OFFICIALLY APPROVED</strong>.</p>
          
          <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <h4 style="margin: 0 0 8px 0; color: #065F46;">Admission Status: APPROVED</h4>
            <p style="margin: 4px 0; color: #047857;"><strong>Student ID:</strong> #${student.id}</p>
            <p style="margin: 4px 0; color: #047857;"><strong>Enrolled Program:</strong> ${student.program_type}</p>
            <p style="margin: 4px 0; color: #047857;"><strong>Tuition Installment Schedule:</strong> Available in Portal</p>
          </div>

          <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 14px; border-radius: 4px; margin: 18px 0; color: #92400E; font-size: 13px;">
            <strong>⚠️ CRITICAL FINALIZATION STEP:</strong><br/>
            All registrations and seat reservations are officially complete only after the applicant has completed payment. Please finalize your tuition deposit to secure your lab workstation.
          </div>

          <h4 style="color: #081F3E;">Next Steps to Finalize Enrollment:</h4>
          <ol style="padding-left: 20px;">
            <li>Log in to your <a href="http://localhost:3000/admissions" style="color: #081F3E; font-weight: bold;">Admissions Student Portal</a>.</li>
            <li>Proceed with your registration deposit or tuition installment.</li>
            <li>Attend the upcoming Campus Orientation & Lab Setup Day in Buea.</li>
          </ol>
        ` : `
          <p>Thank you for your interest in Liah Academy and the time invested in your application for <strong>${student.program_type}</strong>.</p>
          <p>After thorough review by our academic board, we regret to inform you that we are unable to offer you admission for the current cohort due to high application volume and limited laboratory workstation capacity.</p>
          <p>We encourage you to re-apply for subsequent intakes or explore our preparatory short certification bootcamps.</p>
        `}

        <p style="margin-top: 24px; font-size: 13px; color: #64748B;">For inquiries regarding this decision, contact the Office of the Registrar at info@liahacademy.com.</p>
      </div>
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Liah Academy. Backweri Town, Buea, Southwest Region, Cameroon.
      </div>
    </div>
  `;

  const text = isApproved
    ? `Congratulations ${student.full_name}! Your application for ${student.program_type} at Liah Academy has been APPROVED. Log in to http://localhost:3000/admissions to proceed.`
    : `Dear ${student.full_name}, your application status for ${student.program_type} has been updated to Rejected. Check your portal at http://localhost:3000/admissions.`;

  await sendEmail({
    to: student.email,
    subject: isApproved ? `🎉 Offer of Admission #${student.id} - Liah Academy` : `Admission Update #${student.id} - Liah Academy`,
    html,
    text,
    type: isApproved ? 'application_approved' : 'application_rejected',
    recipientType: 'applicant'
  });
}
