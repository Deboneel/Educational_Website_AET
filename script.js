// ==================== ADMIN CREDENTIALS ====================
const ADMIN_ID = "2105056";
const ADMIN_PASSWORD = "sotorupa72";

// ==================== GLOBAL VARIABLES ====================
let registeredUsers = {};
let currentUserRole = 'user';
let currentUserNickname = '';
let isDayMode = false;
let db = null;
let deptChart = null;
let regChart = null;

// Global user statistics
let userStats = {
    totalUsers: 0,
    activeUsers: 0,
    todayUsers: 0,
    departments: {},
    registrationHistory: {}
};

// Educational Courses Data
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
    }
];

// Agricultural Motivational Quotes
const agQuotes = [
    { text: "যে মাটিকে ভালোবাসে, প্রকৃতি তাকে কখনই হতাশ করে না।", author: "Unknown" },
    { text: "কৃষকরাই জাতির মেরুদণ্ড – তাদের জ্ঞানই আমাদের ভবিষ্যৎ।", author: "Dr. A. P. J. Abdul Kalam" },
    { text: "ফলন শুধু মাটিতে নয়, কৃষকের মনেও হয়।", author: "Bangladeshi Proverb" }
];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize Firebase
    initializeFirebase();
    
    // Load users from localStorage first for faster startup
    registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    
    // Initialize admin user if not exists
    await initializeAdminUser();
    
    // Load users from Firebase in background
    setTimeout(() => {
        loadAllUsersFromFirebase();
    }, 1000);
    
    // Initialize UI
    updateClock();
    displayRandomQuote();
    setupEventListeners();
    
    // Initialize registration history
    initRegistrationHistory();
    
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.username === ADMIN_ID) {
            currentUserRole = 'admin';
            currentUserNickname = "Admin";
        } else {
            currentUserRole = 'user';
            currentUserNickname = user.nickname || user.username;
            
            // Update user activity
            if (user.username !== ADMIN_ID) {
                await updateUserLoginActivity(user.username);
            }
        }
        
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("main-container").classList.remove("hidden");
        setupTypingAnimation();
        updateAdminView();
        updateUserStatsDisplay();
        
        // Set theme
        const savedTheme = localStorage.getItem('theme') || 'night';
        setTheme(savedTheme === 'day');
    }
    
    // Update stats periodically
    setInterval(updateUserStatsDisplay, 60000);
    
    // Update clock every second
    setInterval(updateClock, 1000);
});

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
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        db = firebase.firestore();
        console.log("✅ Firebase initialized successfully!");
        
    } catch (error) {
        console.error("❌ Firebase initialization failed:", error);
    }
}

// ==================== LOAD ALL USERS ====================
async function loadAllUsersFromFirebase() {
    try {
        if (!db) return;
        
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();
        
        registeredUsers = {};
        snapshot.forEach(doc => {
            registeredUsers[doc.id] = doc.data();
        });
        
        // Save to localStorage
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        console.log("✅ Loaded users from Firebase:", Object.keys(registeredUsers).length);
        
        // Update statistics after loading
        updateUserStatsDisplay();
        
    } catch (error) {
        console.error("❌ Error loading users:", error);
    }
}

// ==================== INITIALIZE ADMIN USER ====================
async function initializeAdminUser() {
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
            registrationDate: new Date().toISOString(),
            role: "admin",
            isAdmin: true,
            isActive: false,
            lastLogin: null,
            loginCount: 0
        };
        
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        if (db) {
            try {
                await db.collection('users').doc(ADMIN_ID).set(registeredUsers[ADMIN_ID]);
                console.log("✅ Admin user saved to Firebase");
            } catch (error) {
                console.error("❌ Error saving admin to Firebase:", error);
            }
        }
    }
}

