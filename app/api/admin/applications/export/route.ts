import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { exportApplicantsToCSVString, RawApplicantRecord } from '@/lib/csv';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const students = adminStore.getStudents();
    const rawRecords: RawApplicantRecord[] = students.map(s => ({
      id: s.id,
      matricule: s.matricule,
      fullName: s.full_name,
      email: s.email,
      phone: s.phone || '',
      degreeLevel: s.degree_type,
      programTrack: s.program_type,
      studyFormat: s.study_format,
      admissionStatus: s.admission_status,
      paymentStatus: s.payment_status,
      createdAt: s.created_at
    }));

    const csvContent = exportApplicantsToCSVString(rawRecords);
    const filename = `liah_academy_applicants_${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
