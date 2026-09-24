/**
 * CollaBro — Email Utility
 * server/utils/email.js
 * 
 * Professional email service using Resend
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send password reset email with professional HTML template
 * @param {string} email - Recipient email address
 * @param {string} userName - User's name for personalization
 * @param {string} resetToken - Plain (unhashed) reset token
 */
export async function sendPasswordResetEmail(email, userName, resetToken) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your CollaBro Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F7F2E8;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #FFFDF6; border: 3px solid #0B0B0B; border-radius: 12px; box-shadow: 8px 8px 0px #0B0B0B;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 0 40px; text-align: center;">
              <div style="font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-size: 48px; letter-spacing: 0.06em; color: #0B0B0B; line-height: 1; margin-bottom: 8px;">
                COLLAB<span style="color: #7B38FF;">R</span>O
              </div>
              <div style="font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: #6b6560; text-transform: uppercase;">
                The Creators Hub
              </div>
            </td>
          </tr>

          <!-- Emoji Icon -->
          <tr>
            <td style="padding: 30px 40px 20px 40px; text-align: center;">
              <div style="font-size: 64px; line-height: 1;">🔑</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 0 40px;">
              <h1 style="font-family: 'Bebas Neue', 'Arial Black', sans-serif; font-size: 32px; letter-spacing: 0.05em; color: #0B0B0B; margin: 0 0 16px 0; text-align: center;">
                Reset Your Password
              </h1>
              <p style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; line-height: 1.6; color: #0B0B0B; margin: 0 0 24px 0;">
                Hello <strong>${userName}</strong>,
              </p>
              <p style="font-family: 'Space Grotesk', sans-serif; font-size: 16px; line-height: 1.6; color: #0B0B0B; margin: 0 0 24px 0;">
                We received a request to reset your CollaBro password. Click the button below to create a new password.
              </p>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background-color: #0B0B0B; color: #FFFDF6; font-family: 'Space Grotesk', sans-serif; font-size: 16px; font-weight: 700; text-decoration: none; border: 3px solid #0B0B0B; border-radius: 6px; box-shadow: 4px 4px 0px #0B0B0B; letter-spacing: 0.05em; text-transform: uppercase;">
                Reset Password
              </a>
            </td>
          </tr>

          <!-- Alternative Link -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <p style="font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.6; color: #6b6560; margin: 0; text-align: center;">
                Or copy and paste this link into your browser:
              </p>
              <p style="font-family: 'Space Mono', monospace; font-size: 12px; line-height: 1.6; color: #0B0B0B; margin: 8px 0 0 0; text-align: center; word-break: break-all;">
                <a href="${resetUrl}" style="color: #7B38FF; text-decoration: underline;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Warning Box -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background-color: rgba(255, 61, 154, 0.08); border: 2px solid #FF3D9A; border-radius: 6px; padding: 16px;">
                <p style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 600; color: #FF3D9A; margin: 0 0 8px 0;">
                  ⚠️ Important Security Notice
                </p>
                <p style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; line-height: 1.5; color: #0B0B0B; margin: 0;">
                  This link expires in <strong>15 minutes</strong>. If you didn't request this password reset, please ignore this email and your password will remain unchanged.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; border-top: 2px solid #e8e2d4;">
              <p style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; line-height: 1.6; color: #6b6560; margin: 0 0 16px 0; text-align: center;">
                Stay creative and keep building amazing things!
              </p>
              <p style="font-family: 'Space Grotesk', sans-serif; font-size: 14px; font-weight: 700; color: #0B0B0B; margin: 0; text-align: center;">
                The CollaBro Team 🤜✨🤛
              </p>
            </td>
          </tr>

          <!-- Security Badge -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <div style="text-align: center; font-family: 'Space Mono', monospace; font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #2a8a2a;">
                <span style="display: inline-block; width: 7px; height: 7px; background-color: #2a8a2a; border-radius: 50%; margin-right: 6px; vertical-align: middle;"></span>
                SSL Encrypted · Secure Email · 🔒 CollaBro
              </div>
            </td>
          </tr>

        </table>

        <!-- Legal Footer -->
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 0 40px;">
              <p style="font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.5; color: #6b6560; text-align: center; margin: 0;">
                You received this email because a password reset was requested for your CollaBro account. If this wasn't you, please contact our support team immediately.
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const textContent = `
Reset Your CollaBro Password

Hello ${userName},

We received a request to reset your CollaBro password. Click the link below to create a new password:

${resetUrl}

⚠️ IMPORTANT: This link expires in 15 minutes.

If you didn't request this password reset, please ignore this email and your password will remain unchanged.

Stay creative and keep building amazing things!

The CollaBro Team 🤜✨🤛

---
You received this email because a password reset was requested for your CollaBro account.
  `.trim();

  try {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 're_your_resend_api_key_here') {
      // DEVELOPMENT MODE: Log email instead of sending
      console.log('\n' + '='.repeat(80));
      console.log('📧 EMAIL WOULD BE SENT (Resend not configured)');
      console.log('='.repeat(80));
      console.log(`To: ${email}`);
      console.log(`Subject: Reset Your CollaBro Password`);
      console.log(`Reset Link: ${resetUrl}`);
      console.log('='.repeat(80));
      console.log('\n⚠️  TO ENABLE EMAIL SENDING:');
      console.log('1. Sign up at https://resend.com/signup');
      console.log('2. Get your API key from dashboard');
      console.log('3. Add to .env: RESEND_API_KEY=re_your_actual_key_here');
      console.log('4. Restart server\n');
      
      // Return success in development mode
      return { success: true, messageId: 'dev-mode' };
    }

    // PRODUCTION MODE: Actually send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'CollaBro <noreply@collabro.com>',
      to: [email],
      subject: 'Reset Your CollaBro Password',
      html: htmlContent,
      text: textContent,
    });

    if (error) {
      console.error('[Resend Error]', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log(`✅ Password reset email sent to ${email} [ID: ${data?.id}]`);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('[Email Send Error]', err);
    throw err;
  }
}

/**
 * Send email verification email (future implementation)
 * @param {string} email - Recipient email address
 * @param {string} userName - User's name
 * @param {string} verificationToken - Verification token
 */
export async function sendEmailVerification(email, userName, verificationToken) {
  // TODO: Implement email verification email
  console.log(`TODO: Send verification email to ${email} with token ${verificationToken}`);
}
