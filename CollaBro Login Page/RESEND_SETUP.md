# Resend Email Service Setup Guide

Complete guide to set up professional password reset emails using Resend.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Resend Account

1. Go to **[https://resend.com/signup](https://resend.com/signup)**
2. Sign up with your email or GitHub account
3. Verify your email address

### Step 2: Get Your API Key

1. After logging in, go to **[API Keys](https://resend.com/api-keys)**
2. Click **"Create API Key"**
3. Name it: `CollaBro Production` or `CollaBro Development`
4. Select permissions: **Sending access** (default)
5. Click **"Create"**
6. **Copy the API key** (you won't see it again!)

Example API key format:
```
re_123abc456def789ghi012jkl345mno678
```

### Step 3: Add API Key to Environment Variables

Open `.env` file and update:

```env
# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=CollaBro <noreply@yourdomain.com>
```

**Important:** Replace `re_your_actual_api_key_here` with your actual API key from Step 2.

### Step 4: Configure "From" Email Address

#### Option A: Use Resend's Test Domain (Development)

For testing, you can use Resend's onboarding email:

```env
RESEND_FROM_EMAIL=Collabro <onboarding@resend.dev>
```

**Note:** Emails from `resend.dev` will only be delivered to **your registered email address** (the one you signed up with).

#### Option B: Use Your Own Domain (Production)

1. Go to **[Domains](https://resend.com/domains)** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `collabro.com`)
4. Add the DNS records Resend provides to your domain registrar
5. Wait for verification (usually 5-15 minutes)
6. Update `.env`:

```env
RESEND_FROM_EMAIL=CollaBro <noreply@collabro.com>
```

---

## 🧪 Testing the Email System

### Test 1: Request Password Reset

1. Start your server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:5173/forgot-password`

3. Enter your email address (must be registered)

4. Click "Send Reset Link"

5. Check your email inbox (including spam folder)

### Test 2: Verify Email Content

The email should contain:
- ✅ Professional CollaBro branding
- ✅ "Reset Password" button
- ✅ Direct link as alternative
- ✅ 15-minute expiration warning
- ✅ Security notice

### Test 3: Use Reset Link

1. Click the "Reset Password" button in the email
2. You should be redirected to: `/reset-password/{token}`
3. Enter new password
4. Submit
5. Login with new password

---

## 🔍 Debugging

### Issue: "Failed to send password reset email"

**Check 1: API Key**
```bash
# Verify API key is set
echo $RESEND_API_KEY   # macOS/Linux
echo %RESEND_API_KEY%  # Windows
```

**Check 2: Server Console**
Look for:
```
[Resend Error] { ... }
```

Common errors:
- `invalid_api_key` → API key is wrong or missing
- `validation_error` → "From" email format is invalid
- `missing_required_field` → Email fields incomplete

### Issue: Email Not Received

**Check 1: Spam Folder**
- Resend emails might initially go to spam

**Check 2: Domain Verification**
- If using custom domain, ensure DNS records are verified
- Go to Resend Domains page and check status

**Check 3: Email Address**
- With `resend.dev`, emails only go to your registered account
- Use your own verified domain for other recipients

### Issue: "Unexpected end of JSON input"

**Already Fixed!**
The updated frontend code now safely parses JSON:
```javascript
const text = await res.text()
data = text ? JSON.parse(text) : {}
```

### Development Mode

When `NODE_ENV=development`, the reset link is logged to console:

```
🔑 DEV MODE - Password reset link: http://localhost:5173/reset-password/abc123...
```

You can click this link directly instead of waiting for email.

---

## 🎨 Email Customization

### Change Email Branding

Edit `server/utils/email.js`:

```javascript
// Change colors
style="background-color: #YOUR_COLOR;"

// Change logo text
COLLAB<span style="color: #7B38FF;">R</span>O

// Change tagline
The Creators Hub

// Change button text
Reset Password
```

### Change Expiration Time

Currently: **15 minutes**

To change:

1. Update `/forgot-password` route in `server/routes/auth.js`:
```javascript
user.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
```

2. Update email template in `server/utils/email.js`:
```html
This link expires in <strong>30 minutes</strong>.
```

### Add Your Logo

1. Host your logo image online (e.g., Cloudinary, imgbb)
2. Add to email template:

```html
<tr>
  <td style="padding: 40px 40px 0 40px; text-align: center;">
    <img src="https://your-domain.com/logo.png" alt="CollaBro Logo" style="max-width: 200px; height: auto;">
  </td>
</tr>
```

---

## 📊 Rate Limits

### Resend Free Plan
- **100 emails/day**
- **3,000 emails/month**
- Unlimited domains
- Unlimited team members

### Resend Pro Plan ($20/month)
- **50,000 emails/month**
- Extra emails: $1 per 1,000
- Custom DKIM
- Priority support

### CollaBro Rate Limits (Built-in)
- **5 password reset requests per 15 minutes** (per IP)
- Prevents abuse and email spam

---

## 🔒 Security Best Practices

### ✅ Already Implemented

1. **Token Hashing**
   - Plain token sent in email
   - SHA-256 hashed token stored in database
   - Attacker with database access can't use tokens

2. **Token Expiration**
   - Tokens expire after 15 minutes
   - Expired tokens automatically rejected

3. **Single Use Tokens**
   - Token deleted immediately after successful reset
   - Can't reuse the same reset link

4. **Email Enumeration Prevention**
   - Always return same message regardless of email existence
   - Attackers can't discover valid email addresses

5. **Rate Limiting**
   - 5 requests per 15 minutes prevents brute force
   - Protects against email bombing

6. **Password Validation**
   - 8-64 characters
   - Uppercase, lowercase, number, special char
   - Strong passwords enforced

---

## 🚀 Production Checklist

Before going live:

- [ ] Add real API key (not test key)
- [ ] Verify custom domain in Resend
- [ ] Update `RESEND_FROM_EMAIL` with real email
- [ ] Test email delivery to external addresses
- [ ] Update `CLIENT_URL` to production URL
- [ ] Set `NODE_ENV=production`
- [ ] Remove development console.logs
- [ ] Test complete flow end-to-end
- [ ] Check spam score (use mail-tester.com)
- [ ] Monitor Resend dashboard for delivery rates

---

## 📧 Alternative Email Providers

If you prefer not to use Resend:

### SendGrid
```bash
npm install @sendgrid/mail
```

### Mailgun
```bash
npm install mailgun.js form-data
```

### AWS SES
```bash
npm install @aws-sdk/client-ses
```

All require updating `server/utils/email.js` with provider-specific code.

---

## 💰 Cost Comparison

| Provider | Free Tier | Paid Plan |
|----------|-----------|-----------|
| **Resend** | 100/day, 3K/month | $20/mo → 50K/month |
| SendGrid | 100/day forever | $20/mo → 40K/month |
| Mailgun | 5K/month (3 months) | $35/mo → 50K/month |
| AWS SES | 62K/month (12 months) | $0.10 per 1K |

**Recommendation:** Resend for ease of use and great developer experience.

---

## 🆘 Support

### Resend Documentation
- **Docs:** [https://resend.com/docs](https://resend.com/docs)
- **API Reference:** [https://resend.com/docs/api-reference](https://resend.com/docs/api-reference)
- **Status:** [https://resend.com/status](https://resend.com/status)

### CollaBro Email Issues
Check:
1. Server console for error logs
2. `.env` file has correct API key
3. Resend dashboard for delivery status
4. Email spam folder

---

**Happy emailing! 📧✨**
