// ==================== ADMIN CREDENTIALS ====================
const ADMIN_ID = "2105056";
const ADMIN_PASSWORD = "sotorupa72";

// ==================== GLOBAL VARIABLES ====================
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
let currentUserRole = 'user';
let currentUserNickname = '';
let currentTrack = 0;
let isMusicPlaying = false;
let isDayMode = false;
let audioElement = null;
let db = null;
let analytics = null;
let userChart = null;
let globalUserStats = {
    totalUsers: 0,
    todayUsers: 0,
    activeNow: 0,
    userGrowth: []
};

// Educational Courses Data with Google Drive Links
const courses = {
    'Level 1 Semester 1': {
        driveId: '1KnVbNU1DQbT5iZabjggqdH3WbU5gGfjF',
        commonCredits: 16,
        commonHours: 22
    },
    'Level 1 Semester 2': {
        driveId: '1Tko3rK5qUpkzzmvhN1tUdOJcwwFA2huN',
        commonCredits: 18,
        commonHours: 23
    },
    'Level 2 Semester 1': {
        driveId: '1M4-YeVeRfMLY5pgOyZoJp6RQQhVLJwhB',
        commonCredits: 17,
        commonHours: 21
    },
    'Level 2 Semester 2': {
        driveId: '1TUNRU-Plhc32I6DmCMPX43a7eReHdD5T',
        commonCredits: 18,
        commonHours: 23
    },
    'Level 3 Semester 1': {
        driveId: '1ymTtK0-XdlROqKB7AXN7GhKjMtkxoGVe',
        commonCredits: 16,
        commonHours: 22,
        departmentalCredits: {
            CSM: 4,
            FPM: 4,
            FSEE: 3,
            IWM: 3
        }
    },
    'Level 3 Semester 2': {
        driveId: '1m0EeorXocw9KwH65xQSH3FvV6IRlLeM5',
        commonCredits: 13,
        commonHours: 18,
        departmentalCredits: {
            CSM: 6,
            FPM: 6,
            FSEE: 6,
            IWM: 7
        }
    },
    'Level 4 Semester 1': {
        driveId: '1c0SDGmWSNoozv2SoHTnhlqw1Z9SEh85K',
        commonCredits: 13,
        commonHours: 16,
        departmentalCredits: {
            CSM: 7,
            FPM: 6,
            FSEE: 7,
            IWM: 6
        }
    },
    'Level 4 Semester 2': {
        driveId: '18KZb-anZ4ut-nI3wMVlnrqk2izQ_Dqdx',
        commonCredits: 6,
        commonHours: 6,
        departmentalCredits: {
            CSM: 12,
            FPM: 13,
            FSEE: 13,
            IWM: 13
        },
        internship: 5
    }
};

// Educational Articles Data
const articles = [
    {
        title: "The Future of Agricultural Engineering",
        content: "Explore how technology is transforming agricultural practices and what innovations we can expect in the coming years...",
        category: "Technology",
        readTime: "5 min"
    },
    {
        title: "Sustainable Water Management Techniques",
        content: "Learn about modern techniques for efficient water use in agriculture and their impact on crop yield...",
        category: "Environment",
        readTime: "7 min"
    },
    {
        title: "Career Opportunities in Irrigation Engineering",
        content: "Discover various career paths and opportunities in the field of irrigation and water management...",
        category: "Career",
        readTime: "6 min"
    },
    {
        title: "Climate Change and Agricultural Adaptation",
        content: "Understanding how climate change affects agriculture and adaptive strategies for farmers...",
        category: "Environment",
        readTime: "8 min"
    },
    {
        title: "Digital Tools for Modern Farming",
        content: "A comprehensive guide to digital tools and apps that are revolutionizing farming practices...",
        category: "Technology",
        readTime: "4 min"
    },
    {
        title: "Soil Conservation Methods",
        content: "Essential techniques for maintaining soil health and preventing erosion in agricultural lands...",
        category: "Environment",
        readTime: "6 min"
    }
];

// Music Playlist
const musicPlaylist = [
    {
        name: "Focus Study Music",
        url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
        type: "lofi"
    },
    {
        name: "Classical Concentration",
        url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
        type: "classical"
    },
    {
        name: "Nature Sounds for Study",
        url: "https://www.youtube.com/watch?v=2p3jYy67z10",
        type: "nature"
    },
    {
        name: "Bengali Instrumental",
        url: "https://www.youtube.com/watch?v=K-Qd29V-4Wk",
        type: "instrumental"
    }
];

// Agricultural Motivational Quotes
const agQuotes = [
    { text: "যে মাটিকে ভালোবাসে, প্রকৃতি তাকে কখনই হতাশ করে না।", author: "Unknown" },
    { text: "কৃষকরাই জাতির মেরুদণ্ড – তাদের জ্ঞানই আমাদের ভবিষ্যৎ।", author: "Dr. A. P. J. Abdul Kalam" },
    { text: "ফলন শুধু মাটিতে নয়, কৃষকের মনেও হয়।", author: "Bangladeshi Proverb" },
    { text: "প্রযুক্তি এবং কৃষি—এই দুটির সমন্বয়েই আগামী দিনের সমৃদ্ধি।", author: "Innovator's Creed" },
    { text: "মাটি আমাদের প্রথম শিক্ষক, কৃষি আমাদের চিরন্তন জীবনধারা।", author: "Agricultural Philosopher" },
    { text: "জলের এক ফোঁটাও যেন বৃথা না যায় - সেচ প্রকৌশলের মূলমন্ত্র", author: "Water Management Expert" }
];

// ==================== FIREBASE INITIALIZATION ====================
function initializeFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyAYSVt4WnK7GiqocyBGJ5B0LvBA0AGfsE0",
        authDomain: "aet-website-88e0f.firebaseapp.com",
        projectId: "aet-website-88e0f",
        storageBucket: "aet-website-88e0f.firebasestorage.app",
        messagingSenderId: "1035844272124",
        appId: "1:1035844272124:web:68c1735e0e3e236a727c79"
    };

    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.firestore();
        console.log("✅ Firebase initialized successfully!");
        
        // Start tracking
        trackUserActivity();
        setupRealtimeListeners();
        
    } catch (error) {
        console.error("❌ Firebase initialization failed:", error);
    }
}

