import { NextResponse } from 'next/server';
import db, { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

let cachedStatsResult: {
  timestamp: number;
  payload: {
    stats: any;
    db_health: any;
    recent_applications: any;
    recent_inquiries: any;
  };
} | null = null;

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    // Serve from ultra-fast 3-second micro-cache under high concurrent load
    if (cachedStatsResult && Date.now() - cachedStatsResult.timestamp < 3000) {
      return NextResponse.json({
        success: true,
        ...cachedStatsResult.payload
      });
    }

    let stats: any;
    let recentApplications: any;
    let recentInquiries: any;
    let loadedFromMySQL = false;

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        const [studentRows, inquiryRows, courseRows, mediaRows, emailRows, applications, inquiries] = await Promise.all([
          pool.execute(`SELECT COUNT(*) AS total_applications,
            SUM(admission_status = 'Under Review') AS pending_applications,
            SUM(admission_status = 'Approved') AS approved_applications,
            SUM(admission_status = 'Rejected') AS rejected_applications,
            SUM(payment_status = 'Paid') AS paid_applications FROM students`),
          pool.execute('SELECT COUNT(*) AS total_inquiries FROM inquiries'),
          pool.execute('SELECT COUNT(*) AS total_courses FROM courses'),
          pool.execute('SELECT COUNT(*) AS total_media FROM media'),
          pool.execute('SELECT COUNT(*) AS total_emails_sent FROM email_logs'),
          pool.execute(`SELECT id, matricule, full_name, email, phone, degree_type, program_type, study_format,
            admission_status, payment_status, created_at FROM students ORDER BY created_at DESC LIMIT 5`),
          pool.execute('SELECT id, name, email, subject, message, status, created_at FROM inquiries ORDER BY created_at DESC LIMIT 5')
        ]);
        const counts = (studentRows[0] as any[])[0] || {};
        stats = {
          total_applications: Number(counts.total_applications || 0),
          pending_applications: Number(counts.pending_applications || 0),
          approved_applications: Number(counts.approved_applications || 0),
          rejected_applications: Number(counts.rejected_applications || 0),
          paid_applications: Number(counts.paid_applications || 0),
          total_inquiries: Number(((inquiryRows[0] as any[])[0] || {}).total_inquiries || 0),
          total_courses: Number(((courseRows[0] as any[])[0] || {}).total_courses || 0),
          total_media: Number(((mediaRows[0] as any[])[0] || {}).total_media || 0),
          total_emails_sent: Number(((emailRows[0] as any[])[0] || {}).total_emails_sent || 0)
        };
        recentApplications = applications[0];
        recentInquiries = inquiries[0];
        loadedFromMySQL = true;
      } catch (mysqlErr) {
        console.warn('MySQL stats query failed, falling back to local database store:', mysqlErr);
      }
    }

    if (!loadedFromMySQL) {
      const students = adminStore.getStudents();
      const inquiries = adminStore.getInquiries();
      const courses = adminStore.getCourses();
      const media = adminStore.getMedia();
      const emailLogs = adminStore.getEmailLogs();
      stats = {
        total_applications: students.length,
        pending_applications: students.filter(s => s.admission_status === 'Under Review').length,
        approved_applications: students.filter(s => s.admission_status === 'Approved').length,
        rejected_applications: students.filter(s => s.admission_status === 'Rejected').length,
        paid_applications: students.filter(s => s.payment_status === 'Paid').length,
        total_inquiries: inquiries.length,
        total_courses: courses.length,
        total_media: media.length,
        total_emails_sent: emailLogs.length
      };
      recentApplications = students.slice(0, 5).map(({ password, ...student }) => student);
      recentInquiries = inquiries.slice(0, 5);
    }

    let dbHealth: any = { status: 'healthy', mode: getDatabaseSourceMode() };
    try {
      dbHealth = await db.healthCheckAsync();
    } catch {
      dbHealth = { status: 'degraded', mode: 'json-backup', message: 'Operating in high-availability local store mode.' };
    }
    stats.db_health = dbHealth;

    const payload = {
      stats,
      db_health: dbHealth,
      recent_applications: recentApplications,
      recent_inquiries: recentInquiries
    };

    cachedStatsResult = {
      timestamp: Date.now(),
      payload
    };

    return NextResponse.json({
      success: true,
      ...payload
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load dashboard statistics.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
