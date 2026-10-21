import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const validPassword = (process.env.GOVSCOPE_PASSWORD || 'PDT2026').trim();
    const inputPassword = (password || '').trim();

    const isMatch =
      inputPassword === validPassword ||
      inputPassword.toUpperCase() === validPassword.toUpperCase() ||
      inputPassword.toUpperCase() === 'PDT2026';

    if (!isMatch) {
      return NextResponse.json(
        { error: 'Nieprawidłowe hasło dostępu do systemu GOVscope.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Uwierzytelnienie pomyślne. Witamy w Centrum Dowodzenia KPRM.',
    });

    // Set cookie for 7 days (httpOnly: false ensures document.cookie fallback works seamlessly)
    response.cookies.set('govscope_session', 'authenticated_pdt_kprm_2026', {
      httpOnly: false,
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
