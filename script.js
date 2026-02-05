// ==================== Configuration ====================
const API_BASE_URL = 'http://localhost:3000/api';
const UPDATE_INTERVAL = 1000; // Update timer every second

// ==================== Account Types Configuration ====================
const ACCOUNT_TYPES = {
    social: {
        name: 'Social Media Profile',
        icon: '👤',
        defaultFields: ['username', 'fullname', 'avatar'],
        description: 'Social Media Profile'
    },
    email: {
        name: 'Email Style Account',
        icon: '📧',
        defaultFields: ['email', 'fullname'],
        description: 'Email Style Account'
    },
    website: {
        name: 'Website Registration',
        icon: '🌐',
        defaultFields: ['username', 'email', 'fullname'],
        description: 'Website Registration Account'
    },
    gaming: {
        name: 'Gaming Profile',
        icon: '🎮',
        defaultFields: ['username', 'avatar'],
        description: 'Gaming Profile'
    },
    anonymous: {
        name: 'Anonymous Profile',
        icon: '👻',
        defaultFields: ['username'],
        description: 'Anonymous Profile'
    },
    custom: {
        name: 'Custom Profile',
        icon: '⚙️',
        defaultFields: [],
        description: 'Custom Profile'
    }
};

// ==================== Avatar Emojis ====================
const AVATARS = [
    '👨', '👩', '👦', '👧', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲',
    '🧔', '👴', '👵', '🎭', '👤', '👥'
];

// ==================== Random Data Generators ====================
const FIRST_NAMES = [
    'Alex', 'Jordan', 'Casey', 'Taylor', 'Morgan', 'Riley', 'Jamie', 'Sydney',
    'Cameron', 'Blake', 'Quinn', 'Avery', 'Dakota', 'Phoenix', 'River', 'Sky'
];

const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Taylor'
];

// ==================== DOM Elements ====================
const typeSelectionScreen = document.getElementById('typeSelectionScreen');
const configurationPanel = document.getElementById('configurationPanel');
const accountDisplaySection = document.getElementById('accountDisplaySection');
const dashboardSection = document.getElementById('dashboardSection');

const typeCards = document.querySelectorAll('.type-card');
const backToTypesBtn = document.getElementById('backToTypes');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');
const generateAnotherBtn = document.getElementById('generateAnotherBtn');
const copyAllBtn = document.getElementById('copyAllBtn');

const fieldCheckboxes = document.querySelectorAll('.field-checkbox');
const countrySelect = document.getElementById('countrySelect');
const lifetimeRadios = document.querySelectorAll('.lifetime-radio');
const privacyRadios = document.querySelectorAll('.privacy-radio');

const statusMessage = document.getElementById('statusMessage');
const selectedTypeLabel = document.getElementById('selectedTypeLabel');
const privacyScoreBar = document.getElementById('privacyScoreBar');
const privacyScoreText = document.getElementById('privacyScoreText');

// Dashboard elements
const totalAccountsElem = document.getElementById('totalAccounts');
const activeAccountsElem = document.getElementById('activeAccounts');
const expiredAccountsElem = document.getElementById('expiredAccounts');
const avgPrivacyScoreElem = document.getElementById('avgPrivacyScore');
const accountsList = document.getElementById('accountsList');
const activityLog = document.getElementById('activityLog');
const displayAvatar = document.getElementById('displayAvatar');
const detailsContainer = document.getElementById('detailsContainer');

// ==================== State Management ====================
let currentAccountType = null;
let accounts = [];
let activityEntries = [];

// ==================== Initialization ====================
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    setupLanguageSwitcher();
    setupEventListeners();
    loadAccountsFromLocalStorage();
    startExpirationTimer();
});

