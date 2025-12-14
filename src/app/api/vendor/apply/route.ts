import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // For now we just accept the application and return success.
    // TODO: persist to DB or send email to admins.
    console.log('Vendor application received:', body);

    return NextResponse.json({ success: true, message: 'Application received; we will contact you shortly.' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'Invalid request' }, { status: 400 });
  }
}
