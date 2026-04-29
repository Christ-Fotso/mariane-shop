import { NextResponse } from 'next/server';

// Simple health check endpoint used by Docker health checks
export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}