// ==================== USER ACTIVITY TRACKING ====================
async function trackUserActivity() {
    if (!db) return;
    
    const userId = getOrCreateGlobalUserId();
    const userAgent = navigator.userAgent;
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    const referrer = document.referrer || 'direct';
    const pageUrl = window.location.href;
    
    try {
        // Track page view
        await db.collection('pageViews').add({
            userId: userId,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: userAgent,
            screenResolution: screenRes,
            referrer: referrer,
            pageUrl: pageUrl
        });
        
        // Update user's last activity
        await db.collection('users').doc(userId).set({
            lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: userAgent,
            screenResolution: screenRes
        }, { merge: true });
        
        // Update active users
        await updateActiveUsers(userId);
        
        console.log("✅ User activity tracked successfully");
        
    } catch (error) {
        console.error("❌ Error tracking user activity:", error);
    }
}

function getOrCreateGlobalUserId() {
    let userId = localStorage.getItem('globalUserId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('globalUserId', userId);
        registerGlobalUser(userId);
    }
    return userId;
}

async function registerGlobalUser(userId) {
    if (!db) return;
    
    try {
        await db.collection('users').doc(userId).set({
            userId: userId,
            firstVisit: firebase.firestore.FieldValue.serverTimestamp(),
            lastVisit: firebase.firestore.FieldValue.serverTimestamp(),
            totalVisits: 1,
            userAgent: navigator.userAgent,
            screenResolution: `${window.screen.width}x${window.screen.height}`
        });
        
        console.log("✅ New global user registered:", userId);
        updateGlobalStats();
        
    } catch (error) {
        console.error("❌ Error registering global user:", error);
    }
}

async function updateActiveUsers(userId) {
    if (!db) return;
    
    try {
        await db.collection('activeUsers').doc(userId).set({
            userId: userId,
            lastActive: firebase.firestore.FieldValue.serverTimestamp(),
            pageUrl: window.location.href
        });
        
        // Clean up inactive users (older than 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const inactiveUsers = await db.collection('activeUsers')
            .where('lastActive', '<', fiveMinutesAgo)
            .get();
            
        inactiveUsers.forEach(async (doc) => {
            await doc.ref.delete();
        });
        
    } catch (error) {
        console.error("❌ Error updating active users:", error);
    }
}

// ==================== REALTIME LISTENERS ====================
function setupRealtimeListeners() {
    if (!db) return;
    
    // Listen for total users count
    db.collection('users').onSnapshot((snapshot) => {
        globalUserStats.totalUsers = snapshot.size;
        updateUserCountsDisplay();
        if (currentUserRole === 'admin') {
            updateAdminPanel();
        }
    });
    
    // Listen for active users
    db.collection('activeUsers').onSnapshot((snapshot) => {
        globalUserStats.activeNow = snapshot.size;
        updateUserCountsDisplay();
        if (currentUserRole === 'admin') {
            updateAdminPanel();
        }
    });
    
    // Listen for today's users
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    db.collection('users')
        .where('firstVisit', '>=', today)
        .onSnapshot((snapshot) => {
            globalUserStats.todayUsers = snapshot.size;
            if (currentUserRole === 'admin') {
                updateAdminPanel();
            }
        });
}

async function updateGlobalStats() {
    if (!db) return;
    
    try {
        const usersSnapshot = await db.collection('users').get();
        globalUserStats.totalUsers = usersSnapshot.size;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySnapshot = await db.collection('users')
            .where('firstVisit', '>=', today)
            .get();
        globalUserStats.todayUsers = todaySnapshot.size;
        
        const activeSnapshot = await db.collection('activeUsers').get();
        globalUserStats.activeNow = activeSnapshot.size;
        
        updateUserCountsDisplay();
        
    } catch (error) {
        console.error("❌ Error updating global stats:", error);
    }
}

function updateUserCountsDisplay() {
    const globalCountEl = document.getElementById('global-user-count');
    const localCountEl = document.getElementById('local-user-count');
    const liveViewersEl = document.getElementById('live-viewers');
    
    if (globalCountEl) {
        globalCountEl.textContent = globalUserStats.totalUsers;
    }
    
    if (localCountEl) {
        localCountEl.textContent = Object.keys(registeredUsers).filter(id => id !== ADMIN_ID).length;
    }
    
    if (liveViewersEl) {
        liveViewersEl.textContent = globalUserStats.activeNow;
    }
}

// ==================== INITIAL ADMIN USER ====================
function initializeAdminUser() {
    if (!registeredUsers[ADMIN_ID]) {
        registeredUsers[ADMIN_ID] = {
            id: ADMIN_ID,
            fullName: "Admin User",
            nickname: "Admin",
            regNo: "ADMIN001",
            college: "System Administration",
            department: "ADMIN",
            email: "admin@eduhub.com",
            password: ADMIN_PASSWORD,
            registrationDate: new Date().toISOString()
        };
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
}

// ==================== WINDOW ONLOAD ====================
window.onload = function () {
    // Initialize Firebase
    initializeFirebase();
    
    // Initialize admin user
    initializeAdminUser();
    
    updateAdminView();
    updateClock();
    displayRandomQuote();
    setupEventListeners();
    
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.username === ADMIN_ID && user.password === ADMIN_PASSWORD) {
            currentUserRole = 'admin';
        } else {
            currentUserRole = 'user';
        }
        currentUserNickname = user.nickname || user.username;
        
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("main-container").classList.remove("hidden");
        setupTypingAnimation();
        updateAdminView();
        
        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || 'night';
        setTheme(savedTheme === 'day');
    } else {
        toggleAuthForm('register');
        setTheme(true); // Day mode for auth screen
    }
    
    // Update global stats every minute
    setInterval(updateGlobalStats, 60000);
};