// ==================== Event Listeners ====================
function setupEventListeners() {
    // Type selection
    typeCards.forEach(card => {
        card.addEventListener('click', () => selectAccountType(card.dataset.type));
    });

    backToTypesBtn.addEventListener('click', backToTypeSelection);
    generateBtn.addEventListener('click', handleGenerateAccount);
    clearBtn.addEventListener('click', handleClearAll);
    generateAnotherBtn.addEventListener('click', backToTypeSelection);
    copyAllBtn.addEventListener('click', handleCopyAll);

    // Configuration changes
    fieldCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updatePrivacyScore);
    });

    privacyRadios.forEach(radio => {
        radio.addEventListener('change', updatePrivacyScore);
    });

    // Dynamic field updates and action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            handleCopyToClipboard(e.target);
        }

        // Deactivate from list or card
        if (e.target.closest && e.target.closest('.btn-deactivate')) {
            const id = e.target.closest('[data-id]')?.dataset.id || window.currentAccount?.id;
            if (id) deactivateAccountById(id);
        }

        // Share action
        if (e.target.closest && e.target.closest('.btn-share')) {
            const id = e.target.closest('[data-id]')?.dataset.id || window.currentAccount?.id;
            if (id) shareAccountById(id);
        }

        // View details
        if (e.target.classList.contains('btn-view')) {
            const id = e.target.dataset.id;
            if (id) viewAccountById(id);
        }

            // Mobile menu toggle
            if (e.target.id === 'mobileMenuToggle') toggleMobileMenu();
    });

    // Share modal buttons
    document.getElementById('shareCopyBtn')?.addEventListener('click', () => {
        const txt = document.getElementById('shareText').value || '';
        if (txt) copyToClipboard(txt);
    });
    document.getElementById('shareCloseBtn')?.addEventListener('click', () => {
        document.getElementById('shareModal').classList.add('hidden');
    });

    // Feedback form (demo)
    document.getElementById('feedbackForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        showStatus('✓ Feedback submitted (demo)', 'success');
    });

    // Star rating demo
    document.getElementById('starRating')?.addEventListener('click', (e) => {
        const star = e.target.closest('.star');
        if (!star) return;
        const value = star.dataset.value;
        document.getElementById('ratingResult').textContent = `Thanks! You rated ${value} stars (demo)`;
    });

    // Chat demo
    document.getElementById('chatSendBtn')?.addEventListener('click', () => {
        const input = document.getElementById('chatInputField');
        const msg = input.value.trim();
        if (!msg) return;
        const container = document.getElementById('chatMessages');
        const el = document.createElement('div');
        el.className = 'chat-user';
        el.textContent = msg;
        container.appendChild(el);
        input.value = '';
        setTimeout(() => {
            const bot = document.createElement('div');
            bot.className = 'chat-bot';
            bot.textContent = 'This is a demo reply. For live support, please contact the team.';
            container.appendChild(bot);
        }, 800);
    });
    
    // Anchor nav smooth scrolling and active link highlighting
    initAnchorNav();
    // Header collapse behavior near bottom
    initHeaderCollapse();
    
    // Start Generating button
    document.getElementById('startGenerating')?.addEventListener('click', () => {
        const generatorSection = document.getElementById('generatorSection');
        if (generatorSection) {
            generatorSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

// Collapse header logo/title when user scrolls near bottom; reveal when at top
function initHeaderCollapse() {
    const header = document.querySelector('.header');
    if (!header) return;
    let ticking = false;

    const logoSection = header.querySelector('.logo-section');
    const originalPaddingTop = parseFloat(getComputedStyle(header).paddingTop) || 48;
    const originalPaddingBottom = parseFloat(getComputedStyle(header).paddingBottom) || originalPaddingTop;
    const collapsedPadding = 8; // px when fully collapsed

    // thresholds for scrolling down: start fading after `startFadeTop` px, fully hidden at `endFadeTop`
    const startFadeTop = 50;  // start fading after user scrolls down 50px
    const endFadeTop = 300;   // fully hidden at 300px scroll

    function check() {
        const scrollY = window.scrollY || window.pageYOffset;
        const nearTop = scrollY < 20; // restore quickly near top

        // Compute fade progress t in [0..1] based on scrollY between startFadeTop and endFadeTop
        let t = 0;
        if (scrollY > startFadeTop) {
            t = (Math.min(scrollY, endFadeTop) - startFadeTop) / Math.max((endFadeTop - startFadeTop), 1);
            t = Math.min(1, Math.max(0, t));
        }

        // If near top, force fully visible
        if (nearTop) t = 0;

        // Apply visual transforms based on t (t=0 visible, t=1 hidden)
        if (logoSection) {
            logoSection.style.opacity = String(1 - t);
            logoSection.style.transform = `translateY(-${8 * t}px)`;
            logoSection.style.pointerEvents = t > 0.98 ? 'none' : '';
        }

        const padTop = collapsedPadding + (originalPaddingTop - collapsedPadding) * (1 - t);
        const padBottom = collapsedPadding + (originalPaddingBottom - collapsedPadding) * (1 - t);
        header.style.paddingTop = `${padTop}px`;
        header.style.paddingBottom = `${padBottom}px`;

        // Toggle collapsed class for CSS fallbacks when fully collapsed
        if (t >= 0.98) header.classList.add('header-collapsed');
        else header.classList.remove('header-collapsed');
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                check();
                ticking = false;
            });
        }
    }, { passive: true });

    // initial evaluation
    check();
}

