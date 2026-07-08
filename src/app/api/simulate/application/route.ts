import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ success: true, message: 'Simulation is disabled in production cloud mode.' });
}