// ==================== EVENT LISTENERS SETUP ====================
function setupEventListeners() {
    // Theme toggle
    document.getElementById('theme-toggle-btn').addEventListener('click', toggleTheme);
    
    // Department select change
    const regDepartment = document.getElementById('reg-department');
    if (regDepartment) {
        regDepartment.addEventListener('change', function() {
            const otherGroup = document.getElementById('other-department-group');
            if (this.value === 'Others') {
                otherGroup.classList.remove('hidden');
            } else {
                otherGroup.classList.add('hidden');
            }
        });
    }
    
    // About toggle
    const toggleAbout = document.getElementById('toggle-about');
    if (toggleAbout) {
        toggleAbout.addEventListener('click', function() {
            const section = document.getElementById('about-section');
            section.classList.toggle('hidden');
        });
    }
    
    // Mouse trail effect
    document.addEventListener('mousemove', createMouseTrail);
    
    // Close admin panel when clicking outside
    document.addEventListener('click', function(event) {
        const modal = document.getElementById('admin-panel-modal');
        const modalContent = document.querySelector('.modal-content');
        const detailedStatsBtn = document.querySelector('button[onclick="showDetailedStats()"]');
        
        if (modal && !modal.classList.contains('hidden') && 
            !modalContent.contains(event.target) && 
            event.target !== detailedStatsBtn) {
            closeAdminPanel();
        }
    });
    
    // Close admin panel with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAdminPanel();
        }
    });
}

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    isDayMode = !isDayMode;
    setTheme(isDayMode);
}

function setTheme(dayMode) {
    isDayMode = dayMode;
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (!themeBtn) return;
    
    const icon = themeBtn.querySelector('i');
    
    if (dayMode) {
        body.classList.add('day-mode');
        body.classList.remove('night-mode');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> Switch to Night Mode';
        if (icon) icon.className = 'fas fa-moon';
    } else {
        body.classList.add('night-mode');
        body.classList.remove('day-mode');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Switch to Day Mode';
        if (icon) icon.className = 'fas fa-sun';
    }
    
    localStorage.setItem('theme', dayMode ? 'day' : 'night');
}

// ==================== USER MANAGEMENT ====================
function updateCounts() {
    const totalUsers = Object.keys(registeredUsers).length;
    const countDisplay = document.getElementById("user-count-display");
    if (countDisplay) {
        countDisplay.innerText = `Total Users: ${totalUsers}`;
    }
}

function updateAdminView() {
    const adminOnlyButtons = document.querySelectorAll('.admin-only');
    adminOnlyButtons.forEach(btn => {
        btn.style.display = currentUserRole === 'admin' ? 'inline-block' : 'none';
    });
    updateCounts();
}

// ==================== FORM TOGGLE ====================
function toggleAuthForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('registration-form');
    const errorMessage = document.getElementById('error-message');
    
    if (loginForm) loginForm.classList.add('hidden');
    if (registerForm) registerForm.classList.add('hidden');
    if (errorMessage) errorMessage.classList.add('hidden');

    if (formType === 'login') {
        if (loginForm) loginForm.classList.remove('hidden');
        setTheme(false); // Night mode for login
    } else {
        if (registerForm) registerForm.classList.remove('hidden');
        setTheme(true); // Day mode for registration
    }
}

// ==================== REGISTRATION ====================
function register() {
    const id = document.getElementById("reg-id")?.value.trim();
    const fullName = document.getElementById("reg-fullname")?.value.trim();
    const nickname = document.getElementById("reg-nickname")?.value.trim();
    const regNo = document.getElementById("reg-regno")?.value.trim();
    const college = document.getElementById("reg-college")?.value.trim();
    const department = document.getElementById("reg-department")?.value;
    const otherDepartment = document.getElementById("reg-other-department")?.value.trim();
    const email = document.getElementById("reg-email")?.value.trim();
    const password = document.getElementById("reg-password")?.value.trim();
    const confirmPassword = document.getElementById("reg-confirm-password")?.value.trim();
    const hometown = document.getElementById("reg-hometown")?.value.trim();
    const hallName = document.getElementById("reg-hallname")?.value.trim();
    const supervisor = document.getElementById("reg-supervisor")?.value.trim();
    const phone = document.getElementById("reg-phone")?.value.trim();
    const files = document.getElementById("reg-documents")?.files || [];

    // Validation
    if (!id || !fullName || !nickname || !regNo || !college || !department || !password || !confirmPassword) {
        showError("All required fields (*) must be filled!");
        return;
    }
    
    if (!/^\d{7}$/.test(id)) {
        showError("ID must be exactly 7 digits (e.g., 2105056)");
        return;
    }
    
    if (password !== confirmPassword) {
        showError("Passwords do not match!");
        return;
    }
    
    if (files.length > 3) {
        showError("Maximum 3 documents allowed!");
        return;
    }
    
    if (registeredUsers[id] || id === ADMIN_ID) {
        showError("This ID is already registered or reserved!");
        return;
    }

    // Save user locally
    registeredUsers[id] = {
        id,
        fullName,
        nickname,
        regNo,
        college,
        department: department === 'Others' ? otherDepartment : department,
        email,
        password,
        hometown,
        hallName,
        supervisor,
        phone,
        documentCount: files.length,
        registrationDate: new Date().toISOString()
    };

    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('currentUser', JSON.stringify({ 
        username: id, 
        password,
        nickname,
        department: department === 'Others' ? otherDepartment : department
    }));

    // Success
    currentUserRole = 'user';
    currentUserNickname = nickname;
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("main-container").classList.remove("hidden");
    setupTypingAnimation();
    fireConfetti();
    playWelcomeSound();
    showPopup("Registration Successful! Welcome to EduHub.");
    updateAdminView();
    setTheme(false); // Switch to night mode after registration
}

// ==================== LOGIN ====================
function login() {
    const username = document.getElementById("login-username")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    const user = registeredUsers[username];

    if ((username === ADMIN_ID && password === ADMIN_PASSWORD)) {
        currentUserRole = 'admin';
        currentUserNickname = "Admin";
        loginSuccess(username, "Admin");
    } else if (user && user.password === password) {
        currentUserRole = 'user';
        currentUserNickname = user.nickname || user.fullName;
        loginSuccess(username, user.nickname || user.fullName);
    } else {
        showError("Invalid ID or Password!");
    }
}

function loginSuccess(username, nickname) {
    localStorage.setItem('currentUser', JSON.stringify({ 
        username, 
        password: "hidden",
        nickname 
    }));
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("main-container").classList.remove("hidden");
    setupTypingAnimation();
    fireConfetti();
    playWelcomeSound();
    showPopup(`Welcome back, ${nickname}!`);
    updateAdminView();
    setTheme(false); // Switch to night mode after login
}

// ==================== LOGOUT ====================
function logout() {
    localStorage.removeItem('currentUser');
    currentUserRole = 'user';
    currentUserNickname = '';
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("main-container").classList.add("hidden");
    toggleAuthForm('login');
    updateAdminView();
    if (isMusicPlaying && audioElement) {
        audioElement.pause();
        isMusicPlaying = false;
    }
}

