import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST() {
  try {
    const supabase = await createClientServer();
    await supabase.auth.signOut();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
