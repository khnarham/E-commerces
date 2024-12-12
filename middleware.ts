import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';


export const config = {
  matcher: [ '/log-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request , secret: process.env.NEXTAUTH_SECRET });
  const url = request.nextUrl;


  if (
    token &&
    (url.pathname.startsWith('/log-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify') 
  )) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/log-in', request.url));
  }

  return NextResponse.next();
}