// ==================== CONTENT DISPLAY ====================
function showContent(type) {
    const content = document.getElementById("content");
    if (!content) return;
    
    switch(type) {
        case 'courses':
            displayCourses();
            break;
        case 'articles':
            displayArticles();
            break;
        case 'diary':
            displayDiary();
            break;
        case 'music':
            displayMusicPlayer();
            break;
        case 'movies':
            displayMovies();
            break;
        default:
            content.innerHTML = `
                <div class="welcome-section">
                    <h2>Welcome to EduHub, ${currentUserNickname}!</h2>
                    <p>Select a section from the navigation menu to get started with your educational journey.</p>
                </div>`;
    }
}

function displayCourses() {
    const content = document.getElementById("content");
    if (!content) return;
    
    const userDepartment = getUserDepartment();
    
    let html = `
        <h2 style="color:#ff7eb3; margin-bottom: 20px;">
            <i class="fas fa-graduation-cap"></i> Course Selection
        </h2>
        <p style="margin-bottom: 30px; color: rgba(255,255,255,0.8);">
            Access course materials for each semester. Click on a semester to open Google Drive materials.
        </p>`;
    
    if (userDepartment) {
        html += `
            <div style="background: rgba(255,126,179,0.1); padding: 15px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #ff7eb3;">
                <h4 style="color:#ffd700; margin-bottom: 5px;">Your Department: ${userDepartment}</h4>
                <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Credits are displayed based on your department</p>
            </div>`;
    }
    
    html += `<div class="course-container">`;
    
    for (const [semester, data] of Object.entries(courses)) {
        html += `
            <div class="course-card" onclick="openDrive('${data.driveId}', '${semester}')">
                <h3>${semester}</h3>
                <div style="margin: 15px 0; text-align: left;">`;
        
        // Display common credits for all semesters
        html += `
                    <div style="margin-bottom: 10px;">
                        <strong>Common Courses:</strong><br>
                        <span style="color: #00ffc8;">${data.commonCredits} Credits</span> 
                        <span style="color: rgba(255,255,255,0.6);">(${data.commonHours} Contact Hours)</span>
                    </div>`;
        
        // Display departmental credits for Level 3 and 4 semesters
        if (data.departmentalCredits) {
            if (userDepartment && data.departmentalCredits[userDepartment]) {
                const deptCredits = data.departmentalCredits[userDepartment];
                const totalCredits = data.commonCredits + deptCredits;
                
                html += `
                    <div style="margin-bottom: 10px;">
                        <strong>${userDepartment} Departmental:</strong><br>
                        <span style="color: #ff7eb3;">+${deptCredits} Credits</span>
                    </div>
                    <div style="background: rgba(0,198,255,0.1); padding: 8px; border-radius: 5px; margin-top: 5px;">
                        <strong>Total for ${userDepartment}:</strong> 
                        <span style="color: #ffd700; font-size: 1.1em;">${totalCredits} Credits</span>
                    </div>`;
            } else {
                // Show all department options if user department not found
                html += `<div><strong>Departmental Credits:</strong>`;
                for (const [dept, deptCredits] of Object.entries(data.departmentalCredits)) {
                    const total = data.commonCredits + deptCredits;
                    html += `<br><span style="color: rgba(255,255,255,0.7);">${dept}: ${total} Credits</span>`;
                }
                html += `</div>`;
            }
        }
        
        // Display internship for Level 4 Semester 2
        if (data.internship) {
            html += `
                <div style="margin-top: 10px; padding: 5px; background: rgba(39,174,96,0.2); border-radius: 5px;">
                    <strong>Internship:</strong> 
                    <span style="color: #27ae60;">${data.internship} Credits</span>
                </div>`;
        }
        
        html += `
                </div>
                <button class="eye-catchy-btn small-btn" style="margin-top: 10px;">
                    <i class="fas fa-external-link-alt"></i> Open Materials
                </button>
            </div>`;
    }
    
    html += `</div>`;
    content.innerHTML = html;
}

function openDrive(folderId, semesterName) {
    window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank');
    showPopup(`Opening ${semesterName} materials in Google Drive...`);
}

// Get current user's department from localStorage
function getUserDepartment() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userData = registeredUsers[currentUser.username];
    return userData ? userData.department : null;
}

function displayArticles() {
    const content = document.getElementById("content");
    if (!content) return;
    
    let html = `
        <h2 style="color:#ff7eb3; margin-bottom: 20px;">
            <i class="fas fa-newspaper"></i> Educational Articles
        </h2>
        <p style="margin-bottom: 30px; color: rgba(255,255,255,0.8);">
            Read educational articles on various topics related to agricultural engineering and technology.
        </p>
        <div class="articles-grid">`;
    
    articles.forEach(article => {
        html += `
            <div class="article-card">
                <span class="article-category" style="background: ${getCategoryColor(article.category)}; 
                    padding: 3px 8px; border-radius: 4px; font-size: 12px; margin-bottom: 10px; display: inline-block;">
                    ${article.category}
                </span>
                <h3>${article.title}</h3>
                <p>${article.content}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span style="color: #ff7eb3; font-size: 14px;">
                        <i class="far fa-clock"></i> ${article.readTime} read
                    </span>
                    <button onclick="readArticle('${article.title}')" class="eye-catchy-btn small-btn">
                        Read More <i class="fas fa-book-open"></i>
                    </button>
                </div>
            </div>`;
    });
    
    html += `</div>`;
    content.innerHTML = html;
}

function getCategoryColor(category) {
    const colors = {
        'Technology': '#3498db',
        'Environment': '#27ae60',
        'Career': '#9b59b6',
        'Research': '#e74c3c'
    };
    return colors[category] || '#95a5a6';
}

