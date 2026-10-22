import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    const validPassword = (process.env.GOVSCOPE_PASSWORD || 'PDT2026').trim();
    const inputPassword = (password || '').trim();

    const isMatch = inputPassword === validPassword;

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

    // Sesja nie jest zapisywana na stałe: po zamknięciu przeglądarki wymagane jest ponowne logowanie.
    response.cookies.set('govscope_session', 'authenticated_pdt_kprm_2026_v2', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Błąd przetwarzania żądania logowania.' },
      { status: 500 }
    );
  }
}
