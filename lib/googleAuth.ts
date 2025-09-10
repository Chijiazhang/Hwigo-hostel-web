// Google OAuth 2.0 配置和工具函数

export const GOOGLE_CONFIG = {
  clientId: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  redirectUri: process.env.GOOGLE_REDIRECT_URI || (process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.vercel.app/api/auth/google/callback'
    : 'http://localhost:3000/api/auth/google/callback'),
  scope: 'openid email profile'
};

// Google OAuth 授权 URL 生成
export function getGoogleAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CONFIG.clientId,
    redirect_uri: GOOGLE_CONFIG.redirectUri,
    scope: GOOGLE_CONFIG.scope,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

// 获取 Google 用户信息
export async function getGoogleUserInfo(code: string) {
  try {
    // 交换授权码获取访问令牌
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CONFIG.clientId,
        client_secret: GOOGLE_CONFIG.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_CONFIG.redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokens = await tokenResponse.json();

    // 使用访问令牌获取用户信息
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get user info');
    }

    return await userResponse.json();
  } catch (error) {
    console.error('Error getting Google user info:', error);
    throw error;
  }
}