function readArticle(title) {
    const article = articles.find(a => a.title === title);
    if (article) {
        const content = document.getElementById("content");
        if (!content) return;
        
        content.innerHTML = `
            <div style="text-align: left; max-width: 800px; margin: 0 auto;">
                <button onclick="displayArticles()" class="eye-catchy-btn small-btn" style="margin-bottom: 20px;">
                    <i class="fas fa-arrow-left"></i> Back to Articles
                </button>
                <h1 style="color:#ff7eb3; margin-bottom: 20px;">${article.title}</h1>
                <div style="display: flex; gap: 20px; margin-bottom: 20px; color: rgba(255,255,255,0.7);">
                    <span><i class="fas fa-tag"></i> ${article.category}</span>
                    <span><i class="far fa-clock"></i> ${article.readTime} read</span>
                </div>
                <div style="background: rgba(255,255,255,0.05); padding: 30px; border-radius: 10px; line-height: 1.8;">
                    <p>${article.content}</p>
                    <p style="margin-top: 20px;">This is a sample article content. In a real application, this would contain the full article text with images, diagrams, and detailed information about the topic.</p>
                </div>
                <div style="margin-top: 30px; padding: 20px; background: rgba(255,126,179,0.1); border-radius: 10px;">
                    <h3 style="color:#ff7eb3;">Key Takeaways</h3>
                    <ul style="margin-top: 10px; padding-left: 20px;">
                        <li>Important point 1 about ${article.category.toLowerCase()}</li>
                        <li>Key insight 2 related to the topic</li>
                        <li>Practical application 3 for students</li>
                    </ul>
                </div>
            </div>`;
    }
}

function displayDiary() {
    const content = document.getElementById("content");
    if (!content) return;
    
    content.innerHTML = `
        <div class="diary-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-book"></i> Study Diary
            </h2>
            <p style="margin-bottom: 30px; color: rgba(255,255,255,0.8);">
                Keep track of your study progress, notes, and important points here.
            </p>
            <textarea id="user-diary" class="diary-area" 
                placeholder="Write your study notes here... You can include:
• Today's learning objectives
• Key concepts learned
• Problems solved
• Questions to ask
• Tomorrow's study plan"></textarea>
            <div class="diary-controls">
                <button id="save-diary-btn" class="eye-catchy-btn">
                    <i class="fas fa-save"></i> Save Note
                </button>
                <button id="clear-diary-btn" class="eye-catchy-btn" style="background: linear-gradient(45deg, #e74c3c, #c0392b);">
                    <i class="fas fa-trash"></i> Clear Note
                </button>
            </div>
            <p id="diary-status" style="margin-top: 15px; color: #00ffc8; font-weight: bold;"></p>
        </div>`;
    
    // Load saved diary content
    const savedNote = localStorage.getItem('userDiaryNote');
    if (savedNote) {
        const diaryArea = document.getElementById('user-diary');
        if (diaryArea) diaryArea.value = savedNote;
    }
    
    // Setup diary event listeners
    setupDiaryListeners();
}

function setupDiaryListeners() {
    const saveBtn = document.getElementById('save-diary-btn');
    const clearBtn = document.getElementById('clear-diary-btn');
    const diaryArea = document.getElementById('user-diary');
    const statusText = document.getElementById('diary-status');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const note = diaryArea ? diaryArea.value : '';
            localStorage.setItem('userDiaryNote', note);
            if (statusText) {
                statusText.textContent = '✓ Note saved successfully!';
                setTimeout(() => {
                    statusText.textContent = '';
                }, 3000);
            }
        });
    }
    
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your diary? This action cannot be undone.')) {
                if (diaryArea) diaryArea.value = '';
                localStorage.removeItem('userDiaryNote');
                if (statusText) {
                    statusText.textContent = '✗ Diary cleared successfully!';
                    setTimeout(() => {
                        statusText.textContent = '';
                    }, 3000);
                }
            }
        });
    }
}

