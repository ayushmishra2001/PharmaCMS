import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ success: true, message: 'Database reset is disabled in production cloud mode.' });
}
