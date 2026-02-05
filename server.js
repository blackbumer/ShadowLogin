/**
 * ShadowLogin Backend Server
 * Academic Graduation Demo Project
 * 
 * ⚠️ IMPORTANT NOTICE:
 * This is a SAFE SIMULATION ONLY for academic purposes.
 * - Does NOT bypass real authentication systems
 * - Does NOT connect to external services
 * - All data is temporary and stored locally
 * - Suitable only for educational demonstrations
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== Middleware ====================
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:8080'],
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// ==================== Database File ====================
const DB_FILE = path.join(__dirname, 'accounts.json');

// Initialize database
function initializeDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify({
            accounts: [],
            lastCleanup: new Date().toISOString()
        }, null, 2));
    }
}

// Read database
function readDatabase() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading database:', error);
        return { accounts: [], lastCleanup: new Date().toISOString() };
    }
}

// Write database
function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error writing database:', error);
    }
}

// Clean up expired accounts
function cleanupExpiredAccounts() {
    const db = readDatabase();
    const now = new Date();
    
    db.accounts = db.accounts.filter(account => {
        const expiresAt = new Date(account.expiresAt);
        return now < expiresAt;
    });
    
    db.lastCleanup = new Date().toISOString();
    writeDatabase(db);
}

// ==================== API Routes ====================

/**
 * Health Check Endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ShadowLogin server is running',
        timestamp: new Date().toISOString()
    });
});

/**
 * Generate Virtual Account
 * POST /api/accounts/generate
 */
app.post('/api/accounts/generate', (req, res) => {
    try {
        const account = generateAccount();
        
        // Save to database
        const db = readDatabase();
        db.accounts.push(account);
        writeDatabase(db);
        
        res.status(201).json({
            success: true,
            message: 'Virtual account generated successfully',
            account
        });
    } catch (error) {
        console.error('Error generating account:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating account',
            error: error.message
        });
    }
});

/**
 * Get All Accounts
 * GET /api/accounts
 */
app.get('/api/accounts', (req, res) => {
    try {
        cleanupExpiredAccounts();
        const db = readDatabase();
        
        const accounts = db.accounts.map(account => ({
            ...account,
            status: isAccountActive(account) ? 'active' : 'expired'
        }));
        
        res.json({
            success: true,
            accounts,
            count: accounts.length
        });
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching accounts',
            error: error.message
        });
    }
});

/**
 * Get Single Account
 * GET /api/accounts/:id
 */
app.get('/api/accounts/:id', (req, res) => {
    try {
        const db = readDatabase();
        const account = db.accounts.find(acc => acc.id === req.params.id);
        
        if (!account) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }
        
        res.json({
            success: true,
            account: {
                ...account,
                status: isAccountActive(account) ? 'active' : 'expired'
            }
        });
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching account',
            error: error.message
        });
    }
});

/**
 * Delete Account
 * DELETE /api/accounts/:id
 */
app.delete('/api/accounts/:id', (req, res) => {
    try {
        const db = readDatabase();
        const initialCount = db.accounts.length;
        
        db.accounts = db.accounts.filter(acc => acc.id !== req.params.id);
        
        if (db.accounts.length === initialCount) {
            return res.status(404).json({
                success: false,
                message: 'Account not found'
            });
        }
        
        writeDatabase(db);
        
        res.json({
            success: true,
            message: 'Account deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        });
    }
});

/**
 * Clear All Accounts
 * DELETE /api/accounts
 */
app.delete('/api/accounts', (req, res) => {
    try {
        const db = {
            accounts: [],
            lastCleanup: new Date().toISOString()
        };
        writeDatabase(db);
        
        res.json({
            success: true,
            message: 'All accounts cleared'
        });
    } catch (error) {
        console.error('Error clearing accounts:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing accounts',
            error: error.message
        });
    }
});

/**
 * Get Database Stats
 * GET /api/stats
 */
app.get('/api/stats', (req, res) => {
    try {
        cleanupExpiredAccounts();
        const db = readDatabase();
        
        const activeAccounts = db.accounts.filter(acc => isAccountActive(acc)).length;
        const expiredAccounts = db.accounts.filter(acc => !isAccountActive(acc)).length;
        
        res.json({
            success: true,
            stats: {
                totalAccounts: db.accounts.length,
                activeAccounts,
                expiredAccounts,
                lastCleanup: db.lastCleanup,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching stats',
            error: error.message
        });
    }
});

// ==================== Root Routes ====================

/**
 * Serve main page
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

/**
 * Handle 404
 */
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path
    });
});

// ==================== Helper Functions ====================

/**
 * Generate a new virtual account
 */
function generateAccount() {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const randomNumbers = Math.floor(Math.random() * 900) + 100;
    
    const username = `shadow_${randomString}${randomNumbers}`;
    const email = `temp${randomNumbers}@shadowlogin.demo`;
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 minutes
    
    return {
        id: Math.random().toString(36).substring(2, 11),
        username,
        email,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'active'
    };
}

/**
 * Check if account is still active
 */
function isAccountActive(account) {
    const now = new Date();
    const expiresAt = new Date(account.expiresAt);
    return now < expiresAt;
}

// ==================== Scheduled Tasks ====================

// Cleanup expired accounts every 5 minutes
setInterval(() => {
    cleanupExpiredAccounts();
    console.log(`[${new Date().toISOString()}] Cleanup task completed`);
}, 5 * 60 * 1000);

// ==================== Server Startup ====================

initializeDatabase();

const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║        ShadowLogin - Virtual Account Demo              ║
║              Academic Graduation Project               ║
╚════════════════════════════════════════════════════════╝

✓ Server running on http://localhost:${PORT}
✓ Frontend: http://localhost:${PORT}
✓ API: http://localhost:${PORT}/api

⚠️  IMPORTANT: This is a SAFE SIMULATION ONLY
   - Educational purpose only
   - No real authentication bypass
   - No external service connections
   - Temporary data storage

📚 API Endpoints:
   GET    /api/health              - Health check
   POST   /api/accounts/generate   - Generate account
   GET    /api/accounts            - List all accounts
   GET    /api/accounts/:id        - Get account by ID
   DELETE /api/accounts/:id        - Delete account
   DELETE /api/accounts            - Clear all accounts
   GET    /api/stats               - Get statistics

Press Ctrl+C to stop the server.
    `);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n✓ Server shutting down gracefully...');
    server.close(() => {
        console.log('✓ Server closed');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;