// ==================== REGISTRATION HISTORY ====================
function initRegistrationHistory() {
    const today = new Date();
    const dates = [];
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(dateStr);
        if (!userStats.registrationHistory[dateStr]) {
            userStats.registrationHistory[dateStr] = 0;
        }
    }
    
    // Count registrations for each date
    Object.values(registeredUsers).forEach(user => {
        if (!user.isAdmin && user.registrationDate) {
            const regDate = new Date(user.registrationDate).toISOString().split('T')[0];
            if (userStats.registrationHistory[regDate] !== undefined) {
                userStats.registrationHistory[regDate]++;
            }
        }
    });
    
    return dates;
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
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
    
    // Close modals on outside click
    document.addEventListener('click', function(event) {
        const userModal = document.getElementById('user-details-modal');
        if (userModal && !userModal.contains(event.target) && !userModal.classList.contains('hidden')) {
            closeUserDetails();
        }
        
        const adminModal = document.getElementById('admin-panel-modal');
        if (adminModal && !adminModal.contains(event.target) && !adminModal.classList.contains('hidden')) {
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
    
    if (dayMode) {
        body.classList.add('day-mode');
        themeBtn.innerHTML = '<i class="fas fa-moon"></i> Switch to Night Mode';
    } else {
        body.classList.remove('day-mode');
        themeBtn.innerHTML = '<i class="fas fa-sun"></i> Switch to Day Mode';
    }
    
    localStorage.setItem('theme', dayMode ? 'day' : 'night');
}

// ==================== FORM TOGGLE ====================
function toggleAuthForm(formType) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('registration-form');
    const forgotForm = document.getElementById('forgot-form');
    const errorMessage = document.getElementById('error-message');
    
    [loginForm, registerForm, forgotForm, errorMessage].forEach(el => {
        if (el) el.classList.add('hidden');
    });

    if (formType === 'login') {
        if (loginForm) loginForm.classList.remove('hidden');
        setTheme(false);
    } else if (formType === 'register') {
        if (registerForm) registerForm.classList.remove('hidden');
        setTheme(true);
    } else if (formType === 'forgot') {
        if (forgotForm) forgotForm.classList.remove('hidden');
    }
}

// ==================== FORGOT PASSWORD ====================
function showForgotPassword() {
    toggleAuthForm('forgot');
}

function backToLogin() {
    toggleAuthForm('login');
}

function recoverUserId() {
    alert("Please contact the administrator at deboneel1998@gmail.com to recover your ID.");
}

function resetPassword() {
    alert("Please contact the administrator at deboneel1998@gmail.com to reset your password.");
}

// ==================== REGISTRATION ====================
async function register() {
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
    
    if (registeredUsers[id] || id === ADMIN_ID) {
        showError("This ID is already registered or reserved!");
        return;
    }

    const finalDept = department === 'Others' ? (otherDepartment || 'Others') : department;
    
    // Save user locally
    registeredUsers[id] = {
        id,
        fullName,
        nickname,
        regNo,
        college,
        department: finalDept,
        email,
        password,
        hometown,
        hallName,
        supervisor,
        phone,
        registrationDate: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        loginCount: 1,
        role: "user",
        isAdmin: false,
        isActive: true
    };

    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    localStorage.setItem('currentUser', JSON.stringify({ 
        username: id, 
        password: "hidden",
        nickname,
        department: finalDept
    }));

    // Save to Firebase
    await syncUserToFirebase(id);
    
    // Update today's count in statistics
    const today = new Date().toISOString().split('T')[0];
    userStats.todayUsers = userStats.todayUsers + 1;
    
    // Update registration history
    if (!userStats.registrationHistory[today]) {
        userStats.registrationHistory[today] = 0;
    }
    userStats.registrationHistory[today]++;
    
    // Success
    currentUserRole = 'user';
    currentUserNickname = nickname;
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("main-container").classList.remove("hidden");
    setupTypingAnimation();
    fireConfetti();
    showPopup("Registration Successful! Welcome to EduHub.");
    updateAdminView();
    updateUserStatsDisplay();
    setTheme(false);
}

// ==================== LOGIN ====================
async function login() {
    const username = document.getElementById("login-username")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    const user = registeredUsers[username];

    if ((username === ADMIN_ID && password === ADMIN_PASSWORD)) {
        currentUserRole = 'admin';
        currentUserNickname = "Admin";
        await loginSuccess(username, "Admin");
    } else if (user && user.password === password) {
        currentUserRole = 'user';
        currentUserNickname = user.nickname || user.fullName;
        
        // Update user login stats
        user.lastLogin = new Date().toISOString();
        user.loginCount = (user.loginCount || 0) + 1;
        user.isActive = true;
        registeredUsers[username] = user;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Update in Firebase
        await syncUserToFirebase(username);
        
        await loginSuccess(username, user.nickname || user.fullName);
    } else {
        showError("Invalid ID or Password!");
    }
}

async function loginSuccess(username, nickname) {
    localStorage.setItem('currentUser', JSON.stringify({ 
        username, 
        password: "hidden",
        nickname 
    }));
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("main-container").classList.remove("hidden");
    setupTypingAnimation();
    fireConfetti();
    showPopup(`Welcome back, ${nickname}!`);
    updateAdminView();
    updateUserStatsDisplay();
    setTheme(false);
}

// ==================== LOGOUT ====================
async function logout() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update user activity status
    if (currentUser.username && currentUser.username !== ADMIN_ID) {
        await updateUserLogoutActivity(currentUser.username);
    }
    
    localStorage.removeItem('currentUser');
    currentUserRole = 'user';
    currentUserNickname = '';
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("main-container").classList.add("hidden");
    toggleAuthForm('login');
    updateAdminView();
}

// ==================== USER ACTIVITY ====================
async function updateUserLoginActivity(userId) {
    try {
        const user = registeredUsers[userId];
        if (!user) return;
        
        user.lastLogin = new Date().toISOString();
        user.isActive = true;
        user.loginCount = (user.loginCount || 0) + 1;
        
        registeredUsers[userId] = user;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        await syncUserToFirebase(userId);
        
    } catch (error) {
        console.error("❌ Error updating user login activity:", error);
    }
}

async function updateUserLogoutActivity(userId) {
    try {
        const user = registeredUsers[userId];
        if (!user || user.isAdmin) return;
        
        user.isActive = false;
        
        registeredUsers[userId] = user;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        await syncUserToFirebase(userId);
        
    } catch (error) {
        console.error("❌ Error updating user logout activity:", error);
    }
}

