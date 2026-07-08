import { NextResponse } from 'next/server';
import { createClientServer } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { application } = await request.json();

    if (!application || !application.jobId || !application.email || !application.name) {
      return NextResponse.json({ success: false, error: 'Mandatory fields are missing (jobId, name, email).' }, { status: 400 });
    }

    const supabase = await createClientServer();

    // Map camelCase payload properties to PostgreSQL snake_case columns
    const dbApplication = {
      job_id: application.jobId,
      job_title: application.jobTitle || 'General Position',
      name: application.name,
      email: application.email,
      phone: application.phone || '',
      cover_letter: application.coverLetter || '',
      resume_name: application.resumeName || 'CV_Attachment.pdf',
      resume_url: application.resumeUrl || '',
      status: 'new'
    };

    const { error } = await supabase.from('job_applications').insert(dbApplication);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Applications Route Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
