import { NextRequest, NextResponse } from 'next/server';
import { getGoogleUserInfo } from '../../../../lib/googleAuth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth Error:', error);
    return NextResponse.redirect(new URL(`/register?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/register?error=no_code_provided', request.url));
  }

  try {
    const userInfo = await getGoogleUserInfo(code);
    
    // 重定向回注册页面，并传递用户信息
    const redirectUrl = new URL('/register', request.url);
    redirectUrl.searchParams.set('google_success', 'true');
    redirectUrl.searchParams.set('email', userInfo.email || '');
    redirectUrl.searchParams.set('name', userInfo.name || userInfo.email?.split('@')[0] || 'User');
    if (userInfo.picture) {
      redirectUrl.searchParams.set('picture', userInfo.picture);
    }
    
    return NextResponse.redirect(redirectUrl);

  } catch (e: any) {
    console.error('Error exchanging code or getting user info:', e);
    return NextResponse.redirect(new URL(`/register?error=${e.message || 'oauth_failed'}`, request.url));
  }
}