function initAnchorNav() {
    // Smooth scroll for nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // close mobile menu
            document.querySelector('.nav-list')?.classList.remove('open');
        });
    });

    // IntersectionObserver to mark active section
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = navLinks.find(l => l.getAttribute('href') === `#${id}`);
            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    sections.forEach(s => obs.observe(s));
}

// ==================== Type Selection ====================
function selectAccountType(type) {
    currentAccountType = type;
    
    // Update UI
    typeCards.forEach(card => card.classList.remove('active'));
    document.querySelector(`[data-type="${type}"]`).classList.add('active');
    
    // Update label with translation
    const typeKey = `generator.${type}`;
    selectedTypeLabel.setAttribute('data-i18n', typeKey);
    selectedTypeLabel.textContent = t(typeKey);
    
    // Set default checkboxes
    fieldCheckboxes.forEach(checkbox => {
        checkbox.checked = ACCOUNT_TYPES[type].defaultFields.includes(checkbox.id.replace('field-', ''));
    });
    
    // Show configuration panel
    typeSelectionScreen.classList.add('hidden');
    configurationPanel.classList.remove('hidden');
    
    updatePrivacyScore();
}

function backToTypeSelection() {
    currentAccountType = null;
    typeSelectionScreen.classList.remove('hidden');
    configurationPanel.classList.add('hidden');
    accountDisplaySection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    typeCards.forEach(card => card.classList.remove('active'));
}

// ==================== Account Generation ====================
async function handleGenerateAccount() {
    try {
        generateBtn.disabled = true;
        showStatus('Generating virtual account...', 'info');

        // Get selected options
        const selectedFields = Array.from(fieldCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.id.replace('field-', ''));

        const lifetime = parseInt(document.querySelector('input[name="lifetime"]:checked').value) * 60 * 1000;
        const privacyLevel = document.querySelector('input[name="privacy"]:checked').value;
        const country = countrySelect.value;

        // Generate account
        const account = generateAccountData(currentAccountType, selectedFields, lifetime, privacyLevel, country);
        
        // Add to accounts
        accounts.push(account);
        saveAccountsToLocalStorage();
        addActivityLog(`Account generated: ${account.username}`);

        // Display the account
        displayGeneratedAccount(account);
        updateDashboard();
        
        showStatus('✓ Virtual account created successfully!', 'success');
    } catch (error) {
        console.error('Error generating account:', error);
        showStatus(`✗ Error generating account: ${error.message}`, 'error');
    } finally {
        generateBtn.disabled = false;
    }
}

function generateAccountData(type, selectedFields, lifetime, privacyLevel, country) {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const randomNumbers = Math.floor(Math.random() * 900) + 100;
    
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + lifetime);

    // Generate data based on selected fields
    const accountData = {
        id: Math.random().toString(36).substring(2, 11),
        type,
        username: selectedFields.includes('username') ? `shadow_${randomString}${randomNumbers}` : null,
        fullname: selectedFields.includes('fullname') ? generateRandomName() : null,
        email: selectedFields.includes('email') ? `temp${randomNumbers}@shadowlogin.demo` : null,
        phone: selectedFields.includes('phone') ? generatePhoneNumber(country) : null,
        avatar: selectedFields.includes('avatar') ? generateRandomAvatar() : null,
        gamerTag: type === 'gaming' && selectedFields.includes('username') ? `Gamer_${randomNumbers}` : null,
        bio: type === 'social' ? generateRandomBio() : null,
        country,
        privacyLevel,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
        status: 'active',
        privacyScore: calculatePrivacyScore(selectedFields, privacyLevel)
    };

    return accountData;
}

function generateRandomName() {
    return `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`;
}

function generatePhoneNumber(country) {
    const countryMap = {
        us: '+1',
        de: '+49',
        kz: '+7',
        uk: '+44',
        fr: '+33',
        jp: '+81',
        cn: '+86',
        ru: '+7',
        in: '+91',
        br: '+55'
    };
    
    const code = countryMap[country] || '+1';
    const number = Math.floor(Math.random() * 9000000000) + 1000000000;
    return `${code} ${number.toString().slice(0, 3)}-${number.toString().slice(3, 6)}-${number.toString().slice(6)}`;
}

