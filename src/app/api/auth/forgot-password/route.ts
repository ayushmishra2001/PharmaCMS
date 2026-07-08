import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const supabase = await createClientServer();

    // Verify user profile exists
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('email', emailLower)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json({ success: false, error: 'No account associated with this email.' }, { status: 404 });
    }

    // Generate a secure, simulated reset token link
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetLink = `#/reset-password?email=${encodeURIComponent(emailLower)}&token=${resetToken}`;

    await supabase.from('activity_logs').insert({
      user_email: emailLower,
      action: `Initiated security password reset. Generated token: ${resetToken}`,
      entity_type: 'settings',
      entity_name: 'Password Reset'
    });

    return NextResponse.json({
      success: true,
      message: 'Password reset token generated.',
      resetLink: resetLink
    });

  } catch (error: any) {
    console.error('Forgot Password Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
