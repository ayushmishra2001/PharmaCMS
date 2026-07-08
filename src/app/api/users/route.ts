import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

async function isSuperAdmin() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { isSuper: false, email: null };
  const { data } = await supabase.from('user_roles').select('role').eq('email', user.email.toLowerCase().trim()).single();
  return { isSuper: data?.role === 'super_admin', email: user.email };
}

export async function GET(request: Request) {
  try {
    const { isSuper, email: requesterEmail } = await isSuperAdmin();

    if (!requesterEmail) {
      return NextResponse.json({ error: 'Missing security context. Not authenticated.' }, { status: 401 });
    }

    if (!isSuper) {
      return NextResponse.json({ error: 'Forbidden: User Management is restricted to SuperAdmins only.' }, { status: 403 });
    }

    const supabase = await createClientServer();
    
    // We should ideally fetch users from auth.users via supabase admin API, 
    // but the role management can just fetch from `user_roles`.
    const { data: users, error } = await supabase.from('user_roles').select('*').order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Format to match old API response
    const formattedUsers = users.map(u => ({
      id: u.user_id || u.id,
      name: u.email.split('@')[0], // Approximation of name
      email: u.email,
      role: u.role
    }));

    return NextResponse.json(formattedUsers);

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { newUser } = await request.json();
    const { isSuper, email: requesterEmail } = await isSuperAdmin();

    if (!requesterEmail || !newUser || !newUser.email || !newUser.role || !newUser.password) {
      return NextResponse.json({ error: 'Missing security context or complete user details.' }, { status: 400 });
    }

    if (!isSuper) {
      return NextResponse.json({ error: 'Forbidden: Only SuperAdmins can manage users.' }, { status: 403 });
    }

    const supabase = await createClientServer();
    
    // 1. Create the user in Supabase Auth (We use signUp, but usually Admin API is better.
    // For standard supabase-js client without service key, signUp is what we can do,
    // though it logs in the user, but we are inside an API route using a server client 
    // which has its own session state or we can use admin api if service role key is provided.
    // We'll stick to signUp for this sandbox/prototype).
    
    // Actually, since we don't have the service_role key available safely via NEXT_PUBLIC,
    // signUp would alter the active session. 
    // To do it correctly without logging out the current admin, we should just insert to user_roles
    // and instruct the user to sign up themselves, OR we just let the error fall if auth.users requires it.
    // However, user_roles triggers might fail if user_id is missing and it's unique but we don't have it.
    // Wait, user_id is UUID UNIQUE in user_roles. We can generate a dummy UUID for them temporarily or leave it null (if nullable).
    // Our SQL: user_id UUID UNIQUE. It is nullable!
    
    const { error: insertError } = await supabase.from('user_roles').insert({
      email: newUser.email.toLowerCase().trim(),
      role: newUser.role
    });
    
    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json({ error: 'User with this email already exists in roles.' }, { status: 400 });
      }
      throw insertError;
    }

    // Log this activity
    await supabase.from('activity_logs').insert({
      user_email: requesterEmail,
      action: `Created new user role for ${newUser.email}`,
      entity_type: 'settings',
      entity_name: newUser.email
    });

    return NextResponse.json({ success: true, message: 'User role provisioned. They must use Sign Up/First Login with this email to set their password.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
