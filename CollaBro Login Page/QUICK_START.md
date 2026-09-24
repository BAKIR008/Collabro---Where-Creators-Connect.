# 🚀 Quick Start Guide - CollaBro Authentication System

Get up and running in 5 minutes!

---

## ⚡ Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Google OAuth credentials (optional, for Google login)

---

## 📋 Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

---

### 2. Configure Environment Variables

Create `.env` in the root of `CollaBro Login Page/`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/collabro

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Client
CLIENT_URL=http://localhost:5173

# Server
PORT=5000
NODE_ENV=development

# Cookie
COOKIE_SECRET=your-cookie-secret-key
```

Create `.env.local` (for Vite frontend):

```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

### 3. Get Google OAuth Credentials (Optional but Recommended)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **APIs & Services** → **Credentials**
5. Click **Create Credentials** → **OAuth 2.0 Client ID**
6. Choose **Web application**
7. Add **Authorized JavaScript origins**:
   - `http://localhost:5173`
8. Add **Authorized redirect URIs**:
   - `http://localhost:5173`
9. Copy the **Client ID**
10. Paste it in both `.env` and `.env.local`

---

### 4. Start MongoDB

**Option A: Local MongoDB**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
- Use connection string in `MONGODB_URI`

---

### 5. Migrate Existing Database (If You Have Existing Users)

```bash
node server/scripts/migrateProviders.js
```

**Expected output:**
```
🔄 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Found 3 users to migrate:

✅ Migrated: user1@example.com | google → [google]
✅ Migrated: user2@example.com | local → [local]
✅ Migrated: user3@example.com | local → [local]

📈 Migration Summary:
   ✅ Migrated: 3
   ⏭️  Skipped: 0
   📊 Total: 3

✅ Migration completed successfully!
```

---

### 6. Start Development Server

```bash
npm run dev
```

**This starts:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

---

### 7. Access the Application

Open your browser and navigate to:

**🔗 http://localhost:5173**

You'll see the login page!

---

## 🧪 Quick Test

### Test Email + Password Sign Up

1. Click **"Create Account"** link
2. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `TestPass123!`
   - Confirm Password: `TestPass123!`
   - Check "I agree to Terms & Conditions"
3. Click **"Create Account"**
4. ✅ You should be automatically logged in and redirected to dashboard!

### Test Email + Password Login

1. Log out
2. Go back to login page
3. Enter:
   - Email: `test@example.com`
   - Password: `TestPass123!`
4. Click **"Sign In"**
5. ✅ You should be logged in!

### Test Google OAuth (if configured)

1. Click **"Continue with Google"**
2. Select your Google account
3. ✅ You should be logged in!

---

## 🔍 Verify Database

Open MongoDB Compass or shell:

```javascript
use collabro
db.users.find().pretty()
```

**You should see:**
```javascript
{
  _id: ObjectId("..."),
  name: "Test User",
  email: "test@example.com",
  hashedPassword: "$2a$12$...",
  providers: ["local"],
  role: "user",
  isEmailVerified: false,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

---

## 📱 Available Routes

| Route | Description |
|-------|-------------|
| `/login` | Login page (email + password or Google) |
| `/signup` | Sign up page (email + password or Google) |
| `/forgot-password` | Request password reset |
| `/reset-password/:token` | Reset password with token |
| `/dashboard` | Protected dashboard (after login) |

---

## 🔧 Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB connection error: connect ECONNREFUSED
```
**Solution:** Start MongoDB service

### Google Login Not Working
```
⚠️ Google Login Not Configured
```
**Solution:** 
1. Add `VITE_GOOGLE_CLIENT_ID` to `.env.local`
2. Restart dev server (`npm run dev`)

### Port Already in Use
```
❌ Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change `PORT` in `.env` or kill the process using port 5000

### Rate Limit Reached
```
❌ Too many attempts. Please try again in 15 minutes.
```
**Solution:** Wait 15 minutes or restart the server (development only)

---

## 🎯 Next Steps

✅ **Basic setup complete!**

Now you can:

1. **Test all features** - See `TESTING_GUIDE.md`
2. **Read full documentation** - See `AUTH_SYSTEM.md`
3. **Customize the UI** - Modify `src/index.css`
4. **Add email service** - Integrate SendGrid/Mailgun
5. **Deploy to production** - Update environment variables

---

## 📚 Documentation

- `AUTH_SYSTEM.md` - Complete system overview
- `TESTING_GUIDE.md` - 20 detailed test cases
- `IMPLEMENTATION_SUMMARY.md` - What was implemented
- `QUICK_START.md` - This file

---

## 💡 Quick Tips

### Development Mode

- Server auto-reloads on code changes (nodemon)
- Frontend auto-reloads on code changes (Vite HMR)
- Reset tokens logged to console
- CORS allows localhost

### Production Mode

Before deploying:
- [ ] Change `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET`
- [ ] Use strong `COOKIE_SECRET`
- [ ] Enable HTTPS
- [ ] Configure CORS for your domain
- [ ] Set up email service
- [ ] Remove console.logs
- [ ] Run `npm run build`

---

## 🎉 You're All Set!

Your dual authentication system is now running with:

✅ Email + Password authentication
✅ Google OAuth authentication
✅ Automatic account linking
✅ Password reset functionality
✅ Secure JWT tokens
✅ Beautiful UI with your existing design

**Happy coding! 🚀**

---

## 🆘 Need Help?

1. Check `AUTH_SYSTEM.md` for detailed documentation
2. Check `TESTING_GUIDE.md` for test cases
3. Check server console for error messages
4. Check browser DevTools console for frontend errors
5. Verify MongoDB is running
6. Verify environment variables are correct

---

**Built with ❤️ for CollaBro**
