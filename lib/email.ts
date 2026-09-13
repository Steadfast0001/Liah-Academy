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

// Get all administrator notification recipient emails (Settings + Registered Admins + ENV)
export function getAdminEmails(): string[] {
  const emails = new Set<string>();

  try {
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NEXT_RUNTIME === 'edge');
    const dataDir = isServerless 
      ? path.join(require('os').tmpdir(), 'liah_academy_data')
      : path.join(process.cwd(), 'data');
    const configPath = path.join(dataDir, 'liah_academy_store.json');

    if (fs.existsSync(configPath)) {
      const data = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      // 1. Settings Admin Email (supports comma or space separated list)
      if (data.settings && data.settings.admin_email) {
        String(data.settings.admin_email)
          .split(/[,;\s]+/)
          .map(e => e.trim().toLowerCase())
          .filter(e => e && e.includes('@'))
          .forEach(e => emails.add(e));
      }
      // 2. All registered database admin accounts
      if (Array.isArray(data.admins)) {
        data.admins.forEach((admin: any) => {
          if (admin && admin.email && typeof admin.email === 'string' && admin.email.includes('@')) {
            emails.add(admin.email.trim().toLowerCase());
          }
        });
      }
    }
  } catch (e) {}

  // 3. Environment Variable fallback
  if (process.env.ADMIN_EMAIL) {
    String(process.env.ADMIN_EMAIL)
      .split(/[,;\s]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e && e.includes('@'))
      .forEach(e => emails.add(e));
  }

  // 4. Default fallback if no admin email found
  if (emails.size === 0) {
    emails.add('info@liahacademy.com');
  }

  return Array.from(emails);
}

// Backwards-compatible primary admin email getter
export function getAdminEmail(): string {
  const emails = getAdminEmails();
  return emails[0] || 'info@liahacademy.com';
}