// ==================== MUSIC PLAYER ====================
function displayMusicPlayer() {
    const content = document.getElementById("content");
    if (!content) return;
    
    const currentMusic = musicPlaylist[currentTrack];
    
    content.innerHTML = `
        <div class="music-player-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-music"></i> Study Music Player
            </h2>
            <p style="margin-bottom: 30px; color: rgba(255,255,255,0.8);">
                Listen to relaxing music while you study. Music can help improve concentration and focus.
            </p>
            
            <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color:#ffd700; margin-bottom: 15px;" id="current-track-title">${currentMusic.name}</h3>
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 15px;">
                    <button onclick="playPreviousTrack()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button onclick="toggleMusicPlay()" class="eye-catchy-btn" id="play-music-btn">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button onclick="playNextTrack()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-step-forward"></i>
                    </button>
                </div>
                
                <div style="margin-top: 20px;">
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 10px;">Quick Access:</p>
                    <button onclick="openYouTubeLink('${currentMusic.url}')" class="eye-catchy-btn small-btn">
                        <i class="fab fa-youtube"></i> Open on YouTube
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 30px;">
                <h3 style="color:#ffd700; margin-bottom: 15px;">Study Music Playlist</h3>
                <div class="music-playlist">
                    ${musicPlaylist.map((music, index) => `
                        <div class="playlist-item ${index === currentTrack ? 'active' : ''}" 
                             onclick="selectTrack(${index})">
                            <i class="fas ${index === currentTrack ? 'fa-volume-up' : 'fa-music'}"></i>
                            <h4>${music.name}</h4>
                            <small>${music.type}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="margin-top: 30px; background: rgba(255,126,179,0.1); padding: 15px; border-radius: 10px;">
                <h4 style="color:#ff7eb3;"><i class="fas fa-headphones"></i> Listening Tips</h4>
                <ul style="text-align: left; color: rgba(255,255,255,0.8); margin-top: 10px; padding-left: 20px;">
                    <li>Use headphones for better concentration</li>
                    <li>Adjust volume to a comfortable level</li>
                    <li>Try different playlists to find what works best for you</li>
                    <li>Take breaks every 45-60 minutes</li>
                </ul>
            </div>
        </div>`;
    
    updateMusicButton();
}

function toggleMusicPlay() {
    if (isMusicPlaying && audioElement) {
        audioElement.pause();
        isMusicPlaying = false;
    } else {
        // Open YouTube link instead of trying to play audio directly
        openYouTubeLink(musicPlaylist[currentTrack].url);
        showPopup(`Opening "${musicPlaylist[currentTrack].name}" on YouTube...`);
        isMusicPlaying = true;
    }
    updateMusicButton();
}

function updateMusicButton() {
    const playBtn = document.getElementById('play-music-btn');
    if (playBtn) {
        playBtn.innerHTML = isMusicPlaying ? 
            '<i class="fas fa-pause"></i> Pause' : 
            '<i class="fas fa-play"></i> Play';
    }
    
    const trackTitle = document.getElementById('current-track-title');
    if (trackTitle) {
        trackTitle.textContent = musicPlaylist[currentTrack].name;
    }
}

function selectTrack(index) {
    currentTrack = index;
    isMusicPlaying = false;
    
    // Update UI
    updateMusicButton();
    highlightCurrentTrack();
    
    // Update the content to show selected track
    const trackTitle = document.getElementById('current-track-title');
    if (trackTitle) {
        trackTitle.textContent = musicPlaylist[currentTrack].name;
    }
}

function playNextTrack() {
    currentTrack = (currentTrack + 1) % musicPlaylist.length;
    isMusicPlaying = false;
    selectTrack(currentTrack);
}

function playPreviousTrack() {
    currentTrack = (currentTrack - 1 + musicPlaylist.length) % musicPlaylist.length;
    isMusicPlaying = false;
    selectTrack(currentTrack);
}

function highlightCurrentTrack() {
    document.querySelectorAll('.playlist-item').forEach((item, index) => {
        item.classList.toggle('active', index === currentTrack);
        const icon = item.querySelector('i');
        if (icon) {
            icon.className = index === currentTrack ? 'fas fa-volume-up' : 'fas fa-music';
        }
    });
}

function openYouTubeLink(url) {
    window.open(url, '_blank');
}

function displayMovies() {
    const content = document.getElementById("content");
    if (!content) return;
    
    content.innerHTML = `
        <div style="text-align: center;">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-film"></i> Educational Movies & Documentaries
            </h2>
            <p style="margin-bottom: 30px; color: rgba(255,255,255,0.8);">
                Watch educational content related to agricultural engineering and technology.
            </p>
            
            <div class="movies-search">
                <input type="text" id="movie-name" class="movie-input" 
                       placeholder="Search for educational content...">
                <button onclick="submitMovieRequest()" class="eye-catchy-btn">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>
            
            <div style="margin-top: 40px;">
                <h3 style="color:#ffd700; margin-bottom: 20px;">Recommended Documentaries</h3>
                <div class="course-container">
                    <div class="course-card" onclick="watchContent('agriculture')">
                        <i class="fas fa-tractor" style="font-size: 2rem; color: #27ae60; margin-bottom: 10px;"></i>
                        <h3>Modern Agriculture</h3>
                        <p>Documentary on modern farming techniques</p>
                    </div>
                    <div class="course-card" onclick="watchContent('water')">
                        <i class="fas fa-tint" style="font-size: 2rem; color: #3498db; margin-bottom: 10px;"></i>
                        <h3>Water Management</h3>
                        <p>Global water conservation methods</p>
                    </div>
                    <div class="course-card" onclick="watchContent('climate')">
                        <i class="fas fa-cloud-sun" style="font-size: 2rem; color: #e74c3c; margin-bottom: 10px;"></i>
                        <h3>Climate Change</h3>
                        <p>Impact of climate on agriculture</p>
                    </div>
                </div>
            </div>
            
            <div class="movies-list">
                <h3 style="color:#ffd700; margin-bottom: 20px;">Top Educational Films</h3>
                <ol>
                    <li>The Biggest Little Farm</li>
                    <li>Food, Inc.</li>
                    <li>Kiss the Ground</li>
                    <li>The River and the Wall</li>
                    <li>Sustainable</li>
                    <li>Seed: The Untold Story</li>
                    <li>The Harvest</li>
                    <li>Farmland</li>
                    <li>Living Soil</li>
                    <li>The Future of Food</li>
                </ol>
            </div>
        </div>`;
}

function submitMovieRequest() {
    const movieName = document.getElementById("movie-name")?.value.trim();
    if (movieName) {
        const subject = "Educational Content Request";
        const body = `I would like to request educational content about: ${movieName}`;
        window.location.href = `mailto:deboneel1998@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showPopup("Request sent! We'll notify you when content is available.");
    } else {
        alert("Please enter what you're looking for!");
    }
}

function watchContent(type) {
    const videos = {
        'agriculture': 'dCvW9Lq3k6I',
        'water': 'B48hJSQ7WUI',
        'climate': 'G4H1N_yXBiA'
    };
    
    if (videos[type]) {
        const content = document.getElementById("content");
        if (!content) return;
        
        content.innerHTML = `
            <div style="text-align: left;">
                <button onclick="displayMovies()" class="eye-catchy-btn small-btn" style="margin-bottom: 20px;">
                    <i class="fas fa-arrow-left"></i> Back to Movies
                </button>
                <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 10px;">
                    <iframe src="https://www.youtube.com/embed/${videos[type]}?autoplay=1" 
                            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                    </iframe>
                </div>
            </div>`;
    }
}

// ==================== USER LIST DISPLAY ====================
function showUserList() {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }

    const content = document.getElementById("content");
    if (!content) return;
    
    const users = Object.values(registeredUsers);

    let html = `<h2 style="color:#ff7eb3; margin-bottom: 20px;">Registered Users (${users.length})</h2>`;
    if (users.length === 0) {
        content.innerHTML = html + "<p style='color: rgba(255,255,255,0.6);'>No users registered yet.</p>";
        return;
    }

    html += `<div style="overflow-x: auto;">
        <table style="width:100%; border-collapse:collapse; margin-top:15px; background: rgba(0,0,0,0.3);">
            <thead>
                <tr style="background:rgba(255,255,255,0.1)">
                    <th style="padding:12px; text-align:left;">ID</th>
                    <th style="padding:12px; text-align:left;">Name</th>
                    <th style="padding:12px; text-align:left;">Nickname</th>
                    <th style="padding:12px; text-align:left;">College</th>
                    <th style="padding:12px; text-align:left;">Department</th>
                    <th style="padding:12px; text-align:left;">Registration Date</th>
                </tr>
            </thead>
            <tbody>`;

    users.forEach(u => {
        if (u.id !== ADMIN_ID) { // Don't show admin in user list
            html += `<tr style="border-bottom:1px solid rgba(255,255,255,0.1)">
                <td style="padding:12px;">${u.id}</td>
                <td style="padding:12px;">${u.fullName}</td>
                <td style="padding:12px;">${u.nickname || '-'}</td>
                <td style="padding:12px;">${u.college}</td>
                <td style="padding:12px;">${u.department}</td>
                <td style="padding:12px;">${new Date(u.registrationDate).toLocaleDateString()}</td>
            </tr>`;
        }
    });
    html += `</tbody></table></div>`;
    content.innerHTML = html;
}

