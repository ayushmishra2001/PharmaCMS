import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password are required.' }, { status: 400 });
    }

    const supabase = await createClientServer();
    
    // Sign in the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      // If the user does not exist, let's try to automatically sign them up.
      // This is helpful for first-time onboarding!
      if (authError.message.includes('Invalid login credentials')) {
        // Let's check if we should allow auto-signup for first user bootstrapping
        const { count, error: countError } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true });

        if (!countError && count === 0) {
          // No users exist in user_roles! Let's sign them up as the first admin
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });

          if (signUpError) {
            return NextResponse.json({ success: false, error: signUpError.message }, { status: 400 });
          }

          if (signUpData.user) {
            // First user is super_admin
            const { error: roleError } = await supabase.from('user_roles').insert({
              user_id: signUpData.user.id,
              email: signUpData.user.email!,
              role: 'super_admin',
            });

            if (roleError) {
              return NextResponse.json({ success: false, error: `Auth created but failed to assign super_admin role: ${roleError.message}` }, { status: 500 });
            }

            return NextResponse.json({
              success: true,
              user: {
                id: signUpData.user.id,
                email: signUpData.user.email,
                name: 'Super Administrator',
                role: 'super_admin'
              }
            });
          }
        }
      }
      return NextResponse.json({ success: false, error: authError.message }, { status: 401 });
    }

    const user = authData.user;
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found after successful sign in.' }, { status: 500 });
    }

    // Retrieve role from user_roles
    let { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    let userRole = 'content_manager';

    if (roleError || !roleData) {
      // If the user exists in auth but lacks a user_role row, check if they are the first user
      const { count } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true });

      userRole = (count === 0) ? 'super_admin' : 'content_manager';

      // Auto-insert role
      await supabase.from('user_roles').insert({
        user_id: user.id,
        email: user.email!,
        role: userRole
      });
    } else {
      userRole = roleData.role;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || email.split('@')[0],
        role: userRole,
      }
    });

  } catch (error: any) {
    console.error('Login Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
