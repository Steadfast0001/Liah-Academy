import { NextResponse } from 'next/server';
import db, { adminStore } from '@/lib/db';

export async function GET() {
  try {
    const students = adminStore.getStudents();
    const inquiries = adminStore.getInquiries();
    const courses = adminStore.getCourses();
    const media = adminStore.getMedia();
    const emailLogs = adminStore.getEmailLogs();
    const dbHealth = await db.healthCheckAsync();

    const stats = {
      total_applications: students.length,
      pending_applications: students.filter(s => s.admission_status === 'Under Review').length,
      approved_applications: students.filter(s => s.admission_status === 'Approved').length,
      rejected_applications: students.filter(s => s.admission_status === 'Rejected').length,
      paid_applications: students.filter(s => s.payment_status === 'Paid').length,
      total_inquiries: inquiries.length,
      total_courses: courses.length,
      total_media: media.length,
      total_emails_sent: emailLogs.length,
      db_health: dbHealth
    };

    return NextResponse.json({
      success: true,
      stats,
      db_health: dbHealth,
      recent_applications: students.slice(0, 5),
      recent_inquiries: inquiries.slice(0, 5)
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