// Log email event to file and data store
export function logEmailEvent(log: Omit<EmailLog, 'id' | 'created_at'>) {
  try {
    const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NEXT_RUNTIME === 'edge');
    const dataDir = isServerless 
      ? path.join(require('os').tmpdir(), 'liah_academy_data')
      : path.join(process.cwd(), 'data');

    if (!fs.existsSync(dataDir)) {
      try { fs.mkdirSync(dataDir, { recursive: true }); } catch {}
    }

    const storePath = path.join(dataDir, 'liah_academy_store.json');
    let store: any = { email_logs: [] };
    if (fs.existsSync(storePath)) {
      try {
        store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      } catch {}
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
    try {
      fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
    } catch {}

    // Also write to email_notifications.log text file if possible
    try {
      const logFilePath = path.join(dataDir, 'email_notifications.log');
      const logLine = `[${newLog.created_at}] [${newLog.status.toUpperCase()}] TO: ${newLog.recipient} | TYPE: ${newLog.type} | SUBJECT: "${newLog.subject}"\n`;
      fs.appendFileSync(logFilePath, logLine, 'utf-8');
    } catch {}

    return newLog;
  } catch (err) {
    console.warn('Notice in logEmailEvent:', err);
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
        connectionTimeout: 3000,
        greetingTimeout: 3000,
        socketTimeout: 5000,
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

function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  return 'https://liahacademy.com';
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
  const appUrl = getAppUrl();
  const adminEmails = getAdminEmails();

  // A. Email to Applicant
  const applicantHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: #081F3E; padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="color: #F5A623; margin: 0 0 6px 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">LIAH ACADEMY</h1>
        <p style="margin: 0; color: #cbd5e1; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Higher Technical Institute &bull; Buea, Cameroon</p>
      </div>
      
      <div style="padding: 32px 28px; color: #334155; line-height: 1.6;">
        <h2 style="color: #081F3E; margin-top: 0; font-size: 20px;">Application Received, ${student.full_name}!</h2>
        <p>Thank you for submitting your application to <strong>Liah Academy of Technology and Management</strong> for the upcoming academic cohort.</p>
        
        <p>Your application file has been registered in our central admissions system and is currently being evaluated by the Academic Board.</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #F5A623; padding: 18px; margin: 24px 0; border-radius: 6px;">
          <h4 style="margin: 0 0 12px 0; color: #081F3E; font-size: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">📋 Application Summary</h4>
          <p style="margin: 5px 0;"><strong>Application ID:</strong> #${student.id}</p>
          <p style="margin: 5px 0;"><strong>Program Track:</strong> ${student.program_type}</p>
          <p style="margin: 5px 0;"><strong>Degree Level:</strong> ${student.degree_type}</p>
          <p style="margin: 5px 0;"><strong>Study Format:</strong> ${student.study_format.toUpperCase()}</p>
          <p style="margin: 5px 0;"><strong>Review Status:</strong> <span style="color: #B45309; font-weight: bold;">Under Review</span></p>
        </div>

        <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 14px 16px; border-radius: 6px; margin: 20px 0; color: #92400E; font-size: 13px;">
          <strong>⚠️ IMPORTANT ENROLLMENT NOTICE:</strong><br/>
          Seat reservations and laboratory workstation allocations are finalized only upon payment of the initial enrollment/registration deposit.
        </div>

        <h4 style="color: #081F3E; margin-bottom: 8px; font-size: 15px;">Next Steps in the Admission Process:</h4>
        <ol style="padding-left: 20px; margin-top: 6px; color: #475569;">
          <li style="margin-bottom: 6px;">Our admissions board reviews your transcripts and prerequisites.</li>
          <li style="margin-bottom: 6px;">You will receive an official <strong>Offer of Admission</strong> via email once approved.</li>
          <li style="margin-bottom: 6px;">Track your live application status anytime via the <a href="${appUrl}/admissions" style="color: #081F3E; font-weight: bold; text-decoration: underline;">Admissions Portal</a> using your registered email.</li>
        </ol>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748B;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #081F3E;">Admissions & Registry Office</p>
          <p style="margin: 0 0 4px 0;">Liah Academy of Technology and Management</p>
          <p style="margin: 0 0 4px 0;">📍 Campus: Backweri Town, Buea, Southwest Region, Cameroon</p>
          <p style="margin: 0 0 4px 0;">📞 Telephone: +237 670 265 493 / +237 652 154 095</p>
          <p style="margin: 0;">✉️ Email: info@liahacademy.com &bull; 🌐 <a href="${appUrl}" style="color: #081F3E;">${appUrl}</a></p>
        </div>
      </div>
      
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Liah Academy of Technology and Management. All rights reserved.
      </div>
    </div>
  `;

  const applicantText = `Dear ${student.full_name},

Thank you for applying to Liah Academy of Technology and Management!

Your application for ${student.program_type} (${student.degree_type}) has been received successfully (Ref ID: #${student.id}) and is currently under review by our admissions board.

Track your status anytime at: ${appUrl}/admissions

Warm regards,
Admissions Office
Liah Academy of Technology and Management
Buea, Cameroon | +237 670 265 493 | info@liahacademy.com`;

  // B. Email to Admins
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 20px; text-align: center; color: #ffffff;">
        <span style="background: #F5A623; color: #081F3E; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 4px; text-transform: uppercase;">ADMIN ALERT</span>
        <h2 style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">New Admission Application Submitted</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>A new candidate has submitted an admission application file:</p>
        
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
          <a href="${appUrl}/admin" style="background: #F5A623; color: #081F3E; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Open Admin Panel to Review &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  const adminText = `🚨 New Application #${student.id} submitted by ${student.full_name} for ${student.program_type} (${student.degree_type}). Email: ${student.email}. Open admin panel at ${appUrl}/admin to review.`;

  // Dispatch to applicant + all administrators asynchronously
  const applicantPromise = sendEmail({
    to: student.email,
    subject: `Application Received – ${student.program_type}, Liah Academy`,
    html: applicantHtml,
    text: applicantText,
    type: 'application_submitted',
    recipientType: 'applicant'
  });

  const adminPromises = adminEmails.map(adminEmail =>
    sendEmail({
      to: adminEmail,
      subject: `🚨 [New Application] #${student.id}: ${student.full_name} - ${student.program_type}`,
      html: adminHtml,
      text: adminText,
      type: 'admin_alert',
      recipientType: 'admin'
    })
  );

  await Promise.all([applicantPromise, ...adminPromises]);
}

// 2. SIGNAL ON DIRECT INQUIRY SUBMISSION
export async function sendInquirySignals(inquiry: {
  id: number | string;
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const appUrl = getAppUrl();
  const adminEmails = getAdminEmails();

  // A. Confirmation to Sender (Applicant / Prospective Student)
  const userHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: #081F3E; padding: 28px 24px; text-align: center; color: #ffffff;">
        <h2 style="color: #F5A623; margin: 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">LIAH ACADEMY</h2>
        <p style="margin: 4px 0 0 0; color: #cbd5e1; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Admissions & Inquiry Guidance Office</p>
      </div>
      
      <div style="padding: 32px 28px; color: #334155; line-height: 1.6;">
        <p>Dear <strong>${inquiry.name}</strong>,</p>
        
        <p>Thank you for reaching out to <strong>Liah Academy of Technology and Management</strong>. We have successfully received your inquiry regarding <strong>"${inquiry.subject}"</strong>.</p>
        
        <p>Our Admissions and Academic Guidance team in Buea is reviewing your request and will provide you with detailed information regarding application deadlines, required documents, curriculum tracks, and fee structures.</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #081F3E; padding: 16px; border-radius: 6px; margin: 20px 0; font-size: 14px; color: #475569;">
          <p style="margin: 0 0 6px 0; font-weight: bold; color: #081F3E;">Summary of Your Inquiry:</p>
          <p style="margin: 0 0 4px 0;"><strong>Subject:</strong> ${inquiry.subject}</p>
          <p style="margin: 0; font-style: italic; color: #334155;">"${inquiry.message}"</p>
        </div>

        <p style="font-size: 14px; color: #475569;">In the meantime, feel free to explore our accredited diploma tracks and degree programs on our website.</p>

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748B;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #081F3E;">Admissions & Inquiry Support</p>
          <p style="margin: 0 0 4px 0;">Liah Academy of Technology and Management</p>
          <p style="margin: 0 0 4px 0;">📍 Campus: Backweri Town, Buea, South West Region, Cameroon</p>
          <p style="margin: 0 0 4px 0;">📞 Telephone: +237 670 265 493 / +237 652 154 095</p>
          <p style="margin: 0;">✉️ Email: info@liahacademy.com &bull; 🌐 <a href="${appUrl}" style="color: #081F3E;">${appUrl}</a></p>
        </div>
      </div>
      
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Liah Academy of Technology and Management. All rights reserved.
      </div>
    </div>
  `;

  const userText = `Dear ${inquiry.name},

Thank you for reaching out to Liah Academy of Technology and Management regarding "${inquiry.subject}".

We have received your message and our admissions team in Buea will get back to you with guidance on deadlines, requirements, and programs shortly.

Summary of your message:
"${inquiry.message}"

Sincerely,
Admissions Office
Liah Academy of Technology and Management
Buea, Cameroon | +237 670 265 493 | info@liahacademy.com`;

  // B. Alert to Admins
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 20px; text-align: center; color: #ffffff;">
        <span style="background: #F5A623; color: #081F3E; font-size: 12px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">DIRECT INQUIRY ALERT</span>
        <h2 style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">New Message from Website</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p><strong>From:</strong> ${inquiry.name} (<a href="mailto:${inquiry.email}">${inquiry.email}</a>)</p>
        <p><strong>Subject:</strong> ${inquiry.subject}</p>
        
        <div style="background: #f8fafc; border-left: 4px solid #081F3E; padding: 14px; margin: 16px 0; border-radius: 4px;">
          ${inquiry.message}
        </div>

        <div style="margin-top: 20px; text-align: center;">
          <a href="${appUrl}/admin" style="background: #081F3E; color: #F5A623; font-weight: bold; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage Inquiries in Admin Panel &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  const userPromise = sendEmail({
    to: inquiry.email,
    subject: `Inquiry Regarding Admission Process – ${inquiry.subject}`,
    html: userHtml,
    text: userText,
    type: 'inquiry_submitted',
    recipientType: 'user'
  });

  const adminPromises = adminEmails.map(adminEmail =>
    sendEmail({
      to: adminEmail,
      subject: `📬 [Direct Inquiry] ${inquiry.subject} (from ${inquiry.name})`,
      html: adminHtml,
      text: `New Direct Inquiry from ${inquiry.name} (${inquiry.email}). Subject: ${inquiry.subject}. Message: ${inquiry.message}`,
      type: 'admin_alert',
      recipientType: 'admin'
    })
  );

  await Promise.all([userPromise, ...adminPromises]);
}

// 2.1 SIGNAL ON PAYMENT SUBMISSION / VERIFICATION
export async function sendPaymentAlertSignal(payment: {
  id?: number | string;
  student_name?: string;
  student_email?: string;
  amount: number | string;
  operator?: string;
  transaction_id?: string;
  status?: string;
}) {
  const appUrl = getAppUrl();
  const adminEmails = getAdminEmails();
  const formattedAmount = `${Number(payment.amount || 0).toLocaleString()} XAF`;

  const adminHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #081F3E; padding: 20px; text-align: center; color: #ffffff;">
        <span style="background: #10B981; color: #ffffff; font-size: 12px; font-weight: bold; padding: 3px 8px; border-radius: 4px; text-transform: uppercase;">PAYMENT NOTIFICATION</span>
        <h2 style="margin: 10px 0 0 0; color: #ffffff; font-size: 18px;">New Payment Recorded</h2>
      </div>
      <div style="padding: 24px; color: #334155; line-height: 1.6;">
        <p>A new payment transaction has been submitted for verification or processed via Mobile Money.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Amount</td><td style="padding: 8px 0; color: #047857; font-weight: bold; font-size: 16px;">${formattedAmount}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Candidate / Payer</td><td style="padding: 8px 0; color: #081F3E;">${payment.student_name || 'Candidate'}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Email</td><td style="padding: 8px 0; color: #081F3E;">${payment.student_email || 'N/A'}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Channel</td><td style="padding: 8px 0; color: #081F3E;">${payment.operator || 'MTN Mobile Money'}</td></tr>
          <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; font-weight: bold; color: #64748B;">TxID / Ref</td><td style="padding: 8px 0; color: #081F3E;">${payment.transaction_id || 'Pending'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; color: #64748B;">Status</td><td style="padding: 8px 0; color: #B45309; font-weight: bold;">${payment.status || 'Pending Verification'}</td></tr>
        </table>

        <div style="margin-top: 20px; text-align: center;">
          <a href="${appUrl}/admin" style="background: #F5A623; color: #081F3E; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Open Admin Panel &rarr;
          </a>
        </div>
      </div>
    </div>
  `;

  const adminPromises = adminEmails.map(adminEmail =>
    sendEmail({
      to: adminEmail,
      subject: `💳 [Payment Alert] ${formattedAmount} from ${payment.student_name || 'Candidate'}`,
      html: adminHtml,
      text: `Payment of ${formattedAmount} received/uploaded by ${payment.student_name || 'Candidate'} (${payment.student_email || 'N/A'}). Status: ${payment.status || 'Pending'}. Review in admin panel.`,
      type: 'admin_alert',
      recipientType: 'admin'
    })
  );

  await Promise.all(adminPromises);
}

// 3. SIGNAL ON ADMISSION DECISION (OFFER OF ADMISSION / REJECTION)
export async function sendDecisionSignal(student: {
  id: number | string;
  full_name: string;
  email: string;
  program_type: string;
  degree_type: string;
}, decision: 'Approved' | 'Rejected') {
  const isApproved = decision === 'Approved';
  const appUrl = getAppUrl();

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background: ${isApproved ? '#081F3E' : '#1E293B'}; padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="color: ${isApproved ? '#F5A623' : '#F87171'}; margin: 0 0 6px 0; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">
          ${isApproved ? '🎉 Official Offer of Admission' : 'Application Status Update'}
        </h1>
        <p style="margin: 0; color: #cbd5e1; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Liah Academy of Technology and Management &bull; Buea Campus</p>
      </div>
      
      <div style="padding: 32px 28px; color: #334155; line-height: 1.6;">
        <p>Dear <strong>${student.full_name}</strong>,</p>
        
        ${isApproved ? `
          <p><strong>Congratulations!</strong> We are pleased to inform you that you have been officially offered admission to the <strong>${student.program_type} (${student.degree_type})</strong> program at <strong>Liah Academy of Technology and Management</strong> for the upcoming 2026/2027 Academic Term.</p>
          
          <p>Your admission is based on your outstanding application and demonstrated potential in technical studies.</p>
          
          <div style="background: #ECFDF5; border-left: 4px solid #10B981; padding: 18px; margin: 22px 0; border-radius: 6px;">
            <h4 style="margin: 0 0 10px 0; color: #065F46; font-size: 15px;">🎓 Admission Offer Details</h4>
            <p style="margin: 4px 0; color: #047857;"><strong>Student ID:</strong> #${student.id}</p>
            <p style="margin: 4px 0; color: #047857;"><strong>Offered Track:</strong> ${student.program_type}</p>
            <p style="margin: 4px 0; color: #047857;"><strong>Degree Level:</strong> ${student.degree_type}</p>
            <p style="margin: 4px 0; color: #047857;"><strong>Admission Status:</strong> <span style="font-weight: bold; background: #D1FAE5; padding: 2px 6px; border-radius: 4px;">OFFICIALLY APPROVED</span></p>
          </div>

          <div style="background: #FEF3C7; border-left: 4px solid #D97706; padding: 14px 16px; border-radius: 6px; margin: 20px 0; color: #92400E; font-size: 13px;">
            <strong>⚠️ ACTION REQUIRED TO CONFIRM ENROLLMENT:</strong><br/>
            To confirm your place, kindly complete the acceptance and submit the initial enrollment fee / tuition installment. Lab workstations and seats are reserved upon fee confirmation.
          </div>

          <h4 style="color: #081F3E; margin-bottom: 8px; font-size: 15px;">Next Steps to Finalize Your Enrollment:</h4>
          <ol style="padding-left: 20px; margin-top: 6px; color: #475569;">
            <li style="margin-bottom: 6px;">Log in to your <a href="${appUrl}/admissions" style="color: #081F3E; font-weight: bold; text-decoration: underline;">Student Admissions Portal</a>.</li>
            <li style="margin-bottom: 6px;">Review your installment schedule and fee breakdown.</li>
            <li style="margin-bottom: 6px;">Submit your registration deposit via Mobile Money or Bank Transfer.</li>
            <li style="margin-bottom: 6px;">Attend the upcoming Campus Orientation & Lab Setup Day in Buea.</li>
          </ol>

          <p style="margin-top: 24px;">We look forward to welcoming you to our vibrant academic and technical community.</p>
        ` : `
          <p>Thank you for your interest in Liah Academy and the time invested in your application for the <strong>${student.program_type}</strong> program.</p>
          <p>After thorough review by our academic board, we regret to inform you that we are unable to offer you admission for the current cohort due to high application volume and limited laboratory workstation capacity.</p>
          <p>We encourage you to re-apply for subsequent intakes or explore our short-term certification bootcamps.</p>
        `}

        <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748B;">
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #081F3E;">Warm regards,</p>
          <p style="margin: 0 0 4px 0; font-weight: bold; color: #081F3E;">Office of Admissions & Student Records</p>
          <p style="margin: 0 0 4px 0;">Liah Academy of Technology and Management</p>
          <p style="margin: 0 0 4px 0;">📍 Campus: Backweri Town, Buea, South West Region, Cameroon</p>
          <p style="margin: 0 0 4px 0;">📞 Telephone: +237 670 265 493 / +237 652 154 095</p>
          <p style="margin: 0;">✉️ Email: info@liahacademy.com &bull; 🌐 <a href="${appUrl}" style="color: #081F3E;">${appUrl}</a></p>
        </div>
      </div>
      
      <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Liah Academy of Technology and Management. All rights reserved.
      </div>
    </div>
  `;

  const text = isApproved
    ? `Dear ${student.full_name},

Congratulations! We are pleased to inform you that you have been offered admission to the ${student.program_type} (${student.degree_type}) program at Liah Academy of Technology and Management for the 2026/2027 Academic Year.

Your admission is based on your outstanding application and demonstrated potential.

To confirm your place, kindly complete the acceptance form and submit the initial enrollment fee via the Admissions Portal:
${appUrl}/admissions

We look forward to welcoming you to our academic community.

Warm regards,
Office of Admissions
Liah Academy of Technology and Management
Buea, Cameroon | +237 670 265 493 | info@liahacademy.com`
    : `Dear ${student.full_name},

Thank you for your interest in Liah Academy of Technology and Management.

Your application status for ${student.program_type} has been updated. Please log in to check the update:
${appUrl}/admissions

Sincerely,
Office of Admissions
Liah Academy of Technology and Management`;

  await sendEmail({
    to: student.email,
    subject: isApproved 
      ? `Admission Offer – ${student.program_type} (${student.degree_type}), Liah Academy`
      : `Admission Update #${student.id} – Liah Academy`,
    html,
    text,
    type: isApproved ? 'application_approved' : 'application_rejected',
    recipientType: 'applicant'
  });
}
