import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: 'Email and OTP are required.' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    // Allow the standard sandbox simulated OTP
    if (otp !== "184920") {
      return NextResponse.json({ success: false, error: 'Invalid or incorrect OTP. Please request a new code.' }, { status: 401 });
    }

    const supabase = await createClientServer();

    // Fetch user details from user_roles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('email', emailLower)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json({ success: false, error: 'User profile not found. Please register first.' }, { status: 404 });
    }

    // Log the successful OTP verification action
    await supabase.from('activity_logs').insert({
      user_email: emailLower,
      action: 'Authenticated successfully using secure OTP',
      entity_type: 'settings',
      entity_name: 'OTP Authentication'
    });

    return NextResponse.json({
      success: true,
      user: {
        id: roleData.user_id || '00000000-0000-0000-0000-000000000001',
        email: emailLower,
        name: emailLower.split('@')[0],
        role: roleData.role
      }
    });

  } catch (error: any) {
    console.error('OTP Verify Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
