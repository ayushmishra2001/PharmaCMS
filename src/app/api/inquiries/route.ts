import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { inquiry } = await request.json();

    if (!inquiry || !inquiry.email || !inquiry.message) {
      return NextResponse.json({ success: false, error: 'Inquiry details (email & message) are required.' }, { status: 400 });
    }

    const supabase = await createClientServer();

    // Convert camelCase payload properties to PostgreSQL snake_case columns
    const dbInquiry = {
      type: inquiry.type || 'general',
      name: inquiry.name || 'Anonymous',
      email: inquiry.email,
      phone: inquiry.phone || null,
      company_name: inquiry.companyName || null,
      subject: inquiry.subject || 'General Inquiry',
      message: inquiry.message,
      product_id: inquiry.productId || null,
      product_brand_name: inquiry.productBrandName || null,
      status: 'unread'
    };

    const { error } = await supabase.from('inquiries').insert(dbInquiry);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Inquiries Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
