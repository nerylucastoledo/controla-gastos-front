import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	console.log("entrei");
  const token = request.cookies.get('access_token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

	return NextResponse.next();
}

export const config = {
  matcher: ['/', '/configuracoes'],
}