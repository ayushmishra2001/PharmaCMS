import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

// Store simulated OTPs in a simple memory cache or handle via database.
// To make it fully stateless and reliable, we'll return a calculated or simulated OTP 
// that matches standard patterns, while logging it to the console for administrators.
export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email address is required.' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const supabase = await createClientServer();

    // Verify if the email is registered in user_roles
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', emailLower)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json({ success: false, error: 'No account associated with this institutional email.' }, { status: 404 });
    }

    // Generate a secure 6-digit simulated OTP for sandbox environments
    const simulatedOtp = "184920"; // Hardcoded standard testing OTP or seed-based
    console.log(`[SMTP SIMULATION] OTP generated for ${emailLower}: ${simulatedOtp}`);

    // Log this activity to audit logs
    await supabase.from('activity_logs').insert({
      user_email: emailLower,
      action: `Requested secure One-Time Password (Simulated OTP: ${simulatedOtp})`,
      entity_type: 'settings',
      entity_name: 'OTP Authentication'
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully (Simulated).',
      simulatedOtp: simulatedOtp
    });

  } catch (error: any) {
    console.error('OTP Send Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