async function syncUserToFirebase(userId = null) {
    try {
        if (!db) return;
        
        if (userId && registeredUsers[userId]) {
            await db.collection('users').doc(userId).set(registeredUsers[userId]);
        } else {
            for (const [id, userData] of Object.entries(registeredUsers)) {
                await db.collection('users').doc(id).set(userData);
            }
        }
        
        console.log("✅ User data synced to Firebase");
        
    } catch (error) {
        console.error("❌ Error syncing user to Firebase:", error);
    }
}

// ==================== UPDATE USER STATS DISPLAY ====================
function updateUserStatsDisplay() {
    // Calculate statistics
    const users = Object.values(registeredUsers).filter(u => !u.isAdmin);
    const activeUsers = users.filter(u => u.isActive).length;
    const today = new Date().toISOString().split('T')[0];
    
    // Count users registered today
    const todayUsers = users.filter(user => {
        if (!user.registrationDate) return false;
        const regDate = new Date(user.registrationDate).toISOString().split('T')[0];
        return regDate === today;
    }).length;
    
    // Calculate department distribution
    const departments = {};
    users.forEach(user => {
        if (user.department) {
            const dept = user.department.toUpperCase();
            departments[dept] = (departments[dept] || 0) + 1;
        }
    });
    
    // Update global stats
    userStats.totalUsers = users.length;
    userStats.activeUsers = activeUsers;
    userStats.todayUsers = todayUsers;
    userStats.departments = departments;
    
    // Update main display
    document.getElementById('total-user-count').textContent = userStats.totalUsers;
    document.getElementById('active-user-count').textContent = userStats.activeUsers;
    document.getElementById('today-user-count').textContent = userStats.todayUsers;
    
    // Update admin panel if open
    document.getElementById('admin-total-count').textContent = userStats.totalUsers;
    document.getElementById('admin-active-count').textContent = userStats.activeUsers;
    document.getElementById('admin-today-count').textContent = userStats.todayUsers;
    document.getElementById('admin-dept-count').textContent = Object.keys(userStats.departments).length;
    
    // If enhanced stats is visible, update those too
    const statTotal = document.getElementById('stat-total-users');
    const statActive = document.getElementById('stat-active-users');
    const statToday = document.getElementById('stat-today-users');
    const statDepts = document.getElementById('stat-departments');
    
    if (statTotal) statTotal.textContent = userStats.totalUsers;
    if (statActive) statActive.textContent = userStats.activeUsers;
    if (statToday) statToday.textContent = userStats.todayUsers;
    if (statDepts) statDepts.textContent = Object.keys(userStats.departments).length;
    
    // Update charts if they exist
    if (document.getElementById('dept-distribution-chart')) {
        updateDepartmentChart();
    }
    if (document.getElementById('registration-chart')) {
        updateRegistrationChart();
    }
}

// ==================== ADMIN VIEW ====================
function updateAdminView() {
    const adminOnlyButtons = document.querySelectorAll('.admin-only');
    adminOnlyButtons.forEach(btn => {
        btn.style.display = currentUserRole === 'admin' ? 'inline-block' : 'none';
    });
    updateUserStatsDisplay();
}

// ==================== SHOW CONTENT ====================
function showContent(section) {
    const content = document.getElementById('content');
    if (!content) return;
    
    switch(section) {
        case 'courses':
            showCourses();
            break;
        case 'articles':
            showArticles();
            break;
        case 'diary':
            showDiary();
            break;
        case 'music':
            showMusicPlayer();
            break;
        case 'movies':
            showMovies();
            break;
        default:
            content.innerHTML = `
                <div class="welcome-section">
                    <h2>Welcome to EduHub!</h2>
                    <p>Select a section from the navigation menu to get started.</p>
                </div>`;
    }
}

// ==================== COURSES SECTION ====================
function showCourses() {
    const content = document.getElementById('content');
    if (!content) return;
    
    let html = `
        <div class="courses-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-graduation-cap"></i> Available Courses
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
                Browse through all available courses. Click on any course to access study materials.
            </p>
            
            <div class="course-container">`;
    
    Object.entries(courses).forEach(([semester, data]) => {
        html += `
            <div class="course-card" onclick="openCourse('${semester}')">
                <h3>${semester}</h3>
                <div style="margin-top: 10px;">
                    <p style="color: rgba(255,255,255,0.8); font-size: 14px;">
                        <i class="fas fa-book"></i> Common Credits: ${data.commonCredits}
                    </p>
                    <p style="color: rgba(255,255,255,0.8); font-size: 14px;">
                        <i class="fas fa-clock"></i> Common Hours: ${data.commonHours}
                    </p>
                    ${data.departmentalCredits ? 
                        `<p style="color: #ffd700; font-size: 14px; margin-top: 5px;">
                            <i class="fas fa-university"></i> Departmental Credits Available
                        </p>` : ''}
                </div>
            </div>`;
    });
    
    html += `
            </div>
        </div>`;
    
    content.innerHTML = html;
}

