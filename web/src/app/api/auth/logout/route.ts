import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Wylogowano z systemu GOVscope.',
  });

  response.cookies.delete('govscope_session');
  return response;
}
