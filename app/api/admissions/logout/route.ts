import { NextResponse } from 'next/server';
import { clearStudentSession } from '@/lib/student-auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearStudentSession(response);
  return response;
}