function generateRandomAvatar() {
    return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

function generateRandomBio() {
    const bios = [
        'Tech enthusiast | Coffee lover ☕',
        'Always learning | Adventure seeker 🌍',
        'Creative soul | Digital artist 🎨',
        'Gamer & coder | Night owl 🌙',
        'Traveler | Photography enthusiast 📸',
        'Music lover | Bookworm 📚',
        'Fitness enthusiast | Health focused 💪',
        'Designer | Innovation focused ✨'
    ];
    return bios[Math.floor(Math.random() * bios.length)];
}

function calculatePrivacyScore(selectedFields, privacyLevel) {
    let baseScore = 100;
    
    // Reduce score based on selected fields
    const fieldValues = {
        username: 20,
        fullname: 15,
        email: 20,
        phone: 25,
        avatar: 5
    };
    
    selectedFields.forEach(field => {
        if (fieldValues[field]) {
            baseScore -= fieldValues[field];
        }
    });
    
    // Adjust based on privacy level
    const privacyMultiplier = {
        basic: 1,
        medium: 1.3,
        full: 1.5
    };
    
    baseScore = Math.min(100, baseScore * privacyMultiplier[privacyLevel]);
    return Math.max(10, Math.round(baseScore));
}

// ==================== Display Generated Account ====================
function displayGeneratedAccount(account) {
    // Show avatar
    displayAvatar.textContent = account.avatar || '👤';
    
    // Build details HTML
    let detailsHTML = '';
    
    const displayFields = [
        { key: 'username', labelKey: 'dashboard.accountDisplay.username', value: account.username },
        { key: 'fullname', labelKey: 'dashboard.accountDisplay.fullName', value: account.fullname },
        { key: 'email', labelKey: 'dashboard.accountDisplay.email', value: account.email },
        { key: 'phone', labelKey: 'dashboard.accountDisplay.phone', value: account.phone },
        { key: 'gamerTag', labelKey: 'dashboard.accountDisplay.gamerTag', value: account.gamerTag },
        { key: 'bio', labelKey: 'dashboard.accountDisplay.bio', value: account.bio },
        { key: 'country', labelKey: 'dashboard.accountDisplay.country', value: account.country },
        { key: 'privacyLevel', labelKey: 'dashboard.accountDisplay.privacyLevel', value: account.privacyLevel ? account.privacyLevel.toUpperCase() : null },
        { key: 'privacyScore', labelKey: 'dashboard.accountDisplay.privacyScore', value: account.privacyScore ? `${account.privacyScore}%` : null },
        { key: 'expiresAt', labelKey: 'dashboard.accountDisplay.expiresIn', value: formatExpirationTime(account) }
    ];
    
    displayFields.forEach(field => {
        if (field.value) {
            const label = t(field.labelKey);
            detailsHTML += `
                <div class="detail-item">
                    <div class="detail-label">${label}</div>
                    <div class="detail-value">${escapeHtml(String(field.value))}</div>
                    ${['username', 'email', 'phone', 'gamerTag'].includes(field.key) ? `<button class="detail-copy" data-target="${field.key}">📋</button>` : ''}
                </div>
            `;
        }
    });
    
    detailsContainer.innerHTML = detailsHTML;
    
    // Store current account for copying
    window.currentAccount = account;
    
    // Setup copy buttons
    document.querySelectorAll('.detail-copy').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            const value = account[target];
            copyToClipboard(String(value));
        });
    });

    // Setup deactivate & share buttons in the account card
    const deactivateBtnEl = document.getElementById('deactivateBtn');
    const shareBtnEl = document.getElementById('shareBtn');
    if (deactivateBtnEl) {
        deactivateBtnEl.dataset.id = account.id;
        deactivateBtnEl.classList.add('btn-deactivate');
    }
    if (shareBtnEl) {
        shareBtnEl.dataset.id = account.id;
        shareBtnEl.classList.add('btn-share');
    }
    
    // Show display section, hide others
    typeSelectionScreen.classList.add('hidden');
    configurationPanel.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    accountDisplaySection.classList.remove('hidden');
}