// ==================== ADMIN PANEL FUNCTIONS ====================
function showDetailedStats() {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }
    
    const modal = document.getElementById('admin-panel-modal');
    if (!modal) {
        console.error("Admin panel modal not found!");
        return;
    }
    
    modal.classList.remove('hidden');
    modal.style.display = 'block';
    
    // Add active class for animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    updateAdminPanel();
}

function closeAdminPanel() {
    const modal = document.getElementById('admin-panel-modal');
    if (!modal) return;
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.style.display = 'none';
    }, 300);
}

async function updateAdminPanel() {
    if (!db) {
        console.log("Firebase not initialized");
        return;
    }
    
    try {
        // Update basic stats
        const globalCountEl = document.getElementById('admin-global-count');
        const localCountEl = document.getElementById('admin-local-count');
        const activeNowEl = document.getElementById('admin-active-now');
        const todayCountEl = document.getElementById('admin-today-count');
        
        if (globalCountEl) {
            globalCountEl.textContent = globalUserStats.totalUsers;
        }
        if (localCountEl) {
            localCountEl.textContent = Object.keys(registeredUsers).filter(id => id !== ADMIN_ID).length;
        }
        if (activeNowEl) {
            activeNowEl.textContent = globalUserStats.activeNow;
        }
        if (todayCountEl) {
            todayCountEl.textContent = globalUserStats.todayUsers;
        }
        
        // Get recent global users
        const usersSnapshot = await db.collection('users')
            .orderBy('firstVisit', 'desc')
            .limit(10)
            .get();
        
        const recentUsersList = document.getElementById('recent-users-list');
        if (recentUsersList) {
            recentUsersList.innerHTML = '';
            
            if (usersSnapshot.empty) {
                recentUsersList.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 20px;">No global users yet</p>';
            } else {
                usersSnapshot.forEach((doc) => {
                    const user = doc.data();
                    const userEl = document.createElement('div');
                    userEl.className = 'recent-user-item';
                    userEl.innerHTML = `
                        <div class="user-avatar">
                            <i class="fas fa-user-circle"></i>
                        </div>
                        <div class="user-info">
                            <div class="user-id">${user.userId.substring(0, 12)}...</div>
                            <div class="user-time">${formatFirestoreDate(user.firstVisit)}</div>
                        </div>
                    `;
                    recentUsersList.appendChild(userEl);
                });
            }
        }
        
        // Update chart
        updateUserGrowthChart();
        
    } catch (error) {
        console.error("Error updating admin panel:", error);
    }
}

function formatFirestoreDate(timestamp) {
    if (!timestamp) return 'N/A';
    try {
        const date = timestamp.toDate();
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    } catch {
        return 'N/A';
    }
}

function updateUserGrowthChart() {
    const ctx = document.getElementById('user-growth-chart');
    if (!ctx) {
        console.log("Chart canvas not found");
        return;
    }
    
    // Destroy existing chart
    if (userChart) {
        userChart.destroy();
    }
    
    // Create new chart
    userChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: generateLast7Days(),
            datasets: [{
                label: 'User Growth',
                data: generateGrowthData(),
                borderColor: '#ff7eb3',
                backgroundColor: 'rgba(255, 126, 179, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00ffc8',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#ff7eb3',
                    bodyColor: '#fff',
                    borderColor: '#ff7eb3',
                    borderWidth: 1
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: 'rgba(255,255,255,0.7)'
                    },
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    }
                }
            }
        }
    });
}

function generateLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
}

function generateGrowthData() {
    // Simulate growth data - in real app, fetch from Firebase
    const base = globalUserStats.totalUsers;
    return [
        Math.max(0, base - 30),
        Math.max(0, base - 25),
        Math.max(0, base - 20),
        Math.max(0, base - 15),
        Math.max(0, base - 10),
        Math.max(0, base - 5),
        base
    ];
}

async function exportUserData() {
    if (!db) {
        showPopup("Firebase not initialized!");
        return;
    }
    
    try {
        const usersSnapshot = await db.collection('users').get();
        const users = [];
        
        usersSnapshot.forEach((doc) => {
            const user = doc.data();
            users.push({
                UserID: user.userId,
                FirstVisit: formatFirestoreDate(user.firstVisit),
                LastVisit: formatFirestoreDate(user.lastVisit),
                UserAgent: user.userAgent || 'N/A',
                ScreenResolution: user.screenResolution || 'N/A'
            });
        });
        
        if (users.length === 0) {
            showPopup("No global users to export!");
            return;
        }
        
        // Convert to CSV
        const csvContent = [
            ['UserID', 'FirstVisit', 'LastVisit', 'UserAgent', 'ScreenResolution'],
            ...users.map(u => [u.UserID, u.FirstVisit, u.LastVisit, u.UserAgent, u.ScreenResolution])
        ].map(row => row.join(',')).join('\n');
        
        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eduhub-global-users-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showPopup('Global user data exported successfully!');
    } catch (error) {
        console.error("Error exporting data:", error);
        showPopup('Error exporting data');
    }
}

function exportLocalData() {
    const users = Object.values(registeredUsers).filter(u => u.id !== ADMIN_ID);
    
    if (users.length === 0) {
        showPopup('No local users to export!');
        return;
    }
    
    const csvContent = [
        ['ID', 'FullName', 'Nickname', 'RegistrationNo', 'College', 'Department', 'Email', 'RegistrationDate'],
        ...users.map(u => [u.id, u.fullName, u.nickname, u.regNo, u.college, u.department, u.email, u.registrationDate])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eduhub-local-users-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showPopup('Local user data exported successfully!');
}

function refreshStats() {
    updateGlobalStats();
    if (userChart) {
        userChart.destroy();
        userChart = null;
    }
    updateUserGrowthChart();
    showPopup('Statistics refreshed!');
}

function showPopup(msg) {
    const popup = document.getElementById("popup");
    if (!popup) return;
    
    const newMsg = `🎉 ${msg} 🚀`;
    const h3 = popup.querySelector('h3');
    if (h3) h3.textContent = newMsg;
    
    popup.style.display = "block";
    popup.style.transform = "translate(-50%, -50%) scale(1)";
    
    setTimeout(() => {
        popup.style.transform = "translate(-50%, -50%) scale(0)";
        setTimeout(() => popup.style.display = "none", 500);
    }, 4000);
}

function showError(msg) {
    const el = document.getElementById("error-message");
    if (!el) return;
    
    el.textContent = msg;
    el.classList.remove("hidden");
    setTimeout(() => {
        el.classList.add("hidden");
    }, 5000);
}

function closePopup() {
    const popup = document.getElementById("popup");
    if (popup) {
        popup.style.display = "none";
    }
}

function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 8);
    const date = now.toLocaleDateString('en-GB', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        clockElement.innerHTML = `
            <div style="font-size: 12px; color: #ff7eb3;">${date}</div>
            <div style="font-size: 20px; font-weight: bold;">${time}</div>
        `;
    }
}
setInterval(updateClock, 1000);

