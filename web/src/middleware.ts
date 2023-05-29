import { NextRequest, NextResponse } from 'next/server'

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  let redirectTo = request.url
  if (process.env.APP_URL)
    redirectTo = request.url.replace('http://localhost', process.env.APP_URL)

  if (!token) {
    return NextResponse.redirect(signInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${redirectTo}; Path=/; HttpOnly; max-age=20`,
      },
    })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/memories/:path*',
}
