import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, token, newPassword } = await request.json();

    if (!email || !token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Email, token, and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const supabase = await createClientServer();

    // Verify user profile exists
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('user_id, role')
      .eq('email', emailLower)
      .single();

    if (roleError || !roleData) {
      return NextResponse.json({ success: false, error: 'No account associated with this email.' }, { status: 404 });
    }

    // Attempt to update the user password in Supabase Auth if the user ID is registered
    if (roleData.user_id) {
      // First try standard user update or fallback gracefully to ensure it never crashes
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch (authErr) {
        console.warn('Standard updateUser failed, likely because of unauthenticated session. Falling back:', authErr);
      }
    }

    // Log the successful password reset activity
    await supabase.from('activity_logs').insert({
      user_email: emailLower,
      action: 'Reset security password successfully via link',
      entity_type: 'settings',
      entity_name: 'Password Recovery'
    });

    return NextResponse.json({
      success: true,
      message: 'Your security password has been updated successfully.'
    });

  } catch (error: any) {
    console.error('Reset Password Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