function openCourse(semester) {
    const courseData = courses[semester];
    if (courseData && courseData.driveId) {
        window.open(`https://drive.google.com/drive/folders/${courseData.driveId}`, '_blank');
    } else {
        alert(`No materials available for ${semester} yet.`);
    }
}

// ==================== ARTICLES SECTION ====================
function showArticles() {
    const content = document.getElementById('content');
    if (!content) return;
    
    let html = `
        <div class="articles-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-newspaper"></i> Educational Articles
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
                Read informative articles about agricultural engineering and related topics.
            </p>
            
            <div class="articles-grid">`;
    
    articles.forEach(article => {
        html += `
            <div class="article-card">
                <h3>${article.title}</h3>
                <div style="margin: 10px 0;">
                    <span class="dept-badge dept-csm" style="font-size: 12px;">${article.category}</span>
                    <span style="color: rgba(255,255,255,0.6); font-size: 12px; margin-left: 10px;">
                        <i class="fas fa-clock"></i> ${article.readTime}
                    </span>
                </div>
                <p>${article.content}</p>
                <button class="eye-catchy-btn small-btn" onclick="readArticle('${article.title}')">
                    <i class="fas fa-book-reader"></i> Read Full Article
                </button>
            </div>`;
    });
    
    html += `
            </div>
        </div>`;
    
    content.innerHTML = html;
}

function readArticle(title) {
    alert(`Reading: ${title}\n\nFull article content will be available soon!`);
}

// ==================== DIARY SECTION ====================
function showDiary() {
    const content = document.getElementById('content');
    if (!content) return;
    
    const savedDiary = localStorage.getItem('studyDiary') || '';
    
    const html = `
        <div class="diary-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-book"></i> Study Diary
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px;">
                Write down your study notes, important points, and daily reflections here.
            </p>
            
            <textarea id="diary-area" class="diary-area" placeholder="Start writing your study notes here...">${savedDiary}</textarea>
            
            <div class="diary-controls">
                <button onclick="saveDiary()" id="save-diary-btn" class="eye-catchy-btn">
                    <i class="fas fa-save"></i> Save Diary
                </button>
                <button onclick="clearDiary()" id="clear-diary-btn" class="eye-catchy-btn">
                    <i class="fas fa-trash"></i> Clear Diary
                </button>
                <button onclick="downloadDiary()" class="eye-catchy-btn" style="background: linear-gradient(45deg, #667eea, #764ba2);">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
            
            <div style="margin-top: 20px; color: rgba(255,255,255,0.6); font-size: 14px;">
                <i class="fas fa-info-circle"></i> Your diary is automatically saved to your browser's local storage.
            </div>
        </div>`;
    
    content.innerHTML = html;
}

function saveDiary() {
    const diaryText = document.getElementById('diary-area')?.value || '';
    localStorage.setItem('studyDiary', diaryText);
    showPopup('Diary saved successfully!');
}

function clearDiary() {
    if (confirm('Are you sure you want to clear your diary? This cannot be undone.')) {
        localStorage.removeItem('studyDiary');
        document.getElementById('diary-area').value = '';
        showPopup('Diary cleared!');
    }
}

