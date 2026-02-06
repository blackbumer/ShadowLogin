# ShadowLogin - Quick Start Guide

## 🚀 Getting Started (2 Minutes)

### Step 1: Install Dependencies
Open Command Prompt/PowerShell in the ShadowLogin folder:
```bash
npm install
```

### Step 2: Start the Server
```bash
npm start
```

You should see:
```
✓ Server running on http://localhost:3000
```

### Step 3: Open in Browser
Click the link or go to: **http://localhost:3000**

## 🎯 Basic Workflow

1. **Click "Generate Virtual Account"** button
2. **View the generated account** with username and email
3. **See the 10-minute countdown timer**
4. **Copy details** using the clipboard icons
5. **Track all accounts** in the list below
6. **Watch accounts expire** automatically after 10 minutes

## 📱 Features

| Feature | Details |
|---------|---------|
| **Generation** | Click to create random virtual accounts |
| **Username** | Format: `shadow_ABC123123` |
| **Email** | Format: `temp123@shadowlogin` |
| **Timer** | 10 minutes expiration countdown |
| **Status** | Active (green) / Expired (red) |
| **Storage** | Browser localStorage (persists on refresh) |
| **Copy** | Click 📋 icons to copy to clipboard |
| **Clear** | Delete all accounts at once |

## 🌐 Responsive Design

**Mobile** ✓
- Full-screen optimized
- Touch-friendly buttons
- Single column layout

**Tablet** ✓
- Optimized for medium screens
- Good spacing

**Desktop** ✓
- Full layout
- Professional appearance

## 🔌 API Usage (Optional)

The backend also provides REST API endpoints:

### Generate Account
```bash
curl -X POST http://localhost:3000/api/accounts/generate
```

### Get All Accounts
```bash
curl http://localhost:3000/api/accounts
```

### Check Server Health
```bash
curl http://localhost:3000/api/health
```

## 🛑 Stopping the Server

Press **Ctrl+C** in the terminal to stop the server.

## ❓ Troubleshooting

**Port 3000 already in use?**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <number> /F

# Mac/Linux
lsof -i :3000
kill -9 <number>
```

**Accounts not saving?**
- Check browser localStorage (DevTools > Application > Local Storage)
- Try clearing cache and reloading

**Backend not responding?**
- Ensure `npm install` was run
- Check Node.js version: `node -v` (should be 14+)
- Restart server: `npm start`

## 📂 Project Files

```
├── index.html        Main UI
├── styles.css        Dark theme styling
├── script.js         Frontend logic
├── server.js         Backend API
├── package.json      Dependencies
└── README.md         Full documentation
```

## ⚠️ Important Notes

✓ **This is a SAFE SIMULATION**
- Educational use only
- Does NOT bypass real authentication
- Does NOT connect to external services
- All data is temporary

## 📚 Learn More

See **README.md** for complete documentation.

---

**Happy Demonstrating! 🎓**
