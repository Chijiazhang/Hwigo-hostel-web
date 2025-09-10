// 模拟邮件服务（实际项目中应该使用真实的邮件服务如 SendGrid、Nodemailer 等）

// 存储验证码的内存缓存（实际项目中应该使用 Redis 或数据库）
const verificationCodes = new Map<string, { code: string; expires: number }>();

// 生成4位数字验证码
function generateVerificationCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// 发送验证码
export async function sendVerificationCode(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '邮箱格式不正确'
      };
    }

    // 生成验证码
    const code = generateVerificationCode();
    const expires = Date.now() + 5 * 60 * 1000; // 5分钟后过期

    // 存储验证码
    verificationCodes.set(email, { code, expires });

    // 模拟发送邮件（实际项目中这里应该调用真实的邮件服务）
    console.log(`📧 发送验证码到 ${email}: ${code}`);
    console.log(`⏰ 验证码将在5分钟后过期`);

    // 在开发环境中，我们可以将验证码输出到控制台
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔑 开发环境验证码: ${code}`);
    }

    return {
      success: true,
      message: `验证码已发送到 ${email}，请查收邮件（开发环境请查看控制台）`
    };

  } catch (error) {
    console.error('发送验证码失败:', error);
    return {
      success: false,
      message: '发送验证码失败，请稍后重试'
    };
  }
}

// 验证验证码
export async function verifyCode(email: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '邮箱格式不正确'
      };
    }

    // 检查验证码是否存在
    const storedCode = verificationCodes.get(email);
    if (!storedCode) {
      return {
        success: false,
        message: '验证码不存在或已过期，请重新获取'
      };
    }

    // 检查验证码是否过期
    if (Date.now() > storedCode.expires) {
      verificationCodes.delete(email);
      return {
        success: false,
        message: '验证码已过期，请重新获取'
      };
    }

    // 验证验证码是否正确
    if (storedCode.code !== code) {
      return {
        success: false,
        message: '验证码不正确'
      };
    }

    // 验证成功后删除验证码
    verificationCodes.delete(email);

    console.log(`✅ 验证码验证成功: ${email}`);

    return {
      success: true,
      message: '验证码验证成功'
    };

  } catch (error) {
    console.error('验证码验证失败:', error);
    return {
      success: false,
      message: '验证码验证失败，请稍后重试'
    };
  }
}

// 清理过期的验证码（可选：定期清理）
export function cleanupExpiredCodes(): void {
  const now = Date.now();
  const emailsToDelete: string[] = [];
  
  verificationCodes.forEach((data, email) => {
    if (now > data.expires) {
      emailsToDelete.push(email);
    }
  });
  
  emailsToDelete.forEach(email => {
    verificationCodes.delete(email);
  });
}

// 定期清理过期验证码（每5分钟执行一次）
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredCodes, 5 * 60 * 1000);
}