function downloadDiary() {
    const diaryText = document.getElementById('diary-area')?.value || '';
    if (!diaryText.trim()) {
        showError('Diary is empty!');
        return;
    }
    
    const blob = new Blob([diaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-diary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showPopup('Diary downloaded!');
}

// ==================== MUSIC PLAYER ====================
let currentMusicIndex = 0;
let isPlaying = false;
let audioElement = null;

function showMusicPlayer() {
    const content = document.getElementById('content');
    if (!content) return;
    
    let html = `
        <div class="music-player-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-music"></i> Study Music Player
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
                Listen to focus-enhancing music while studying. Perfect for concentration!
            </p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-bottom: 30px;">
                <h3 id="current-music-title" style="color: #ffd700;">${musicPlaylist[currentMusicIndex]?.name || 'No Music'}</h3>
                <p id="current-music-type" style="color: rgba(255,255,255,0.8);">
                    ${musicPlaylist[currentMusicIndex]?.type ? musicPlaylist[currentMusicIndex].type.charAt(0).toUpperCase() + musicPlaylist[currentMusicIndex].type.slice(1) : ''}
                </p>
                
                <div class="player-controls">
                    <button onclick="playPrevious()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button onclick="togglePlayPause()" id="play-pause-btn" class="eye-catchy-btn">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button onclick="playNext()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-step-forward"></i>
                    </button>
                </div>
            </div>
            
            <div class="music-playlist">
                <h3 style="color: #ff7eb3; margin-bottom: 15px;">Playlist</h3>`;
    
    musicPlaylist.forEach((music, index) => {
        html += `
            <div class="playlist-item ${index === currentMusicIndex ? 'active' : ''}" 
                 onclick="selectMusic(${index})">
                <i class="fas fa-music" style="margin-bottom: 10px;"></i>
                <h4 style="color: ${index === currentMusicIndex ? '#ffd700' : 'white'}; margin-bottom: 5px;">
                    ${music.name}
                </h4>
                <p style="color: rgba(255,255,255,0.7); font-size: 12px;">
                    ${music.type.charAt(0).toUpperCase() + music.type.slice(1)}
                </p>
            </div>`;
    });
    
    html += `
            </div>
        </div>`;
    
    content.innerHTML = html;
}

function togglePlayPause() {
    const btn = document.getElementById('play-pause-btn');
    if (!btn) return;
    
    if (!isPlaying) {
        // Play music
        const music = musicPlaylist[currentMusicIndex];
        if (music && music.url) {
            if (!audioElement) {
                audioElement = new Audio();
            }
            audioElement.src = music.url;
            audioElement.play().catch(e => {
                console.error("Error playing audio:", e);
                window.open(music.url, '_blank');
            });
            isPlaying = true;
            btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        }
    } else {
        // Pause music
        if (audioElement) {
            audioElement.pause();
        }
        isPlaying = false;
        btn.innerHTML = '<i class="fas fa-play"></i> Play';
    }
}

function selectMusic(index) {
    currentMusicIndex = index;
    const currentMusic = musicPlaylist[currentMusicIndex];
    
    // Update UI
    const titleEl = document.getElementById('current-music-title');
    const typeEl = document.getElementById('current-music-type');
    const playlistItems = document.querySelectorAll('.playlist-item');
    
    if (titleEl) titleEl.textContent = currentMusic.name;
    if (typeEl) typeEl.textContent = currentMusic.type.charAt(0).toUpperCase() + currentMusic.type.slice(1);
    
    playlistItems.forEach((item, idx) => {
        if (idx === index) {
            item.classList.add('active');
            item.querySelector('h4').style.color = '#ffd700';
        } else {
            item.classList.remove('active');
            item.querySelector('h4').style.color = 'white';
        }
    });
    
    // If music is playing, play the selected one
    if (isPlaying) {
        togglePlayPause(); // Pause current
        setTimeout(() => togglePlayPause(), 100); // Play selected
    }
}

function playNext() {
    currentMusicIndex = (currentMusicIndex + 1) % musicPlaylist.length;
    selectMusic(currentMusicIndex);
    if (isPlaying) {
        togglePlayPause();
        setTimeout(() => togglePlayPause(), 100);
    }
}

function playPrevious() {
    currentMusicIndex = (currentMusicIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
    selectMusic(currentMusicIndex);
    if (isPlaying) {
        togglePlayPause();
        setTimeout(() => togglePlayPause(), 100);
    }
}

// ==================== MOVIES SECTION ====================
function showMovies() {
    const content = document.getElementById('content');
    if (!content) return;
    
    const html = `
        <div class="movies-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-film"></i> Educational Movies & Documentaries
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
                Watch educational content related to agricultural engineering and technology.
            </p>
            
            <div class="movies-search">
                <input type="text" id="movie-search" class="movie-input" placeholder="Search for educational movies...">
                <button onclick="searchMovie()" class="eye-catchy-btn">
                    <i class="fas fa-search"></i> Search
                </button>
            </div>
            
            <div class="movies-list">
                <h3 style="color: #ffd700; margin-bottom: 15px;">Recommended Content</h3>
                <ol>
                    <li onclick="openMovie('https://www.youtube.com/results?search_query=agricultural+engineering+documentary')">
                        <strong>Agricultural Engineering Documentary</strong>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 5px;">
                            Explore modern agricultural engineering practices
                        </p>
                    </li>
                    <li onclick="openMovie('https://www.youtube.com/results?search_query=irrigation+systems+technology')">
                        <strong>Modern Irrigation Systems</strong>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 5px;">
                            Learn about advanced irrigation technologies
                        </p>
                    </li>
                    <li onclick="openMovie('https://www.youtube.com/results?search_query=sustainable+agriculture+techniques')">
                        <strong>Sustainable Agriculture</strong>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 5px;">
                            Environmentally friendly farming methods
                        </p>
                    </li>
                    <li onclick="openMovie('https://www.youtube.com/results?search_query=farm+machinery+technology')">
                        <strong>Farm Machinery Technology</strong>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 5px;">
                            Latest advancements in farm equipment
                        </p>
                    </li>
                    <li onclick="openMovie('https://www.youtube.com/results?search_query=water+management+agriculture')">
                        <strong>Water Management in Agriculture</strong>
                        <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-top: 5px;">
                            Efficient water use for farming
                        </p>
                    </li>
                </ol>
            </div>
            
            <div style="margin-top: 30px; color: rgba(255,255,255,0.6); font-size: 14px;">
                <i class="fas fa-info-circle"></i> Click on any item to search for related videos on YouTube.
            </div>
        </div>`;
    
    content.innerHTML = html;
    
    // Add event listener for search input
    const searchInput = document.getElementById('movie-search');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchMovie();
            }
        });
    }
}

