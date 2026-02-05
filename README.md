# ShadowLogin - Virtual Account Generation Demo

An academic graduation project demonstrating a **safe simulation** of virtual account generation with a responsive design.

> ⚠️ **Important**: This is an educational demo only. It does NOT bypass real authentication systems, does NOT connect to external services, and does NOT perform any actual security operations.

## Features

✨ **Core Features:**
- Mobile-first responsive design (desktop & mobile friendly)
- Generate virtual accounts with random usernames
- Demo email generation (temp@shadowlogin.demo)
- Account expiration timer (10 minutes)
- Active/Expired status tracking
- Dark theme UI (Shadow style)
- Persistent local storage
- Clean, modern dashboard interface

## Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Responsive design with CSS Grid/Flexbox
- **Vanilla JavaScript** - No dependencies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON** - Temporary data storage
- **CORS** - Cross-origin resource sharing

## Project Structure

```
ShadowLogin/
├── index.html          # Frontend HTML
├── styles.css          # Responsive CSS (dark theme)
├── script.js           # Frontend JavaScript
├── server.js           # Express backend
├── package.json        # Node.js dependencies
├── accounts.json       # Temporary account database
├── README.md           # This file
└── .gitignore          # Git ignore file
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Modern web browser

### Installation Steps

1. **Navigate to project directory:**
   ```bash
   cd ShadowLogin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open `http://localhost:3000` in your browser
   - The server will automatically serve the frontend

## How It Works

### Account Generation Flow

1. **User Action**: Click "Generate Virtual Account" button
2. **Backend Generation**: Server generates random username and email
3. **Storage**: Account data saved to temporary JSON database
4. **Display**: New account shown with expiration timer
5. **Updates**: Frontend updates status every second (10-minute countdown)
6. **Expiration**: Accounts automatically expire after 10 minutes

### User Interface

**Dashboard Components:**
- **Header**: Title, logo, and subtitle
- **Generation Panel**: Button to generate new accounts
- **Account Display**: Shows last generated account details with copy-to-clipboard
- **Accounts List**: Grid of all active accounts with status badges
- **Info Section**: Educational disclaimer about the demo
- **Footer**: Project information

### Responsive Design

- **Desktop**: Full layout with proper spacing
- **Tablet**: Optimized for medium screens
- **Mobile**: Single column layout with touch-friendly buttons

## API Endpoints

All endpoints return JSON responses with `success` and `message` fields.

### Account Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/accounts/generate` | Generate new virtual account |
| GET | `/api/accounts` | Get all active accounts |
| GET | `/api/accounts/:id` | Get account by ID |
| DELETE | `/api/accounts/:id` | Delete specific account |
| DELETE | `/api/accounts` | Clear all accounts |

### Server Info

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/stats` | Database statistics |

## Data Structure

### Account Object

```json
{
  "id": "abc123def45",
  "username": "shadow_ABC123123",
  "email": "temp123@shadowlogin.demo",
  "createdAt": "2026-02-05T10:30:00.000Z",
  "expiresAt": "2026-02-05T10:40:00.000Z",
  "status": "active"
}
```

## Configuration

### Frontend (`script.js`)
- `API_BASE_URL` - Backend API endpoint
- `ACCOUNT_EXPIRATION_TIME` - Account lifetime (10 minutes)
- `UPDATE_INTERVAL` - Timer refresh rate (1 second)

### Backend (`server.js`)
- `PORT` - Server port (default: 3000)
- Database file: `accounts.json`
- Cleanup interval: 5 minutes (removes expired accounts)

## Features in Detail

### Virtual Account Generation

Generates accounts with:
- **Username Format**: `shadow_[RANDOM_STRING][RANDOM_NUMBERS]`
  - Example: `shadow_ABC123123`
- **Email Format**: `temp[NUMBERS]@shadowlogin.demo`
  - Example: `temp123@shadowlogin.demo`
- **Expiration**: 10 minutes from creation
- **Unique IDs**: Random string identifiers

### Expiration Timer

- **Display Format**: `Xm Ys` (minutes and seconds)
- **Update Rate**: Every 1 second
- **Status Change**: Automatically marks as "Expired" when time reaches 0
- **Persistence**: Stored in browser's localStorage

### UI Components

**Status Badges:**
- Active (green): `#10b981`
- Expired (red): `#ef4444`

**Dark Theme Colors:**
- Primary: `#7c3aed` (Purple)
- Background: `#0f172a` (Navy)
- Text: `#f1f5f9` (Light)

## Development Notes

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Local Storage

- Accounts are persisted in browser localStorage
- Cleanup removes entries older than 1 hour
- Max storage: Depends on browser (usually 5-10MB)

### Server Cleanup

- Automatic cleanup every 5 minutes
- Removes expired accounts from database
- Logs cleanup events to console

## Security & Disclaimer

⚠️ **Important Security Notes:**

1. **No Real Authentication**: This is a simulation. Accounts do NOT provide real access.
2. **No External Integration**: Does NOT connect to real services or APIs.
3. **Educational Only**: Designed for academic demonstrations and graduation projects.
4. **Data Isolation**: All data is stored locally; nothing is sent to external servers.
5. **Temporary Storage**: Accounts and data are temporary and automatically expired.

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Accounts Not Persisting
- Clear browser localStorage and reload
- Check browser console for errors
- Verify backend is running

### Styling Issues
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure `styles.css` is in same directory as `index.html`
- Check CSS file size and syntax

## Performance Metrics

- **Frontend Load Time**: < 500ms
- **Account Generation**: < 100ms
- **API Response Time**: < 50ms
- **Database Cleanup**: < 100ms

## Future Enhancement Ideas

- Add username customization options
- Implement account search/filter
- Add export accounts feature (CSV/JSON)
- Email notification simulation
- Account activity logging
- Admin dashboard
- Database backup functionality
- Rate limiting on account generation

## License

MIT License - See LICENSE file for details

## Author

Academic Graduation Demo Project
Created: February 2026

---

**Disclaimer**: This project is intended for educational purposes only. Do not use this code for any real authentication, security bypassing, or unauthorized access attempts.
