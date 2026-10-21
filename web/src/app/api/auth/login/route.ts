import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const validPassword = process.env.GOVSCOPE_PASSWORD || 'PDT2026';

    if (!password || password.trim() !== validPassword) {
      return NextResponse.json(
        { error: 'Nieprawidłowe hasło dostępu do systemu GOVscope.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Uwierzytelnienie pomyślne. Witamy w Centrum Dowodzenia KPRM.',
    });

    // Set secure cookie for 7 days
    response.cookies.set('govscope_session', 'authenticated_pdt_kprm_2026', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Błąd przetwarzania żądania logowania.' },
      { status: 500 }
    );
  }
}