function searchMovie() {
    const searchTerm = document.getElementById('movie-search')?.value.trim();
    if (searchTerm) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' agriculture engineering')}`, '_blank');
    } else {
        showError('Please enter a search term!');
    }
}

function openMovie(url) {
    window.open(url, '_blank');
}

// ==================== ENHANCED STATISTICS ====================
function showDetailedStats() {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }
    
    const content = document.getElementById("content");
    if (!content) return;
    
    // Update statistics first
    updateUserStatsDisplay();
    
    const html = `
        <div class="enhanced-stats-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-chart-line"></i> Statistics Dashboard
            </h2>
            
            <!-- Real-time Statistics Cards -->
            <div class="stats-bar">
                <div class="stat-card">
                    <i class="fas fa-users fa-2x" style="color: #3498db; margin-bottom: 10px;"></i>
                    <div class="stat-value" id="stat-total-users">${userStats.totalUsers}</div>
                    <div class="stat-label">Total Registered Users</div>
                </div>
                
                <div class="stat-card">
                    <i class="fas fa-eye fa-2x" style="color: #2ecc71; margin-bottom: 10px;"></i>
                    <div class="stat-value" id="stat-active-users">${userStats.activeUsers}</div>
                    <div class="stat-label">Currently Active</div>
                </div>
                
                <div class="stat-card">
                    <i class="fas fa-calendar-day fa-2x" style="color: #e74c3c; margin-bottom: 10px;"></i>
                    <div class="stat-value" id="stat-today-users">${userStats.todayUsers}</div>
                    <div class="stat-label">New Today</div>
                </div>
                
                <div class="stat-card">
                    <i class="fas fa-university fa-2x" style="color: #9b59b6; margin-bottom: 10px;"></i>
                    <div class="stat-value" id="stat-departments">${Object.keys(userStats.departments).length}</div>
                    <div class="stat-label">Departments</div>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="charts-container">
                <div class="chart-wrapper">
                    <h4><i class="fas fa-chart-pie"></i> Department Distribution</h4>
                    <div style="height: 300px;">
                        <canvas id="dept-distribution-chart"></canvas>
                    </div>
                </div>
                
                <div class="chart-wrapper">
                    <h4><i class="fas fa-chart-bar"></i> Daily Registrations (Last 7 Days)</h4>
                    <div style="height: 300px;">
                        <canvas id="registration-chart"></canvas>
                    </div>
                </div>
            </div>
            
            <!-- Department-wise Statistics -->
            <div style="margin-top: 30px;">
                <h4 style="color:#ff7eb3; margin-bottom: 15px;">
                    <i class="fas fa-list-alt"></i> Department Details
                </h4>
                <div id="dept-details" class="dept-details-grid">
                    ${updateDepartmentDetailsHTML()}
                </div>
            </div>
            
            <!-- Quick Actions -->
            <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                <button onclick="refreshAllStats()" class="eye-catchy-btn">
                    <i class="fas fa-sync-alt"></i> Refresh All Stats
                </button>
                <button onclick="showUserList()" class="eye-catchy-btn">
                    <i class="fas fa-users"></i> View All Users
                </button>
                <button onclick="exportUserData()" class="eye-catchy-btn">
                    <i class="fas fa-download"></i> Export Data
                </button>
            </div>
        </div>`;
    
    content.innerHTML = html;
    
    // Initialize charts
    setTimeout(() => {
        updateDepartmentChart();
        updateRegistrationChart();
    }, 100);
}

function updateDepartmentChart() {
    const ctx = document.getElementById('dept-distribution-chart');
    if (!ctx) return;
    
    if (deptChart) {
        deptChart.destroy();
    }
    
    const departments = Object.keys(userStats.departments);
    const counts = Object.values(userStats.departments);
    
    if (departments.length === 0) {
        ctx.innerHTML = '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 20px;">No department data available</p>';
        return;
    }
    
    // Colors for each department
    const colors = {
        'CSM': '#3498db',
        'FPM': '#2ecc71',
        'FSEE': '#9b59b6',
        'IWM': '#f1c40f',
        'OTHERS': '#95a5a6'
    };
    
    const backgroundColors = departments.map(dept => colors[dept] || getRandomColor());
    
    deptChart = new Chart(ctx.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: departments,
            datasets: [{
                data: counts,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2,
                hoverOffset: 20
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#fff',
                        font: {
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#ff7eb3',
                    bodyColor: '#fff',
                    borderColor: '#ff7eb3',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} users (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function updateRegistrationChart() {
    const ctx = document.getElementById('registration-chart');
    if (!ctx) return;
    
    if (regChart) {
        regChart.destroy();
    }
    
    // Get last 7 days
    const dates = [];
    const data = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        dates.push(dayLabel);
        data.push(userStats.registrationHistory[dateStr] || 0);
    }
    
    regChart = new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'New Registrations',
                data: data,
                backgroundColor: 'rgba(255, 126, 179, 0.5)',
                borderColor: '#ff7eb3',
                borderWidth: 2,
                borderRadius: 5,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff',
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'Number of Users',
                        color: '#fff'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    title: {
                        display: true,
                        text: 'Day',
                        color: '#fff'
                    }
                }
            }
        }
    });
}

function updateDepartmentDetailsHTML() {
    let html = '';
    const departments = Object.entries(userStats.departments)
        .sort((a, b) => b[1] - a[1]);
    
    if (departments.length === 0) {
        return '<p style="color: rgba(255,255,255,0.6); text-align: center; grid-column: 1/-1;">No department data available</p>';
    }
    
    departments.forEach(([dept, count]) => {
        const percentage = userStats.totalUsers > 0 ? Math.round((count / userStats.totalUsers) * 100) : 0;
        const deptLower = dept.toLowerCase();
        const deptClass = deptLower === 'csm' || deptLower === 'fpm' || deptLower === 'fsee' || deptLower === 'iwm' ? 
                          `dept-${deptLower}` : 'dept-others';
        
        html += `
            <div class="dept-card">
                <span class="dept-badge ${deptClass}">${dept}</span>
                <div class="dept-count">${count}</div>
                <div style="font-size: 0.9rem; color: rgba(255,255,255,0.6);">
                    ${percentage}% of total users
                </div>
                <div class="dept-percentage">
                    <div class="dept-percentage-fill" style="width: ${percentage}%;"></div>
                </div>
                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">
                    ${getDeptDescription(dept)}
                </div>
            </div>`;
    });
    
    return html;
}

function getDeptDescription(dept) {
    const deptUpper = dept.toUpperCase();
    const descriptions = {
        'CSM': 'Computer Science and Mathematics',
        'FPM': 'Farm Power and Machinery',
        'FSEE': 'Farm Structure and Environmental Engineering',
        'IWM': 'Irrigation and Water Management',
        'OTHERS': 'Other departments'
    };
    return descriptions[deptUpper] || dept;
}

// ==================== ADMIN FUNCTIONS ====================
async function showUserList() {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }

    await loadAllUsersFromFirebase();
    
    const content = document.getElementById("content");
    if (!content) return;
    
    const users = Object.values(registeredUsers).filter(u => !u.isAdmin);
    
    let html = `
        <div class="user-management-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-users"></i> User Management (${users.length} Users)
            </h2>
            
            <!-- Search and Filters -->
            <div class="filter-controls">
                <div class="search-container">
                    <input type="text" id="user-search" class="search-input" placeholder="Search users by name, ID, department...">
                </div>
                
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button onclick="filterUsers('all')" class="filter-btn active">All Users</button>
                    <button onclick="filterUsers('active')" class="filter-btn">
                        <i class="fas fa-circle" style="color: #27ae60;"></i> Active
                    </button>
                    <button onclick="filterUsers('csm')" class="filter-btn">CSM</button>
                    <button onclick="filterUsers('fpm')" class="filter-btn">FPM</button>
                    <button onclick="filterUsers('fsee')" class="filter-btn">FSEE</button>
                    <button onclick="filterUsers('iwm')" class="filter-btn">IWM</button>
                </div>
            </div>
            
            <!-- Statistics Summary -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: rgba(52, 152, 219, 0.2); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #3498db;">${users.length}</div>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Total Users</div>
                </div>
                <div style="background: rgba(46, 204, 113, 0.2); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #2ecc71;">${users.filter(u => u.isActive).length}</div>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Active Now</div>
                </div>
                <div style="background: rgba(155, 89, 182, 0.2); padding: 15px; border-radius: 10px; text-align: center;">
                    <div style="font-size: 2rem; font-weight: bold; color: #9b59b6;">${Object.keys(userStats.departments).length}</div>
                    <div style="font-size: 0.9rem; color: rgba(255,255,255,0.8);">Departments</div>
                </div>
            </div>
            
            <!-- Users Grid -->
            <div id="users-grid" class="user-grid">`;
    
    if (users.length === 0) {
        html += `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
                    <i class="fas fa-users fa-3x" style="margin-bottom: 20px;"></i>
                    <h3>No users registered yet</h3>
                </div>`;
    } else {
        users.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .forEach(user => {
                const dept = user.department || 'Others';
                const deptClass = dept.toLowerCase() === 'csm' || dept.toLowerCase() === 'fpm' || 
                                 dept.toLowerCase() === 'fsee' || dept.toLowerCase() === 'iwm' ? 
                                 `dept-${dept.toLowerCase()}` : 'dept-others';
                
                html += `
                    <div class="user-card" data-user-id="${user.id}" data-dept="${dept.toLowerCase()}" data-active="${user.isActive}">
                        <div class="user-card-header">
                            <div>
                                <div style="font-weight: bold; color: #ff7eb3;">${user.nickname || user.fullName}</div>
                                <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6);">ID: ${user.id}</div>
                            </div>
                            <div>
                                <span class="user-status ${user.isActive ? 'status-active' : 'status-inactive'}"></span>
                            </div>
                        </div>
                        
                        <div style="margin: 10px 0;">
                            <div style="font-size: 0.9rem; margin-bottom: 5px;">
                                <i class="fas fa-university"></i> ${user.college || 'Not specified'}
                            </div>
                            <div style="font-size: 0.9rem;">
                                <span class="dept-badge ${deptClass}">${dept}</span>
                            </div>
                        </div>
                        
                        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.6); margin: 10px 0;">
                            <div><i class="far fa-calendar"></i> Joined: ${new Date(user.registrationDate).toLocaleDateString()}</div>
                            <div><i class="fas fa-sign-in-alt"></i> Logins: ${user.loginCount || 0}</div>
                        </div>
                        
                        <div class="user-actions">
                            <button onclick="viewUserDetails('${user.id}')" class="eye-catchy-btn small-btn" style="flex: 1;">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button onclick="deleteUser('${user.id}')" class="eye-catchy-btn small-btn" style="background: linear-gradient(45deg, #e74c3c, #c0392b);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>`;
            });
    }
    
    html += `</div></div>`;
    content.innerHTML = html;
    
    // Add search functionality
    setupUserSearch();
}