function setupTypingAnimation() {
    const text = `Welcome, ${currentUserNickname}! Ready to learn? ✨`;
    const typingElement = document.getElementById('typing-effect');
    if (!typingElement) return;
    
    typingElement.textContent = '';
    let i = 0;
    const speed = 75;

    function typeWriter() {
        if (i < text.length) {
            typingElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, speed);
        }
    }
    typeWriter();
}

function createMouseTrail(e) {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.left = e.pageX - 4 + 'px';
    trail.style.top = e.pageY - 4 + 'px';
    document.body.appendChild(trail);

    setTimeout(() => {
        trail.remove();
    }, 500);
}

function fireConfetti() {
    if (typeof confetti !== 'undefined') {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * agQuotes.length);
    const quote = agQuotes[randomIndex];
    const quoteTextEl = document.getElementById('quote-text');
    const quoteAuthorEl = document.getElementById('quote-author');
    
    if (quoteTextEl && quoteAuthorEl) {
        quoteTextEl.textContent = quote.text;
        quoteAuthorEl.textContent = '— ' + quote.author;
    }
}

function playWelcomeSound() {
    const welcomeAudio = document.getElementById('welcome-chime');
    if (welcomeAudio) {
        welcomeAudio.play().catch(e => console.log("Welcome sound blocked: ", e));
    }
}

function showInstructions() {
    let msg = "📚 EduHub - Educational Platform\n\n";
    msg += "1. COURSE SELECTION: Browse and enroll in courses from different semesters\n";
    msg += "2. ARTICLES: Read educational articles on various topics\n";
    msg += "3. STUDY DIARY: Keep track of your study notes and progress\n";
    msg += "4. MUSIC PLAYER: Listen to study music for better concentration\n";
    msg += "5. MOVIES: Watch educational documentaries and films\n\n";
    msg += "Use the Day/Night toggle button to switch themes\n";
    
    if (currentUserRole === 'admin') {
        msg += "\n🔧 ADMIN FEATURES:\n";
        msg += "- View global user statistics\n";
        msg += "- Track live active users\n";
        msg += "- Monitor user growth with charts\n";
        msg += "- Export global and local user data\n";
    }
    
    alert(msg);
}

// Nebula Movement
const nebula = document.getElementById('nebulaLight');
let idx = 0;
const corners = [
    { top: 50, left: 50 },
    { top: 50, left: window.innerWidth - 170 },
    { top: window.innerHeight - 170, left: window.innerWidth - 170 },
    { top: window.innerHeight - 170, left: 50 }
];

function moveNebula() {
    const pos = corners[idx];
    if (nebula) {
        nebula.style.top = pos.top + 'px';
        nebula.style.left = pos.left + 'px';
    }
    idx = (idx + 1) % 4;
    setTimeout(moveNebula, 5000);
}

// Initialize nebula movement after page loads
window.addEventListener('load', () => {
    moveNebula();
});

window.addEventListener('resize', () => {
    corners[1].left = window.innerWidth - 170;
    corners[2].left = window.innerWidth - 170;
});

// Clean up when page is closed
window.addEventListener('beforeunload', () => {
    const userId = localStorage.getItem('globalUserId');
    if (userId && db) {
        // Remove from active users
        db.collection('activeUsers').doc(userId).delete().catch(() => {});
    }
});

// REAL Email Recovery
async function resetPassword() {
    const userId = prompt("Enter your 7-digit ID:");
    if (!userId || userId.length !== 7) {
        alert("Please enter a valid 7-digit ID.");
        return;
    }
    
    const email = prompt("Enter your registered email address:");
    if (!email) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/send-recovery-email`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: userId, email: email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ ${result.message}\n\n${result.note || ''}\n\nYour password will be sent to your email.`);
        } else {
            alert(`❌ ${result.error}\n\nPlease check your details and try again.`);
        }
    } catch (error) {
        alert("⚠️ Server error. Please try again later or contact administrator.");
    }
    
    backToLogin();
}

// Real Password Recovery Functions
async function recoverUserId() {
    const email = prompt("Enter your registered email address:");
    if (!email) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/find-id`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ ${result.message}\n\nPlease check your email inbox and spam folder.`);
        } else {
            alert(`❌ ${result.error}\n\nPlease make sure you entered the correct email.`);
        }
    } catch (error) {
        alert(`⚠️ Connection error. Please try again later or contact administrator:\ndeboneel1998@gmail.com`);
    }
    
    backToLogin();
}

async function resetPassword() {
    const userId = prompt("Enter your 7-digit ID:");
    if (!userId || userId.length !== 7) {
        alert("Please enter a valid 7-digit ID.");
        return;
    }
    
    const email = prompt("Enter your registered email address:");
    if (!email) return;
    
    try {
        const response = await fetch(`${BACKEND_URL}/recover-password`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: userId, email: email })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert(`✅ ${result.message}\n\n${result.note || ''}\n\nYou will receive a temporary password by email.`);
        } else {
            alert(`❌ ${result.error}\n\nPlease check your details and try again.`);
        }
    } catch (error) {
        alert(`⚠️ Server error. Please try again later or contact:\ndeboneel1998@gmail.com`);
    }
    
    backToLogin();
}

function contactAdminForRecovery() {
    const subject = "Urgent: EduHub Account Recovery Request";
    const body = `Hello Administrator,\n\nI need help recovering my EduHub account.\n\nMy details:\n1. Full name: \n2. Registration number: \n3. College name: \n4. Department: \n5. Email: \n\nThank you!\n\n(Please reply to this email with assistance)`;
    
    window.location.href = `mailto:deboneel1998@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    showPopup("Opening email client to contact administrator...");
    backToLogin();
}