function formatExpirationTime(account) {
    const expiresAt = new Date(account.expiresAt);
    const now = new Date();
    const timeRemaining = expiresAt - now;

    if (timeRemaining <= 0) {
        return 'Expired';
    }

    const minutes = Math.floor(timeRemaining / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
}

// ==================== Privacy Score Update ====================
function updatePrivacyScore() {
    const selectedFields = Array.from(fieldCheckboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.id.replace('field-', ''));

    const privacyLevel = document.querySelector('input[name="privacy"]:checked').value;
    
    const score = calculatePrivacyScore(selectedFields, privacyLevel);
    
    privacyScoreBar.style.width = (100 - score) + '%';
    privacyScoreText.textContent = `${100 - score}% - ${getPrivacyDescription(score)}`;
}

function getPrivacyDescription(score) {
    if (score >= 70) return 'More Private';
    if (score >= 40) return 'Moderate Privacy';
    return 'Less Private';
}

// ==================== Accounts List & Dashboard ====================
function updateDashboard() {
    const now = new Date();
    const active = accounts.filter(acc => new Date(acc.expiresAt) > now).length;
    const expired = accounts.length - active;
    const avgPrivacy = accounts.length > 0 
        ? Math.round(accounts.reduce((sum, acc) => sum + acc.privacyScore, 0) / accounts.length)
        : 0;

    totalAccountsElem.textContent = accounts.length;
    activeAccountsElem.textContent = active;
    expiredAccountsElem.textContent = expired;
    avgPrivacyScoreElem.textContent = avgPrivacy + '%';

    renderAccountsList();
    renderActivityLog();
}

function renderAccountsList() {
    const now = new Date();
    const sorted = accounts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (sorted.length === 0) {
        accountsList.innerHTML = `
            <div class="empty-state">
                <p>📭 No accounts</p>
                <p class="empty-hint">Generate your first account to get started</p>
            </div>
        `;
        return;
    }

    accountsList.innerHTML = sorted.map(account => {
        const timeRemaining = formatExpirationTime(account);
        const createdAt = new Date(account.createdAt).toLocaleString();
        const typeIcon = ACCOUNT_TYPES[account.type]?.icon || '📝';
        const statusClass = account.status === 'expired' ? 'status-expired' : (account.status === 'deactivated' ? 'status-deactivated' : 'status-active');

        return `
            <div class="account-item ${account.status === 'expired' ? 'expired' : ''}" data-id="${account.id}">
                <div class="account-item-header">
                    <div>
                        <div class="account-item-title">${typeIcon} ${account.username || 'Anonymous'}</div>
                        <span class="status-badge ${statusClass}">${account.status.toUpperCase()}</span>
                    </div>
                    <div class="account-actions">
                        ${account.status === 'active' ? `<button class="btn btn-secondary btn-deactivate" title="Deactivate">🔴</button>` : ''}
                        <button class="btn btn-secondary btn-share" title="Share">🔗</button>
                        <button class="btn btn-secondary btn-view" data-id="${account.id}" title="View">👁</button>
                    </div>
                </div>
                <div class="account-item-meta">
                    <div class="meta-row">
                        <span class="meta-label">Type:</span>
                        <span class="meta-value">${ACCOUNT_TYPES[account.type]?.name || 'Unknown'}</span>
                    </div>
                    ${account.email ? `<div class="meta-row">
                        <span class="meta-label">Email:</span>
                        <span class="meta-value">${account.email}</span>
                    </div>` : ''}
                    <div class="meta-row">
                        <span class="meta-label">Privacy:</span>
                        <span class="meta-value">${account.privacyScore}%</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Expires:</span>
                        <span class="meta-value">${timeRemaining}</span>
                    </div>
                    <div class="meta-row">
                        <span class="meta-label">Created:</span>
                        <span class="meta-value">${createdAt}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function renderActivityLog() {
    if (activityEntries.length === 0) {
        activityLog.innerHTML = '<div class="activity-empty">No activity yet</div>';
        return;
    }

    activityLog.innerHTML = activityEntries.map(entry => `
        <div class="activity-log-item">
            <div class="activity-time">${entry.time}</div>
            <div class="activity-message">${entry.message}</div>
        </div>
    `).reverse().join('');
}

function addActivityLog(message) {
    const now = new Date();
    activityEntries.push({
        time: now.toLocaleTimeString(),
        message: message
    });

    // Keep only last 20 entries
    if (activityEntries.length > 20) {
        activityEntries = activityEntries.slice(-20);
    }

    renderActivityLog();
}

// ==================== Clear All ====================
function handleClearAll() {
    if (confirm('Are you sure you want to clear all accounts? This action cannot be undone.')) {
        accounts = [];
        activityEntries = [];
        saveAccountsToLocalStorage();
        accountDisplaySection.classList.add('hidden');
        updateDashboard();
        addActivityLog('All accounts cleared');
        showStatus('All accounts cleared.', 'info');
    }
}

// ==================== Copy Functionality ====================
function handleCopyAll() {
    if (!window.currentAccount) return;

    const account = window.currentAccount;
    const copyText = Object.entries(account)
        .filter(([key, value]) => value && !['id', 'createdAt', 'expiresAt', 'status'].includes(key))
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    copyToClipboard(copyText);
}

function handleCopyToClipboard(button) {
    const targetId = button.getAttribute('data-target');
    const targetElement = document.getElementById(targetId);
    const textToCopy = targetElement?.textContent || '';

    if (textToCopy) {
        copyToClipboard(textToCopy);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showStatus('✓ Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy:', err);
        showStatus('✗ Failed to copy to clipboard', 'error');
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== Status Messages ====================
function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message show ${type}`;
    
    if (type !== 'error') {
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 4000);
    }
}

// ==================== Expiration Timer ====================
function startExpirationTimer() {
    setInterval(() => {
        let updated = false;
        accounts.forEach(account => {
            const now = new Date();
            const expiresAt = new Date(account.expiresAt);
            
            if (account.status === 'active' && now > expiresAt) {
                account.status = 'expired';
                updated = true;
                addActivityLog(`Account expired: ${account.username || account.id}`);
                showStatus(`Account expired: ${account.username || account.id}`, 'info');
            }
        });

        if (updated) {
            saveAccountsToLocalStorage();
        }

        // Update display if dashboard is visible
        if (!dashboardSection.classList.contains('hidden')) {
            updateDashboard();
        }
    }, UPDATE_INTERVAL);
}

// ==================== Local Storage ====================
function saveAccountsToLocalStorage() {
    // Persist all accounts and activity entries for demo persistence
    localStorage.setItem('shadowlogin_accounts', JSON.stringify(accounts));
    localStorage.setItem('shadowlogin_activity', JSON.stringify(activityEntries));
}

function loadAccountsFromLocalStorage() {
    try {
        const stored = localStorage.getItem('shadowlogin_accounts');
        const storedActivity = localStorage.getItem('shadowlogin_activity');
        
        if (stored) {
            accounts = JSON.parse(stored);
        }
        if (storedActivity) {
            activityEntries = JSON.parse(storedActivity);
        }
        // Recalculate statuses based on current time
        const now = new Date();
        let updated = false;
        accounts.forEach(acc => {
            const expiresAt = new Date(acc.expiresAt);
            if (acc.status === 'active' && now > expiresAt) {
                acc.status = 'expired';
                updated = true;
                addActivityLog(`Account expired: ${acc.username || acc.id}`);
            }
        });

        if (updated) saveAccountsToLocalStorage();

        updateDashboard();
    } catch (error) {
        console.error('Error loading accounts from storage:', error);
        accounts = [];
        activityEntries = [];
    }
}

// ==================== Account Actions ====================
function deactivateAccountById(id) {
    const idx = accounts.findIndex(a => a.id === id);
    if (idx === -1) return;
    const acc = accounts[idx];
    if (acc.status !== 'deactivated') {
        acc.status = 'deactivated';
        saveAccountsToLocalStorage();
        addActivityLog(`Account deactivated: ${acc.username || acc.id}`);
        updateDashboard();
        renderAccountsList();
        showStatus('Account deactivated (demo).', 'info');
    }
}

function shareAccountById(id) {
    const acc = accounts.find(a => a.id === id) || window.currentAccount;
    if (!acc) return;
    const text = Object.entries(acc)
        .filter(([k, v]) => v && !['id'].includes(k))
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');
    const modal = document.getElementById('shareModal');
    document.getElementById('shareText').value = text;
    modal.classList.remove('hidden');
}

function viewAccountById(id) {
    const acc = accounts.find(a => a.id === id);
    if (!acc) return;
    displayGeneratedAccount(acc);
}

function showSection(sectionId) {
    // hide all page sections and show the requested
    document.querySelectorAll('.page-section, .type-selection-screen, .configuration-panel, .account-display-section, .dashboard-section').forEach(el => {
        el.classList.add('hidden');
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.classList.remove('hidden');
    }

    // If showing dashboard or types, ensure navigation visibility
    if (sectionId === 'dashboardSection') {
        dashboardSection.classList.remove('hidden');
    }
    if (sectionId === 'typeSelectionScreen') {
        typeSelectionScreen.classList.remove('hidden');
    }
}

function toggleMobileMenu() {
    const nav = document.querySelector('.nav-list');
    if (!nav) return;
    nav.classList.toggle('open');
}