function setupUserSearch() {
    const searchInput = document.getElementById('user-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const userCards = document.querySelectorAll('.user-card');
        
        userCards.forEach(card => {
            const userId = card.getAttribute('data-user-id').toLowerCase();
            const userName = card.querySelector('div[style*="font-weight: bold"]')?.textContent.toLowerCase() || '';
            const userDept = card.getAttribute('data-dept') || '';
            
            if (userId.includes(searchTerm) || userName.includes(searchTerm) || userDept.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

function filterUsers(filter) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    const userCards = document.querySelectorAll('.user-card');
    
    userCards.forEach(card => {
        const dept = card.getAttribute('data-dept');
        const active = card.getAttribute('data-active') === 'true';
        
        switch(filter) {
            case 'all':
                card.style.display = 'block';
                break;
            case 'active':
                card.style.display = active ? 'block' : 'none';
                break;
            case 'csm':
            case 'fpm':
            case 'fsee':
            case 'iwm':
                card.style.display = dept === filter ? 'block' : 'none';
                break;
        }
    });
}

async function deleteUser(userId) {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }
    
    if (!confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
        return;
    }
    
    // Delete from local storage
    delete registeredUsers[userId];
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Delete from Firebase
    if (db) {
        try {
            await db.collection('users').doc(userId).delete();
            console.log(`✅ User ${userId} deleted from Firebase`);
        } catch (error) {
            console.error("❌ Error deleting user from Firebase:", error);
        }
    }
    
    // Refresh user list
    showUserList();
    updateUserStatsDisplay();
    showPopup(`User ${userId} deleted successfully!`);
}

function viewUserDetails(userId) {
    const user = registeredUsers[userId];
    if (!user) return;
    
    const modal = document.getElementById('user-details-modal');
    const content = document.getElementById('user-details-content');
    
    if (!modal || !content) return;
    
    const html = `
        <div class="user-info-grid">
            <div class="user-info-card">
                <h4><i class="fas fa-user"></i> Personal Information</h4>
                <div class="user-info-item">
                    <span class="user-info-label">Full Name:</span>
                    <span class="user-info-value">${user.fullName || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Nickname:</span>
                    <span class="user-info-value">${user.nickname || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">ID:</span>
                    <span class="user-info-value">${user.id}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Registration No:</span>
                    <span class="user-info-value">${user.regNo || 'Not specified'}</span>
                </div>
            </div>
            
            <div class="user-info-card">
                <h4><i class="fas fa-graduation-cap"></i> Academic Information</h4>
                <div class="user-info-item">
                    <span class="user-info-label">College:</span>
                    <span class="user-info-value">${user.college || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Department:</span>
                    <span class="user-info-value">${user.department || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Supervisor:</span>
                    <span class="user-info-value">${user.supervisor || 'Not specified'}</span>
                </div>
            </div>
            
            <div class="user-info-card">
                <h4><i class="fas fa-address-book"></i> Contact Information</h4>
                <div class="user-info-item">
                    <span class="user-info-label">Email:</span>
                    <span class="user-info-value">${user.email || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Phone:</span>
                    <span class="user-info-value">${user.phone || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Hometown:</span>
                    <span class="user-info-value">${user.hometown || 'Not specified'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Hall Name:</span>
                    <span class="user-info-value">${user.hallName || 'Not specified'}</span>
                </div>
            </div>
            
            <div class="user-info-card">
                <h4><i class="fas fa-chart-line"></i> Activity Information</h4>
                <div class="user-info-item">
                    <span class="user-info-label">Registration Date:</span>
                    <span class="user-info-value">${new Date(user.registrationDate).toLocaleString()}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Last Login:</span>
                    <span class="user-info-value">${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Login Count:</span>
                    <span class="user-info-value">${user.loginCount || 0}</span>
                </div>
                <div class="user-info-item">
                    <span class="user-info-label">Status:</span>
                    <span class="user-info-value" style="color: ${user.isActive ? '#27ae60' : '#e74c3c'}">
                        ${user.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
        </div>`;
    
    content.innerHTML = html;
    modal.classList.remove('hidden');
}

function closeUserDetails() {
    const modal = document.getElementById('user-details-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function refreshAllStats() {
    loadAllUsersFromFirebase();
    updateUserStatsDisplay();
    showPopup('All statistics refreshed!');
}

// ==================== HELPER FUNCTIONS ====================
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function showPopup(msg) {
    const popup = document.getElementById("popup");
    if (!popup) return;
    
    const h3 = popup.querySelector('h3');
    if (h3) h3.textContent = msg;
    
    popup.classList.remove('hidden');
    
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 3000);
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
        popup.classList.add('hidden');
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
            particleCount: 100,
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