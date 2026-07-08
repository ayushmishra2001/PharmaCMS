import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

async function isSuperAdmin() {
  const supabase = await createClientServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !user.email) return { isSuper: false, email: null };
  const { data } = await supabase.from('user_roles').select('role').eq('email', user.email.toLowerCase().trim()).single();
  return { isSuper: data?.role === 'super_admin', email: user.email };
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { updatedUser } = await request.json();
    const { isSuper, email: requesterEmail } = await isSuperAdmin();

    if (!requesterEmail || !updatedUser) {
      return NextResponse.json({ error: 'Missing security context or complete user details.' }, { status: 400 });
    }

    if (!isSuper) {
      return NextResponse.json({ error: 'Forbidden: Only SuperAdmins can update users.' }, { status: 403 });
    }

    const supabase = await createClientServer();
    
    // We update by email since ID in user_roles could be user_id or id
    // the frontend passes u.id which could be user_id from auth.users or the row UUID.
    
    // Let's just update based on the ID if it matches `user_id` or `id`
    const { error: updateError } = await supabase
      .from('user_roles')
      .update({ role: updatedUser.role })
      .eq('email', updatedUser.email);
      
    if (updateError) throw updateError;

    // Log this activity
    await supabase.from('activity_logs').insert({
      user_email: requesterEmail,
      action: `Updated user role for ${updatedUser.email} to ${updatedUser.role}`,
      entity_type: 'settings',
      entity_name: updatedUser.email
    });

    return NextResponse.json({ success: true, message: 'User role updated.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { isSuper, email: requesterEmail } = await isSuperAdmin();

    if (!requesterEmail) {
      return NextResponse.json({ error: 'Missing security context. Not authenticated.' }, { status: 401 });
    }

    if (!isSuper) {
      return NextResponse.json({ error: 'Forbidden: Only SuperAdmins can delete users.' }, { status: 403 });
    }

    const supabase = await createClientServer();

    // The frontend passes u.id which could be user_id or id
    // We will delete the user_role entry which effectively revokes their access
    const { error: deleteError } = await supabase
      .from('user_roles')
      .delete()
      .or(`user_id.eq.${id},id.eq.${id}`);

    if (deleteError) throw deleteError;

    // Log this activity
    await supabase.from('activity_logs').insert({
      user_email: requesterEmail,
      action: `Deleted user role with ID ${id}`,
      entity_type: 'settings',
      entity_name: `User ID: ${id}`
    });

    return NextResponse.json({ success: true, message: 'User access revoked.' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
