import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';
import { mapSiteSettings } from '@/lib/adapters';

export async function GET() {
  try {
    const supabase = await createClientServer();
    const { data: dbSettings } = await supabase.from('site_settings').select('*').maybeSingle();
    const settings = mapSiteSettings(dbSettings);
    
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
