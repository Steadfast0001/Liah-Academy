import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';

export async function GET() {
  try {
    const inquiries = adminStore.getInquiries();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Inquiry ID is required.' }, { status: 400 });
    }

    adminStore.deleteInquiry(id);
    return NextResponse.json({ success: true, message: `Inquiry #${id} deleted successfully.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
