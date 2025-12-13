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
let recoveryUserId = '';
let recoveryOTP = '';

// Global user statistics
let userStats = {
    totalUsers: 0,
    activeUsers: 0,
    todayUsers: 0,
    departments: {},
    registrationHistory: {}
};

// Educational Courses Data (Updated with Software and Job Sections)
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
        readTime: "5 min",
        fullContent: `
            <h2>The Future of Agricultural Engineering</h2>
            <p>Agricultural engineering is at the forefront of the next green revolution. With the global population projected to reach 9.7 billion by 2050, the demand for food will increase by 70%. Agricultural engineers are developing innovative solutions to meet this challenge sustainably.</p>
            
            <h3>Key Technological Advancements:</h3>
            <ul>
                <li><strong>Precision Agriculture:</strong> Using drones, sensors, and IoT devices to monitor crop health and optimize resource use</li>
                <li><strong>Automated Machinery:</strong> Self-driving tractors and harvesters that operate 24/7 with minimal human intervention</li>
                <li><strong>Vertical Farming:</strong> Indoor farming systems that use 95% less water and produce higher yields</li>
                <li><strong>Genetic Engineering:</strong> Developing crops resistant to drought, pests, and diseases</li>
                <li><strong>Water Management:</strong> Advanced irrigation systems that conserve water while maximizing crop yield</li>
            </ul>
            
            <h3>Career Opportunities:</h3>
            <p>The field offers diverse career paths in research, development, consulting, and implementation of sustainable agricultural technologies.</p>
            
            <div class="article-key-points">
                <strong>Key Takeaways:</strong>
                <p>• Technology integration is revolutionizing traditional farming practices<br>
                   • Sustainability is at the core of modern agricultural engineering<br>
                   • There's growing demand for skilled agricultural engineers globally<br>
                   • Continuous learning is essential due to rapid technological changes</p>
            </div>
        `
    },
    {
        title: "Sustainable Water Management Techniques",
        content: "Learn about modern techniques for efficient water use in agriculture and their impact on crop yield...",
        category: "Environment",
        readTime: "7 min",
        fullContent: `
            <h2>Sustainable Water Management Techniques</h2>
            <p>Water scarcity affects more than 40% of the global population. In agriculture, which consumes 70% of freshwater resources, efficient water management is crucial for sustainable food production.</p>
            
            <h3>Modern Irrigation Techniques:</h3>
            <ul>
                <li><strong>Drip Irrigation:</strong> Delivers water directly to plant roots, reducing evaporation and water waste by up to 60%</li>
                <li><strong>Sprinkler Systems:</strong> Automated systems that distribute water evenly across fields</li>
                <li><strong>Subsurface Irrigation:</strong> Buried pipes deliver water below the soil surface, minimizing evaporation</li>
                <li><strong>Center Pivot Irrigation:</strong> Circular irrigation systems ideal for large, flat fields</li>
            </ul>
            
            <h3>Smart Water Management Technologies:</h3>
            <ul>
                <li><strong>Soil Moisture Sensors:</strong> Real-time monitoring of soil water content</li>
                <li><strong>Weather-based Irrigation Controllers:</strong> Adjust watering schedules based on weather forecasts</li>
                <li><strong>Remote Sensing:</strong> Satellite imagery to assess crop water needs</li>
                <li><strong>AI-powered Irrigation:</strong> Machine learning algorithms optimize water usage based on multiple parameters</li>
            </ul>
            
            <h3>Impact on Crop Yield:</h3>
            <p>Proper water management can increase crop yields by 20-50% while reducing water consumption by 30-60%.</p>
            
            <div class="article-key-points">
                <strong>Best Practices:</strong>
                <p>• Regular soil testing to determine water requirements<br>
                   • Implementing rainwater harvesting systems<br>
                   • Using mulching to reduce evaporation<br>
                   • Scheduling irrigation during cooler parts of the day</p>
            </div>
        `
    },
    {
        title: "Career Opportunities in Irrigation Engineering",
        content: "Discover various career paths and opportunities in the field of irrigation and water management...",
        category: "Career",
        readTime: "6 min",
        fullContent: `
            <h2>Career Opportunities in Irrigation Engineering</h2>
            <p>Irrigation engineering offers diverse career opportunities in both public and private sectors, with growing demand due to increasing water scarcity and food security concerns.</p>
            
            <h3>Career Paths:</h3>
            <ul>
                <li><strong>Irrigation Design Engineer:</strong> Design efficient irrigation systems for farms, golf courses, and landscapes</li>
                <li><strong>Water Resource Manager:</strong> Manage water distribution and conservation for municipalities</li>
                <li><strong>Research Scientist:</strong> Develop new irrigation technologies and methods</li>
                <li><strong>Consultant:</strong> Advise farmers and organizations on water management strategies</li>
                <li><strong>Project Manager:</strong> Oversee large-scale irrigation projects</li>
                <li><strong>Government Officer:</strong> Work in agriculture or water resources departments</li>
            </ul>
            
            <h3>Required Skills:</h3>
            <ul>
                <li>Strong understanding of hydrology and hydraulics</li>
                <li>CAD software proficiency (AutoCAD, Civil 3D)</li>
                <li>Knowledge of soil science and crop requirements</li>
                <li>Project management abilities</li>
                <li>Problem-solving and analytical skills</li>
                <li>Understanding of environmental regulations</li>
            </ul>
            
            <h3>Salary Range:</h3>
            <p>Entry-level positions: $45,000 - $60,000<br>
               Mid-career professionals: $65,000 - $90,000<br>
               Senior positions/consultants: $95,000 - $130,000+</p>
            
            <h3>Industry Sectors:</h3>
            <ul>
                <li>Agricultural corporations</li>
                <li>Government agencies</li>
                <li>Consulting firms</li>
                <li>Research institutions</li>
                <li>International development organizations</li>
                <li>Manufacturing companies</li>
            </ul>
        `
    },
    {
        title: "Climate Change and Agricultural Adaptation",
        content: "Understanding how climate change affects agriculture and adaptive strategies for farmers...",
        category: "Environment",
        readTime: "8 min",
        fullContent: `
            <h2>Climate Change and Agricultural Adaptation</h2>
            <p>Climate change poses significant challenges to agriculture, including changing rainfall patterns, increased temperatures, and extreme weather events. Farmers and agricultural engineers must develop adaptive strategies to ensure food security.</p>
            
            <h3>Climate Change Impacts:</h3>
            <ul>
                <li><strong>Temperature Increases:</strong> Affects crop growth cycles and reduces yields</li>
                <li><strong>Changing Rainfall Patterns:</strong> Leads to droughts and floods</li>
                <li><strong>Increased Pest Pressure:</strong> Warmer temperatures allow pests to survive winters</li>
                <li><strong>Soil Degradation:</strong> Erosion and nutrient depletion from extreme weather</li>
                <li><strong>Water Scarcity:</strong> Reduced water availability for irrigation</li>
            </ul>
            
            <h3>Adaptation Strategies:</h3>
            <ul>
                <li><strong>Crop Diversification:</strong> Growing multiple crop varieties to spread risk</li>
                <li><strong>Climate-Resilient Crops:</strong> Developing drought and heat-tolerant varieties</li>
                <li><strong>Improved Irrigation:</strong> Implementing efficient water management systems</li>
                <li><strong>Soil Conservation:</strong> Techniques like contour plowing and cover cropping</li>
                <li><strong>Weather Forecasting:</strong> Using advanced predictions to plan farming activities</li>
                <li><strong>Agroforestry:</strong> Integrating trees into farming systems</li>
            </ul>
            
            <h3>Technological Solutions:</h3>
            <ul>
                <li>Remote sensing for early detection of stress</li>
                <li>AI-based decision support systems</li>
                <li>Automated weather stations</li>
                <li>Mobile apps for farmer advisory services</li>
                <li>Blockchain for supply chain transparency</li>
            </ul>
            
            <h3>Government Initiatives:</h3>
            <p>Many governments are implementing programs to support climate-smart agriculture, including subsidies for efficient technologies, insurance schemes, and research funding.</p>
            
            <div class="article-key-points">
                <strong>Future Outlook:</strong>
                <p>• Climate adaptation will become increasingly important<br>
                   • Technology will play a crucial role in resilience<br>
                   • International cooperation is essential<br>
                   • Sustainable practices benefit both farmers and the environment</p>
            </div>
        `
    }
];

// Research Publications
const publications = [
    {
        title: "Future Water Management Strategies for Potato Irrigation Under Multiple Climate Change Scenarios Using Advanced CMIP6 Modeling in Subtropical Bangladesh",
        authors: "Md Touhidul Islam, Deboneel Partho, Nusrat Jahan , Md Jannatun Naiem, Md Jannatun Naiem, ...",
        journal: "Journal of Agriculture and Food Research",
        year: 2025,
        doi: "https://doi.org/10.1016/j.jafr.2025.102571",
        abstract: "This study presents semi-supervised machine learning models for accurate estimation of daily reference evapotranspiration using limited meteorological variables, demonstrating superior performance compared to traditional methods.",
        description: "This research paper develops advanced semi-supervised machine learning models that can accurately estimate daily reference evapotranspiration (ET₀) even when only limited meteorological data is available. The models showed significant improvement over conventional approaches."
    },
    {
        title: "Climate-smart irrigation planning for rabi maize (Zea mays L.): CMIP6 multi-model projections in north-central Bangladesh",
        authors: "Md Touhidul Islam, Deboneel Partho, Nusrat Jahan, Md Tarek Abrar ...",
        journal: "Journal of Agriculture and Food Research",
        year: 2025,
        doi: "https://doi.org/10.1016/j.jafr.2025.102225",
        abstract: "Comparative analysis of semi-supervised learning algorithms for ET0 estimation with limited meteorological parameters, identifying the most efficient algorithms for different climatic conditions.",
        description: "This comparative study evaluates various semi-supervised learning algorithms for estimating reference evapotranspiration under conditions of limited meteorological parameters, providing insights into algorithm selection for different environmental scenarios."
    },
    {
        title: "Regional irrigation water quality index for the Old Brahmaputra River, Bangladesh: A multivariate and GIS-based spatiotemporal assessment",
        authors: "Md. Touhidul Islam, Akash, Mst. Rimi Khatun, Nusrat Jahan, Md. Rakibul Islam, Deboneel Partho, ...",
        journal: "Results in Engineering",
        year: 2024,
        doi: "https://doi.org/10.1016/j.rineng.2024.103667",
        abstract: "Ensemble machine learning approaches for accurate reference evapotranspiration estimation in Bangladesh, considering regional climatic variations and agricultural needs.",
        description: "This research focuses on developing ensemble machine learning models specifically tailored for accurate reference evapotranspiration estimation in Bangladesh, taking into account the unique climatic patterns and agricultural requirements of the region."
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
    { text: "প্রকৃতি ও প্রযুক্তির সেতুবন্ধনই কৃষি প্রকৌশলের আসল শক্তি।", author: "Unknown" },
    { text: "মাটি, পানি ও প্রযুক্তির সঠিক ব্যবস্থাপনাই টেকসই কৃষির ভিত্তি।", author: "Agricultural Engineering Insight" },
    { text: "কৃষি প্রকৌশলীরা শুধু ফসল নয়, ভবিষ্যৎও ডিজাইন করে।", author: "Unknown" },
    { text: "যেখানে বিজ্ঞান মাটিকে বোঝে, সেখানেই কৃষি প্রকৌশল জন্ম নেয়।", author: "Bangladeshi Thought" },
    { text: "সেচ, যন্ত্র ও ডেটা—এই তিনেই আধুনিক কৃষির প্রাণ।", author: "Agro-Tech Saying" },
    { text: "প্রকৌশল যখন কৃষকের পাশে দাঁড়ায়, উৎপাদন নিজেই কথা বলে।", author: "Unknown" }
];


// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async function() {
    console.log("🚀 Website initialized");
    
    // Initialize Firebase
    initializeFirebase();
    
    // Load users from localStorage first for faster startup
    registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || {};
    console.log("📊 Loaded users from localStorage:", Object.keys(registeredUsers).length);
    
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
        
        // Check first time visitor
        checkFirstTimeVisitor();
        
        // Check if user needs department update
        checkDepartmentUpdate();
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
            email: "partho.2105056@bau.edu.bd",
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
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
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
}

// ==================== CHECK DEPARTMENT UPDATE ====================
function checkDepartmentUpdate() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || !currentUser.username || currentUser.username === ADMIN_ID) return;
    
    const user = registeredUsers[currentUser.username];
    if (!user) return;
    
    const validDepartments = ['CSM', 'FPM', 'FSEE', 'IWM', 'Level 1', 'Level 2', 'LEVEL 1', 'LEVEL 2'];
    const userDept = (user.department || '').toUpperCase();
    const isValidDept = validDepartments.some(dept => userDept === dept.toUpperCase());
    
    if (!isValidDept && user.department !== 'Others') {
        // Show department update notification
        setTimeout(() => {
            showDepartmentNotification();
        }, 3000);
    }
}

// ==================== SHOW DEPARTMENT NOTIFICATION ====================
function showDepartmentNotification() {
    const notificationHTML = `
        <div class="notification-popup show" id="department-notification">
            <div class="notification-content">
                <h3><i class="fas fa-exclamation-triangle"></i> Department Update Required</h3>
                <p>Your current department selection is not a standard department. Please update your department to one of the following:</p>
                <ul style="text-align: left; margin: 15px 0;">
                    <li><strong>Level 1</strong> - First Year Students</li>
                    <li><strong>Level 2</strong> - Second Year Students</li>
                    <li><strong>CSM</strong> - Computer Science and Mathematics</li>
                    <li><strong>FPM</strong> - Farm Power and Machinery</li>
                    <li><strong>FSEE</strong> - Farm Structure and Environmental Engineering</li>
                    <li><strong>IWM</strong> - Irrigation and Water Management</li>
                </ul>
                <p style="color: #ffd700; margin-top: 15px;">
                    <i class="fas fa-info-circle"></i> You can update your department from the "Update Info" section.
                </p>
                <div class="notification-actions">
                    <button onclick="dismissDepartmentNotification()" class="eye-catchy-btn">
                        <i class="fas fa-check"></i> I'll Update Later
                    </button>
                    <button onclick="showProfileUpdate()" class="eye-catchy-btn" style="background: linear-gradient(45deg, #27ae60, #2ecc71);">
                        <i class="fas fa-user-edit"></i> Update Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing notification if any
    const existingNotification = document.getElementById('department-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Add new notification
    document.body.insertAdjacentHTML('beforeend', notificationHTML);
}

function dismissDepartmentNotification() {
    const notification = document.getElementById('department-notification');
    if (notification) {
        notification.remove();
    }
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    console.log("🔧 Setting up event listeners");
    
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
    
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// ==================== CLOCK FUNCTION ====================
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-GB', { hour12: false }).slice(0, 8);
    const date = now.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
    
    const clockDate = document.querySelector('.clock-date');
    const clockTime = document.querySelector('.clock-time');
    
    if (clockDate && clockTime) {
        clockDate.textContent = date;
        clockTime.textContent = time;
    }
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
    
    // Check first time visitor
    checkFirstTimeVisitor();
    
    // Check department
    checkDepartmentUpdate();
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
    
    // Check first time visitor
    checkFirstTimeVisitor();
    
    // Check department
    checkDepartmentUpdate();
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
    const totalUserCount = document.getElementById('total-user-count');
    const activeUserCount = document.getElementById('active-user-count');
    const todayUserCount = document.getElementById('today-user-count');
    
    if (totalUserCount) totalUserCount.textContent = userStats.totalUsers;
    if (activeUserCount) activeUserCount.textContent = userStats.activeUsers;
    if (todayUserCount) todayUserCount.textContent = userStats.todayUsers;
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
        case 'publications':
            showPublications();
            break;
        default:
            content.innerHTML = `
                <div class="welcome-section">
                    <h2>Welcome to EduHub!</h2>
                    <p>Select a section from the navigation menu to get started.</p>
                </div>`;
    }
}

// ==================== COURSES SECTION (Updated with Software and Job Sections) ====================
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
            
            <div class="course-grid">`;
    
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
            
            <!-- Software Section -->
            <div class="resource-section">
                <div class="resource-card">
                    <h3><i class="fas fa-laptop-code"></i> Software & Tools</h3>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 15px;">
                        Useful software and tools for agricultural engineering students.
                    </p>
                    <a href="https://drive.google.com/drive/folders/14QucZErDJMF60tXB9YT4tOD1QdFszexU?usp=drive_link" 
                       target="_blank" class="resource-link">
                        <i class="fab fa-google-drive"></i>
                        <span>Access Software Collection</span>
                    </a>
                </div>
                
                <div class="resource-card">
                    <h3><i class="fas fa-briefcase"></i> Job & Career Resources</h3>
                    <p style="color: rgba(255,255,255,0.8); margin-bottom: 15px;">
                        Job opportunities, internship information, and career guidance.
                    </p>
                    <a href="https://drive.google.com/drive/folders/1V5xHqOf5V23ElI2oKk8yKe3Llv_UQlA1?usp=drive_link" 
                       target="_blank" class="resource-link">
                        <i class="fab fa-google-drive"></i>
                        <span>Explore Job Opportunities</span>
                    </a>
                </div>
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
    
    articles.forEach((article, index) => {
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
                <div class="article-actions">
                    <button class="eye-catchy-btn small-btn" onclick="readFullArticle(${index})">
                        <i class="fas fa-book-reader"></i> Read Full Article
                    </button>
                    <button class="eye-catchy-btn small-btn" onclick="saveArticle(${index})" style="background: linear-gradient(45deg, #27ae60, #2ecc71);">
                        <i class="fas fa-save"></i> Save
                    </button>
                    <button class="eye-catchy-btn small-btn" onclick="shareArticle(${index})" style="background: linear-gradient(45deg, #3498db, #2980b9);">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>`;
    });
    
    html += `
            </div>
            
            <!-- Additional Educational Articles -->
            <div class="articles-grid" style="margin-top: 40px;">
                <div class="article-card">
                    <h3>Precision Agriculture Technologies</h3>
                    <div style="margin: 10px 0;">
                        <span class="dept-badge dept-fpm" style="font-size: 12px;">Technology</span>
                        <span style="color: rgba(255,255,255,0.6); font-size: 12px; margin-left: 10px;">
                            <i class="fas fa-clock"></i> 6 min
                        </span>
                    </div>
                    <p>Learn about GPS guidance systems, yield monitoring, and variable rate technology that are revolutionizing modern farming...</p>
                    <button class="eye-catchy-btn small-btn" onclick="readArticleExtra('Precision Agriculture Technologies')">
                        <i class="fas fa-book-reader"></i> Read Article
                    </button>
                </div>
                
                <div class="article-card">
                    <h3>Renewable Energy in Agriculture</h3>
                    <div style="margin: 10px 0;">
                        <span class="dept-badge dept-fsee" style="font-size: 12px;">Energy</span>
                        <span style="color: rgba(255,255,255,0.6); font-size: 12px; margin-left: 10px;">
                            <i class="fas fa-clock"></i> 7 min
                        </span>
                    </div>
                    <p>Explore how solar, wind, and biomass energy can power farms and reduce dependence on fossil fuels...</p>
                    <button class="eye-catchy-btn small-btn" onclick="readArticleExtra('Renewable Energy in Agriculture')">
                        <i class="fas fa-book-reader"></i> Read Article
                    </button>
                </div>
                
                <div class="article-card">
                    <h3>Soil Conservation Methods</h3>
                    <div style="margin: 10px 0;">
                        <span class="dept-badge dept-iwm" style="font-size: 12px;">Environment</span>
                        <span style="color: rgba(255,255,255,0.6); font-size: 12px; margin-left: 10px;">
                            <i class="fas fa-clock"></i> 5 min
                        </span>
                    </div>
                    <p>Discover techniques to prevent soil erosion and maintain soil health for sustainable agriculture...</p>
                    <button class="eye-catchy-btn small-btn" onclick="readArticleExtra('Soil Conservation Methods')">
                        <i class="fas fa-book-reader"></i> Read Article
                    </button>
                </div>
            </div>
        </div>`;
    
    content.innerHTML = html;
}

function readFullArticle(index) {
    const article = articles[index];
    const content = document.getElementById('content');
    
    if (!content || !article) return;
    
    const html = `
        <div class="full-article-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color:#ff7eb3; margin: 0;">${article.title}</h2>
                <button onclick="showArticles()" class="eye-catchy-btn small-btn">
                    <i class="fas fa-arrow-left"></i> Back to Articles
                </button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <span class="dept-badge dept-csm">${article.category}</span>
                <span style="color: rgba(255,255,255,0.6); margin-left: 15px;">
                    <i class="fas fa-clock"></i> ${article.readTime} read
                </span>
                <span style="color: rgba(255,255,255,0.6); margin-left: 15px;">
                    <i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}
                </span>
            </div>
            
            <div class="article-full-content">
                ${article.fullContent}
            </div>
            
            <div style="margin-top: 40px; padding: 20px; background: rgba(255,126,179,0.1); border-radius: 10px;">
                <h4 style="color: #ffd700; margin-bottom: 15px;"><i class="fas fa-lightbulb"></i> Key Takeaways</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <h5 style="color: #ff7eb3; margin-bottom: 10px;"><i class="fas fa-chart-line"></i> Importance</h5>
                        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                            This topic is crucial for modern agricultural engineering practices.
                        </p>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <h5 style="color: #ff7eb3; margin-bottom: 10px;"><i class="fas fa-cogs"></i> Applications</h5>
                        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                            Practical applications in real-world agricultural scenarios.
                        </p>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px;">
                        <h5 style="color: #ff7eb3; margin-bottom: 10px;"><i class="fas fa-graduation-cap"></i> Learning Outcomes</h5>
                        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                            Enhanced understanding of key agricultural engineering concepts.
                        </p>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
                <button onclick="saveArticle(${index})" class="eye-catchy-btn">
                    <i class="fas fa-save"></i> Save Article
                </button>
                <button onclick="shareArticle(${index})" class="eye-catchy-btn" style="background: linear-gradient(45deg, #3498db, #2980b9);">
                    <i class="fas fa-share"></i> Share Article
                </button>
                <button onclick="printArticle('${article.title}')" class="eye-catchy-btn" style="background: linear-gradient(45deg, #9b59b6, #8e44ad);">
                    <i class="fas fa-print"></i> Print Article
                </button>
            </div>
            
            <!-- Related Articles -->
            <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1);">
                <h4 style="color: #ffd700; margin-bottom: 20px;"><i class="fas fa-book"></i> Related Articles</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    ${articles.filter((a, i) => i !== index).map(a => `
                        <div style="background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; cursor: pointer;" 
                             onclick="readFullArticle(${articles.indexOf(a)})">
                            <h5 style="color: #ff7eb3; margin-bottom: 10px;">${a.title}</h5>
                            <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 10px;">${a.content.substring(0, 100)}...</p>
                            <div style="display: flex; justify-content: space-between;">
                                <span class="dept-badge dept-csm" style="font-size: 11px;">${a.category}</span>
                                <span style="color: rgba(255,255,255,0.6); font-size: 11px;">${a.readTime}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    
    content.innerHTML = html;
}

function readArticleExtra(title) {
    alert(`Reading: ${title}\n\nFull article content will be available soon!`);
}

function saveArticle(index) {
    const article = articles[index];
    if (!article) return;
    
    let savedArticles = JSON.parse(localStorage.getItem('savedArticles') || '[]');
    if (!savedArticles.some(a => a.title === article.title)) {
        savedArticles.push({
            title: article.title,
            category: article.category,
            savedDate: new Date().toISOString()
        });
        localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
        showPopup('Article saved successfully!');
    } else {
        showPopup('Article already saved!');
    }
}

function shareArticle(index) {
    const article = articles[index];
    if (!article) return;
    
    const shareText = `Check out this article: ${article.title} on EduHub!`;
    if (navigator.share) {
        navigator.share({
            title: article.title,
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback
        navigator.clipboard.writeText(shareText);
        showPopup('Article link copied to clipboard!');
    }
}

function printArticle(title) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>${title} - EduHub</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
                    h1 { color: #333; }
                    h2 { color: #555; margin-top: 20px; }
                    ul { margin-left: 20px; }
                    .article-info { color: #666; margin-bottom: 20px; }
                    @media print {
                        body { padding: 0; }
                        button { display: none; }
                    }
                </style>
            </head>
            <body>
                <h1>${title}</h1>
                <div class="article-info">
                    Printed from EduHub • ${new Date().toLocaleString()}
                </div>
                ${document.querySelector('.article-full-content')?.innerHTML || ''}
                <div style="margin-top: 40px; text-align: center; color: #666;">
                    <hr>
                    <p>Printed from EduHub - Agricultural Engineering Hub</p>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    }
                </script>
            </body>
        </html>
    `);
}

// ==================== PUBLICATIONS SECTION ====================
function showPublications() {
    const content = document.getElementById('content');
    if (!content) return;
    
    let html = `
        <div class="publications-section">
            <h2 style="color:#ff7eb3; margin-bottom: 20px;">
                <i class="fas fa-file-alt"></i> Research Publications
            </h2>
            <p style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
                Research publications by the developer and team in international journals.
            </p>
            
            <div class="publications-grid">`;
    
    publications.forEach((pub, index) => {
        html += `
            <div class="publication-card">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <h3 style="color: #ffd700; font-size: 1.1rem; flex: 1;">${pub.title}</h3>
                    <span class="dept-badge dept-csm" style="font-size: 12px; white-space: nowrap;">${pub.year}</span>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <p style="color: rgba(255,255,255,0.9); font-size: 0.95rem; font-style: italic;">
                        ${pub.authors}
                    </p>
                    <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin: 5px 0;">
                        <i class="fas fa-book"></i> ${pub.journal}
                    </p>
                </div>
                
                <div style="background: rgba(255,126,179,0.1); padding: 10px; border-radius: 8px; margin: 10px 0; border-left: 3px solid #ff7eb3;">
                    <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                        ${pub.description}
                    </p>
                </div>
                
                <div style="margin-top: 10px;">
                    <h4 style="color: rgba(255,255,255,0.9); font-size: 0.9rem; margin-bottom: 5px;">
                        <i class="fas fa-info-circle"></i> Abstract:
                    </h4>
                    <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem; line-height: 1.5;">
                        ${pub.abstract}
                    </p>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <a href="${pub.doi}" target="_blank" class="eye-catchy-btn small-btn" style="text-decoration: none;">
                        <i class="fas fa-external-link-alt"></i> View Full Publication
                    </a>
                    <span style="color: rgba(255,255,255,0.6); font-size: 0.8rem;">
                        DOI: ${pub.doi.split('//')[1].substring(0, 30)}...
                    </span>
                </div>
                
                <div style="margin-top: 15px; padding: 10px; background: rgba(52, 152, 219, 0.1); border-radius: 5px; border-left: 3px solid #3498db;">
                    <p style="color: rgba(255,255,255,0.8); font-size: 0.85rem;">
                        <i class="fas fa-star"></i> <strong>Research Impact:</strong> Published in peer-reviewed journal with impact factor.
                    </p>
                </div>
            </div>`;
    });
    
    html += `
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(255,126,179,0.1); border-radius: 10px; border: 1px solid rgba(255,126,179,0.3);">
                <h4 style="color: #ffd700; margin-bottom: 10px;">
                    <i class="fas fa-info-circle"></i> About These Publications
                </h4>
                <p style="color: rgba(255,255,255,0.8);">
                    These are peer-reviewed research publications in international journals focusing on machine learning applications in agricultural engineering, 
                    specifically in reference evapotranspiration estimation. The research was conducted as part of academic studies at Bangladesh Agricultural University.
                </p>
                
                <div style="margin-top: 15px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                        <h5 style="color: #ff7eb3; font-size: 0.9rem;"><i class="fas fa-university"></i> Research Field</h5>
                        <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem;">Agricultural Engineering & Machine Learning</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                        <h5 style="color: #ff7eb3; font-size: 0.9rem;"><i class="fas fa-map-marker-alt"></i> Research Location</h5>
                        <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem;">Bangladesh Agricultural University</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 10px; border-radius: 5px;">
                        <h5 style="color: #ff7eb3; font-size: 0.9rem;"><i class="fas fa-calendar-alt"></i> Publication Period</h5>
                        <p style="color: rgba(255,255,255,0.7); font-size: 0.85rem;">2024 - 2025</p>
                    </div>
                </div>
            </div>
        </div>`;
    
    content.innerHTML = html;
}

// ==================== DIARY SECTION ====================
function showDiary() {
    const content = document.getElementById('content');
    if (!content) return;
    
    const savedDiary = localStorage.getItem('studyDiary') || '';
    
    const html = `
        <div class="diary-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color:#ff7eb3; margin: 0;">
                    <i class="fas fa-book"></i> Study Diary
                </h2>
                <div style="display: flex; gap: 10px;">
                    <button onclick="showDiaryHistory()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-history"></i> History
                    </button>
                    <button onclick="exportDiaryPDF()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 20px;">
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
                    <h4 style="color: #ffd700; margin-bottom: 15px;">
                        <i class="fas fa-edit"></i> Write Your Notes
                    </h4>
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
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px;">
                    <div style="background: rgba(46, 204, 113, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #2ecc71;">
                        <h5 style="color: #2ecc71; margin-bottom: 10px;">
                            <i class="fas fa-lightbulb"></i> Quick Tips
                        </h5>
                        <ul style="color: rgba(255,255,255,0.8); font-size: 0.9rem; padding-left: 20px;">
                            <li>Note down important formulas</li>
                            <li>Record practical experiment results</li>
                            <li>Write down questions for professors</li>
                            <li>Track your study progress</li>
                        </ul>
                    </div>
                    
                    <div style="background: rgba(52, 152, 219, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
                        <h5 style="color: #3498db; margin-bottom: 10px;">
                            <i class="fas fa-chart-line"></i> Statistics
                        </h5>
                        <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                            Word Count: <span id="word-count">${savedDiary.split(/\s+/).filter(word => word.length > 0).length}</span><br>
                            Character Count: <span id="char-count">${savedDiary.length}</span><br>
                            Last Updated: <span id="last-updated">${localStorage.getItem('diaryLastUpdated') || 'Never'}</span>
                        </p>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 20px; color: rgba(255,255,255,0.6); font-size: 14px;">
                <i class="fas fa-info-circle"></i> Your diary is automatically saved to your browser's local storage.
            </div>
        </div>`;
    
    content.innerHTML = html;
    
    // Update word and character count
    const diaryArea = document.getElementById('diary-area');
    if (diaryArea) {
        diaryArea.addEventListener('input', updateDiaryStats);
    }
}

function updateDiaryStats() {
    const diaryText = document.getElementById('diary-area')?.value || '';
    const wordCount = diaryText.split(/\s+/).filter(word => word.length > 0).length;
    const charCount = diaryText.length;
    
    const wordCountEl = document.getElementById('word-count');
    const charCountEl = document.getElementById('char-count');
    
    if (wordCountEl) wordCountEl.textContent = wordCount;
    if (charCountEl) charCountEl.textContent = charCount;
}

function saveDiary() {
    const diaryText = document.getElementById('diary-area')?.value || '';
    localStorage.setItem('studyDiary', diaryText);
    localStorage.setItem('diaryLastUpdated', new Date().toLocaleString());
    showPopup('Diary saved successfully!');
    
    // Update last updated display
    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = new Date().toLocaleString();
    }
}

function clearDiary() {
    if (confirm('Are you sure you want to clear your diary? This cannot be undone.')) {
        localStorage.removeItem('studyDiary');
        localStorage.removeItem('diaryLastUpdated');
        document.getElementById('diary-area').value = '';
        showPopup('Diary cleared!');
        updateDiaryStats();
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

function exportDiaryPDF() {
    alert('PDF export feature will be available soon!');
}

function showDiaryHistory() {
    alert('Diary history feature will be available soon!');
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
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color:#ff7eb3; margin: 0;">
                    <i class="fas fa-music"></i> Study Music Player
                </h2>
                <button onclick="showPlaylistSettings()" class="eye-catchy-btn small-btn">
                    <i class="fas fa-cog"></i> Settings
                </button>
            </div>
            
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                        <div style="width: 100px; height: 100px; background: linear-gradient(45deg, #ff7eb3, #ff6b6b); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-music fa-3x" style="color: white;"></i>
                        </div>
                        <div style="flex: 1;">
                            <h3 id="current-music-title" style="color: #ffd700; margin: 0 0 10px 0;">${musicPlaylist[currentMusicIndex]?.name || 'No Music'}</h3>
                            <p id="current-music-type" style="color: rgba(255,255,255,0.8); margin: 0;">
                                ${musicPlaylist[currentMusicIndex]?.type ? musicPlaylist[currentMusicIndex].type.charAt(0).toUpperCase() + musicPlaylist[currentMusicIndex].type.slice(1) : ''}
                            </p>
                            <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem; margin-top: 5px;">
                                <i class="fas fa-headphones"></i> Perfect for studying and concentration
                            </p>
                        </div>
                    </div>
                    
                    <div class="player-controls" style="margin-top: 20px;">
                        <button onclick="playPrevious()" class="eye-catchy-btn small-btn">
                            <i class="fas fa-step-backward"></i>
                        </button>
                        <button onclick="togglePlayPause()" id="play-pause-btn" class="eye-catchy-btn" style="padding: 12px 30px;">
                            <i class="fas fa-play"></i> Play
                        </button>
                        <button onclick="playNext()" class="eye-catchy-btn small-btn">
                            <i class="fas fa-step-forward"></i>
                        </button>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
                    <h4 style="color: #ffd700; margin-bottom: 15px;">
                        <i class="fas fa-volume-up"></i> Volume
                    </h4>
                    <input type="range" id="volume-slider" min="0" max="100" value="50" style="width: 100%;">
                    <div style="margin-top: 20px;">
                        <h4 style="color: #ffd700; margin-bottom: 10px;">
                            <i class="fas fa-clock"></i> Timer
                        </h4>
                        <select id="study-timer" class="movie-input" style="width: 100%;">
                            <option value="0">No Timer</option>
                            <option value="30">30 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="music-playlist">
                <h3 style="color: #ff7eb3; margin-bottom: 15px;">Playlist</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">`;
    
    musicPlaylist.forEach((music, index) => {
        html += `
            <div class="playlist-item ${index === currentMusicIndex ? 'active' : ''}" 
                 onclick="selectMusic(${index})">
                <div style="width: 60px; height: 60px; background: linear-gradient(45deg, ${index === currentMusicIndex ? '#ff7eb3' : '#3498db'}, ${index === currentMusicIndex ? '#ff6b6b' : '#2980b9'}); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 10px;">
                    <i class="fas fa-music"></i>
                </div>
                <h4 style="color: ${index === currentMusicIndex ? '#ffd700' : 'white'}; margin-bottom: 5px; font-size: 0.9rem;">
                    ${music.name}
                </h4>
                <p style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">
                    ${music.type.charAt(0).toUpperCase() + music.type.slice(1)}
                </p>
            </div>`;
    });
    
    html += `
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <h4 style="color: #ffd700; margin-bottom: 10px;">
                    <i class="fas fa-lightbulb"></i> Study Tips
                </h4>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                    • Background music can improve concentration by 15-20%<br>
                    • Take 5-minute breaks every 25 minutes<br>
                    • Stay hydrated while studying<br>
                    • Use noise-canceling headphones for better focus
                </p>
            </div>
        </div>`;
    
    content.innerHTML = html;
    
    // Add event listeners
    const volumeSlider = document.getElementById('volume-slider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            if (audioElement) {
                audioElement.volume = this.value / 100;
            }
        });
    }
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
            audioElement.volume = document.getElementById('volume-slider')?.value / 100 || 0.5;
            audioElement.play().catch(e => {
                console.error("Error playing audio:", e);
                window.open(music.url, '_blank');
            });
            isPlaying = true;
            btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
            
            // Start timer if set
            const timerSelect = document.getElementById('study-timer');
            if (timerSelect && timerSelect.value > 0) {
                setTimeout(() => {
                    if (audioElement) {
                        audioElement.pause();
                        isPlaying = false;
                        btn.innerHTML = '<i class="fas fa-play"></i> Play';
                        showPopup('Study timer completed! Take a break.');
                    }
                }, parseInt(timerSelect.value) * 60000);
            }
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
        const iconDiv = item.querySelector('div');
        const title = item.querySelector('h4');
        
        if (idx === index) {
            item.classList.add('active');
            if (iconDiv) iconDiv.style.background = 'linear-gradient(45deg, #ff7eb3, #ff6b6b)';
            if (title) title.style.color = '#ffd700';
        } else {
            item.classList.remove('active');
            if (iconDiv) iconDiv.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
            if (title) title.style.color = 'white';
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

function showPlaylistSettings() {
    alert('Playlist settings will be available soon!');
}

// ==================== MOVIES SECTION ====================
function showMovies() {
    const content = document.getElementById('content');
    if (!content) return;
    
    const html = `
        <div class="movies-section">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color:#ff7eb3; margin: 0;">
                    <i class="fas fa-film"></i> Educational Movies & Documentaries
                </h2>
                <button onclick="showMovieRecommendations()" class="eye-catchy-btn small-btn">
                    <i class="fas fa-star"></i> Recommendations
                </button>
            </div>
            
            <div style="color: rgba(255,255,255,0.8); margin-bottom: 30px;">
                Watch educational content related to agricultural engineering and technology. All videos open in YouTube.
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
                    <h4 style="color: #ffd700; margin-bottom: 15px;">
                        <i class="fas fa-search"></i> Search Content
                    </h4>
                    <div class="movies-search">
                        <input type="text" id="movie-search" class="movie-input" placeholder="Search for educational movies...">
                        <button onclick="searchMovie()" class="eye-catchy-btn">
                            <i class="fas fa-search"></i> Search
                        </button>
                    </div>
                    <div style="margin-top: 15px;">
                        <h5 style="color: #ff7eb3; font-size: 0.9rem; margin-bottom: 10px;">
                            <i class="fas fa-lightbulb"></i> Search Tips:
                        </h5>
                        <ul style="color: rgba(255,255,255,0.7); font-size: 0.85rem; padding-left: 20px;">
                            <li>Use specific keywords like "drip irrigation"</li>
                            <li>Add "documentary" for longer videos</li>
                            <li>Search in English for best results</li>
                            <li>Try different related terms</li>
                        </ul>
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px;">
                    <h4 style="color: #ffd700; margin-bottom: 15px;">
                        <i class="fas fa-filter"></i> Filter by Category
                    </h4>
                    <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                        <button onclick="filterMovies('agriculture')" class="eye-catchy-btn small-btn">Agriculture</button>
                        <button onclick="filterMovies('engineering')" class="eye-catchy-btn small-btn">Engineering</button>
                        <button onclick="filterMovies('technology')" class="eye-catchy-btn small-btn">Technology</button>
                        <button onclick="filterMovies('sustainability')" class="eye-catchy-btn small-btn">Sustainability</button>
                        <button onclick="filterMovies('irrigation')" class="eye-catchy-btn small-btn">Irrigation</button>
                        <button onclick="filterMovies('machinery')" class="eye-catchy-btn small-btn">Machinery</button>
                    </div>
                </div>
            </div>
            
            <div class="movies-list">
                <h3 style="color: #ffd700; margin-bottom: 15px;">Recommended Content</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; cursor: pointer;" 
                         onclick="openMovie('https://www.youtube.com/results?search_query=agricultural+engineering+documentary')">
                        <h4 style="color: #ff7eb3; margin-bottom: 10px;">
                            <i class="fas fa-tractor"></i> Agricultural Engineering Documentary
                        </h4>
                        <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 15px;">
                            Explore modern agricultural engineering practices and innovations in farming technology.
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <i class="fas fa-clock"></i> 45-60 min
                            </span>
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <i class="fas fa-eye"></i> Watch Now
                            </span>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; cursor: pointer;" 
                         onclick="openMovie('https://www.youtube.com/results?search_query=modern+irrigation+systems+technology')">
                        <h4 style="color: #ff7eb3; margin-bottom: 10px;">
                            <i class="fas fa-water"></i> Modern Irrigation Systems
                        </h4>
                        <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 15px;">
                            Learn about advanced irrigation technologies and water management systems.
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <i class="fas fa-clock"></i> 30-45 min
                            </span>
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <i class="fas fa-eye"></i> Watch Now
                            </span>
                        </div>
                    </div>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; cursor: pointer;" 
                         onclick="openMovie('https://www.youtube.com/results?search_query=sustainable+agriculture+techniques')">
                        <h4 style="color: #ff7eb3; margin-bottom: 10px;">
                            <i class="fas fa-leaf"></i> Sustainable Agriculture
                        </h4>
                        <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem; margin-bottom: 15px;">
                            Environmentally friendly farming methods and sustainable agricultural practices.
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <i class="fas fa-clock"></i> 50-65 min
                            </span>
                            <span style="color: rgba(255,255,255,0.6); font-size: 0.85rem;">
                                <i class="fas fa-eye"></i> Watch Now
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                <h4 style="color: #ffd700; margin-bottom: 10px;">
                    <i class="fas fa-info-circle"></i> How to Use This Section
                </h4>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">
                    • Click on any content card to search for related videos on YouTube<br>
                    • Use the search box to find specific topics<br>
                    • Filter by category for focused content<br>
                    • Videos open in new tabs for uninterrupted learning
                </p>
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
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm + ' agriculture engineering documentary')}`, '_blank');
    } else {
        showError('Please enter a search term!');
    }
}

function filterMovies(category) {
    const searchTerms = {
        'agriculture': 'modern agriculture techniques',
        'engineering': 'agricultural engineering innovations',
        'technology': 'agricultural technology 2024',
        'sustainability': 'sustainable farming practices',
        'irrigation': 'smart irrigation systems',
        'machinery': 'farm machinery technology'
    };
    
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerms[category] || category)}`, '_blank');
}

function openMovie(url) {
    window.open(url, '_blank');
}

function showMovieRecommendations() {
    const recommendations = [
        {title: "The Future of Farming", url: "https://www.youtube.com/results?search_query=future+of+farming+technology"},
        {title: "Precision Agriculture", url: "https://www.youtube.com/results?search_query=precision+agriculture+technology"},
        {title: "Water Conservation", url: "https://www.youtube.com/results?search_query=water+conservation+agriculture"}
    ];
    
    let message = "Recommended Educational Content:\n\n";
    recommendations.forEach((rec, index) => {
        message += `${index + 1}. ${rec.title}\n`;
    });
    message += "\nClick OK to open search results for the first recommendation.";
    
    if (confirm(message)) {
        window.open(recommendations[0].url, '_blank');
    }
}

// ==================== ENHANCED STATISTICS WITH CHARTS ====================
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
            <div class="stats-grid">
                <div class="stat-card">
                    <h4><i class="fas fa-users"></i> Total Users</h4>
                    <div class="stat-value">${userStats.totalUsers}</div>
                    <p>All registered users</p>
                </div>
                
                <div class="stat-card">
                    <h4><i class="fas fa-eye"></i> Active Now</h4>
                    <div class="stat-value">${userStats.activeUsers}</div>
                    <p>Currently active users</p>
                </div>
                
                <div class="stat-card">
                    <h4><i class="fas fa-calendar-day"></i> Today</h4>
                    <div class="stat-value">${userStats.todayUsers}</div>
                    <p>New users today</p>
                </div>
                
                <div class="stat-card">
                    <h4><i class="fas fa-graduation-cap"></i> Departments</h4>
                    <div class="stat-value">${Object.keys(userStats.departments).length}</div>
                    <p>Different departments</p>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="charts-section" style="margin-top: 30px;">
                <h4><i class="fas fa-chart-pie"></i> Department Distribution</h4>
                <div class="chart-container">
                    <canvas id="dept-distribution-chart" width="400" height="300"></canvas>
                </div>
                
                <h4 style="margin-top: 40px;"><i class="fas fa-chart-bar"></i> Daily Registrations (Last 7 Days)</h4>
                <div class="chart-container">
                    <canvas id="registration-chart" width="400" height="300"></canvas>
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
    
    // Initialize charts after DOM is rendered
    setTimeout(() => {
        updateDepartmentChart();
        updateRegistrationChart();
    }, 100);
}

// ==================== UPDATE DEPARTMENT CHART ====================
function updateDepartmentChart() {
    const ctx = document.getElementById('dept-distribution-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
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
        'OTHERS': '#95a5a6',
        'LEVEL 1': '#e67e22',
        'LEVEL 2': '#34495e'
    };
    
    const backgroundColors = departments.map(dept => colors[dept] || '#ff7eb3');
    
    deptChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: departments,
            datasets: [{
                data: counts,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#fff',
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleColor: '#ff7eb3',
                    bodyColor: '#fff'
                }
            }
        }
    });
}

// ==================== UPDATE REGISTRATION CHART ====================
function updateRegistrationChart() {
    const ctx = document.getElementById('registration-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
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
    
    regChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'New Registrations',
                data: data,
                backgroundColor: 'rgba(255, 126, 179, 0.5)',
                borderColor: '#ff7eb3',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff',
                        stepSize: 1
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
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
            
            <!-- Users List -->
            <div class="user-table-container">
                <table class="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>College</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>`;
    
    if (users.length === 0) {
        html += `<tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: rgba(255,255,255,0.6);">
                        <i class="fas fa-users fa-3x" style="margin-bottom: 20px;"></i>
                        <h3>No users registered yet</h3>
                    </td>
                </tr>`;
    } else {
        users.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .forEach(user => {
                const dept = user.department || 'Others';
                
                html += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.nickname || user.fullName}</td>
                        <td>${dept}</td>
                        <td>${user.college || 'Not specified'}</td>
                        <td>
                            <span style="color: ${user.isActive ? '#27ae60' : '#e74c3c'}">
                                ${user.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </td>
                        <td>
                            <button onclick="viewUserDetails('${user.id}')" class="eye-catchy-btn small-btn">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button onclick="deleteUser('${user.id}')" class="eye-catchy-btn small-btn" style="background: linear-gradient(45deg, #e74c3c, #c0392b);">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>`;
            });
    }
    
    html += `</tbody></table></div></div>`;
    content.innerHTML = html;
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
    modal.classList.add('show');
}

function closeUserDetails() {
    const modal = document.getElementById('user-details-modal');
    if (modal) {
        modal.classList.remove('show');
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
    trail.style.top = ePageY - 4 + 'px';
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

// ==================== PROFILE UPDATE FUNCTION (WITH DEPARTMENT & PASSWORD UPDATE) ====================
function showProfileUpdate() {
    console.log("📝 Opening profile update...");
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser || !currentUser.username) {
        alert('Please login first to update your profile.');
        return;
    }
    
    const user = registeredUsers[currentUser.username];
    if (!user) {
        alert('User information not found.');
        return;
    }
    
    const modal = document.getElementById('profile-update-modal');
    const formContainer = document.getElementById('profile-update-form');
    
    if (!modal || !formContainer) {
        console.error("❌ Modal or form container not found");
        alert('Profile update feature is not available.');
        return;
    }
    
    const formHTML = `
        <div class="profile-form-group">
            <label for="update-fullname"><i class="fas fa-user"></i> Full Name</label>
            <input type="text" id="update-fullname" value="${user.fullName || ''}" placeholder="Your full name">
        </div>
        
        <div class="profile-form-group">
            <label for="update-nickname"><i class="fas fa-signature"></i> Nickname</label>
            <input type="text" id="update-nickname" value="${user.nickname || ''}" placeholder="How should we greet you?">
        </div>
        
        <div class="profile-form-group">
            <label for="update-department"><i class="fas fa-university"></i> Department *</label>
            <select id="update-department" required>
                <option value="">Select Department</option>
                <option value="Level 1" ${user.department === 'Level 1' ? 'selected' : ''}>Level 1 (First Year)</option>
                <option value="Level 2" ${user.department === 'Level 2' ? 'selected' : ''}>Level 2 (Second Year)</option>
                <option value="CSM" ${user.department === 'CSM' ? 'selected' : ''}>CSM (Computer Science and Mathematics)</option>
                <option value="FPM" ${user.department === 'FPM' ? 'selected' : ''}>FPM (Farm Power and Machinery)</option>
                <option value="FSEE" ${user.department === 'FSEE' ? 'selected' : ''}>FSEE (Farm Structure and Environmental Engineering)</option>
                <option value="IWM" ${user.department === 'IWM' ? 'selected' : ''}>IWM (Irrigation and Water Management)</option>
                <option value="Others" ${user.department !== 'Level 1' && user.department !== 'Level 2' && user.department !== 'CSM' && user.department !== 'FPM' && user.department !== 'FSEE' && user.department !== 'IWM' ? 'selected' : ''}>Others</option>
            </select>
        </div>
        
        <div class="profile-form-group ${user.department !== 'Level 1' && user.department !== 'Level 2' && user.department !== 'CSM' && user.department !== 'FPM' && user.department !== 'FSEE' && user.department !== 'IWM' ? '' : 'hidden'}" id="update-other-department-group">
            <label for="update-other-department"><i class="fas fa-pen"></i> Specify Department</label>
            <input type="text" id="update-other-department" value="${user.department !== 'Level 1' && user.department !== 'Level 2' && user.department !== 'CSM' && user.department !== 'FPM' && user.department !== 'FSEE' && user.department !== 'IWM' ? user.department : ''}" placeholder="Please specify your department">
        </div>
        
        <div class="profile-form-group">
            <label for="update-email"><i class="fas fa-envelope"></i> Email</label>
            <input type="email" id="update-email" value="${user.email || ''}" placeholder="your.email@example.com">
        </div>
        
        <div class="profile-form-group">
            <label for="update-phone"><i class="fas fa-phone"></i> Phone</label>
            <input type="tel" id="update-phone" value="${user.phone || ''}" placeholder="+8801XXXXXXXXX">
        </div>
        
        <div class="profile-form-group">
            <label for="update-hometown"><i class="fas fa-home"></i> Hometown</label>
            <input type="text" id="update-hometown" value="${user.hometown || ''}" placeholder="Your hometown">
        </div>
        
        <div class="profile-form-group">
            <label for="update-hallname"><i class="fas fa-building"></i> Hall Name</label>
            <input type="text" id="update-hallname" value="${user.hallName || ''}" placeholder="Your hall/residence">
        </div>
        
        <div class="profile-form-group">
            <label for="update-supervisor"><i class="fas fa-user-tie"></i> Supervisor</label>
            <input type="text" id="update-supervisor" value="${user.supervisor || ''}" placeholder="Your supervisor's name">
        </div>
        
        <div class="profile-form-group">
            <label for="current-password"><i class="fas fa-lock"></i> Current Password (for verification)</label>
            <input type="password" id="current-password" placeholder="Enter current password to change password">
        </div>
        
        <div class="profile-form-group">
            <label for="new-password-profile"><i class="fas fa-key"></i> New Password (leave blank to keep current)</label>
            <input type="password" id="new-password-profile" placeholder="Enter new password">
        </div>
        
        <div class="profile-form-group">
            <label for="confirm-new-password-profile"><i class="fas fa-key"></i> Confirm New Password</label>
            <input type="password" id="confirm-new-password-profile" placeholder="Confirm new password">
        </div>
        
        <div class="recovery-security" style="margin-top: 20px;">
            <h4><i class="fas fa-shield-alt"></i> Security Note</h4>
            <p>Your ID, Registration No, and College cannot be changed for security reasons. 
               Contact admin if you need to update these fields.</p>
        </div>
        
        <div style="margin-top: 25px; display: flex; gap: 15px; justify-content: center;">
            <button onclick="saveProfileUpdate()" class="eye-catchy-btn" style="flex: 1;">
                <i class="fas fa-save"></i> Save Changes
            </button>
            <button onclick="closeProfileUpdate()" class="eye-catchy-btn" style="background: linear-gradient(45deg, #e74c3c, #c0392b); flex: 1;">
                <i class="fas fa-times"></i> Cancel
            </button>
        </div>
    `;
    
    formContainer.innerHTML = formHTML;
    modal.classList.add('show');
    
    // Add event listener for department select change
    const deptSelect = document.getElementById('update-department');
    const otherDeptGroup = document.getElementById('update-other-department-group');
    
    if (deptSelect && otherDeptGroup) {
        deptSelect.addEventListener('change', function() {
            if (this.value === 'Others') {
                otherDeptGroup.classList.remove('hidden');
            } else {
                otherDeptGroup.classList.add('hidden');
            }
        });
    }
    
    console.log("✅ Profile update modal shown with department and password update options");
}

async function saveProfileUpdate() {
    console.log("💾 Saving profile update...");
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userId = currentUser.username;
    
    if (!userId || !registeredUsers[userId]) {
        showError('User not found.');
        return;
    }
    
    // Get updated values
    const department = document.getElementById('update-department')?.value;
    const otherDepartment = document.getElementById('update-other-department')?.value.trim();
    const currentPassword = document.getElementById('current-password')?.value.trim();
    const newPassword = document.getElementById('new-password-profile')?.value.trim();
    const confirmNewPassword = document.getElementById('confirm-new-password-profile')?.value.trim();
    
    // Validate department
    if (!department) {
        showError('Department is required.');
        return;
    }
    
    const finalDept = department === 'Others' ? (otherDepartment || 'Others') : department;
    
    // Validate password change if attempted
    if (newPassword || confirmNewPassword || currentPassword) {
        if (!currentPassword) {
            showError('Please enter current password to change password.');
            return;
        }
        
        if (currentPassword !== registeredUsers[userId].password) {
            showError('Current password is incorrect.');
            return;
        }
        
        if (newPassword && newPassword !== confirmNewPassword) {
            showError('New passwords do not match.');
            return;
        }
        
        if (newPassword && newPassword.length < 6) {
            showError('New password must be at least 6 characters.');
            return;
        }
    }
    
    // Get other updated values
    const updates = {
        fullName: document.getElementById('update-fullname')?.value.trim() || registeredUsers[userId].fullName,
        nickname: document.getElementById('update-nickname')?.value.trim() || registeredUsers[userId].nickname,
        department: finalDept,
        email: document.getElementById('update-email')?.value.trim() || registeredUsers[userId].email,
        phone: document.getElementById('update-phone')?.value.trim() || registeredUsers[userId].phone,
        hometown: document.getElementById('update-hometown')?.value.trim() || registeredUsers[userId].hometown,
        hallName: document.getElementById('update-hallname')?.value.trim() || registeredUsers[userId].hallName,
        supervisor: document.getElementById('update-supervisor')?.value.trim() || registeredUsers[userId].supervisor
    };
    
    // Add password if changed
    if (newPassword) {
        updates.password = newPassword;
    }
    
    // Validate email if provided
    if (updates.email && !isValidEmail(updates.email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    // Update local storage
    registeredUsers[userId] = {
        ...registeredUsers[userId],
        ...updates
    };
    
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Update current user nickname if changed
    if (updates.nickname && currentUser.nickname !== updates.nickname) {
        currentUser.nickname = updates.nickname;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        currentUserNickname = updates.nickname;
        
        // Update welcome message
        setupTypingAnimation();
    }
    
    // Update current user department if changed
    if (updates.department && currentUser.department !== updates.department) {
        currentUser.department = updates.department;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    // Update Firebase
    if (db) {
        try {
            await db.collection('users').doc(userId).update(updates);
            console.log('✅ Profile updated in Firebase');
        } catch (error) {
            console.error('❌ Error updating profile in Firebase:', error);
        }
    }
    
    showPopup('Profile updated successfully!');
    closeProfileUpdate();
    
    // Check if department is valid
    const validDepartments = ['CSM', 'FPM', 'FSEE', 'IWM', 'Level 1', 'Level 2', 'LEVEL 1', 'LEVEL 2'];
    const userDept = (updates.department || '').toUpperCase();
    const isValidDept = validDepartments.some(dept => userDept === dept.toUpperCase());
    
    if (!isValidDept && updates.department !== 'Others') {
        // Show department update notification again
        setTimeout(() => {
            showDepartmentNotification();
        }, 1000);
    } else {
        // Remove department notification if it exists
        dismissDepartmentNotification();
    }
}

function closeProfileUpdate() {
    const modal = document.getElementById('profile-update-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== PASSWORD RECOVERY FUNCTIONS ====================
function showEnhancedRecovery() {
    const modal = document.getElementById('enhanced-recovery-modal');
    const container = document.getElementById('recovery-form-container');
    
    if (!modal || !container) return;
    
    recoveryUserId = '';
    recoveryOTP = '';
    
    const formHTML = `
        <div class="recovery-step active" id="step1">
            <h4 style="color: #ff7eb3; text-align: center; margin-bottom: 20px;">
                <i class="fas fa-search"></i> Step 1: Verify Your Account
            </h4>
            
            <div class="recovery-input-group">
                <label for="recovery-user-id"><i class="fas fa-id-card"></i> Enter Your 7-digit ID</label>
                <input type="text" id="recovery-user-id" placeholder="e.g., 2105056" maxlength="7">
            </div>
            
            <div class="recovery-input-group">
                <label for="recovery-email"><i class="fas fa-envelope"></i> Enter Registered Email</label>
                <input type="email" id="recovery-email" placeholder="email@example.com">
            </div>
            
            <button onclick="verifyRecoveryDetails()" class="eye-catchy-btn" style="width: 100%; margin-top: 20px;">
                <i class="fas fa-arrow-right"></i> Verify & Continue
            </button>
        </div>
        
        <div class="recovery-step" id="step2">
            <div class="recovery-spinner" id="recovery-spinner">
                <div class="spinner"></div>
                <p>Sending verification email...</p>
            </div>
            
            <div id="otp-section" style="display: none;">
                <h4 style="color: #ff7eb3; text-align: center; margin-bottom: 20px;">
                    <i class="fas fa-envelope"></i> Step 2: Enter OTP
                </h4>
                
                <div class="recovery-input-group">
                    <label for="recovery-otp"><i class="fas fa-key"></i> Enter 6-digit OTP sent to your email</label>
                    <input type="text" id="recovery-otp" placeholder="123456" maxlength="6">
                </div>
                
                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button onclick="resendRecoveryOTP()" class="eye-catchy-btn" style="flex: 1; background: linear-gradient(45deg, #667eea, #764ba2);">
                        <i class="fas fa-redo"></i> Resend OTP
                    </button>
                    <button onclick="verifyRecoveryOTP()" class="eye-catchy-btn" style="flex: 2;">
                        <i class="fas fa-check"></i> Verify OTP
                    </button>
                </div>
            </div>
        </div>
        
        <div class="recovery-step" id="step3">
            <h4 style="color: #ff7eb3; text-align: center; margin-bottom: 20px;">
                <i class="fas fa-unlock"></i> Step 3: Reset Password
            </h4>
            
            <div class="recovery-input-group">
                <label for="new-password"><i class="fas fa-lock"></i> New Password</label>
                <input type="password" id="new-password" placeholder="Enter new password">
            </div>
            
            <div class="recovery-input-group">
                <label for="confirm-new-password"><i class="fas fa-lock"></i> Confirm New Password</label>
                <input type="password" id="confirm-new-password" placeholder="Confirm new password">
            </div>
            
            <div class="recovery-security">
                <h4><i class="fas fa-shield-alt"></i> Password Requirements</h4>
                <p>• At least 6 characters<br>• Include letters and numbers<br>• Don't use common passwords</p>
            </div>
            
            <button onclick="resetPasswordFinal()" class="eye-catchy-btn" style="width: 100%; margin-top: 20px;">
                <i class="fas fa-save"></i> Reset Password
            </button>
        </div>
    `;
    
    container.innerHTML = formHTML;
    modal.classList.add('show');
}

function verifyRecoveryDetails() {
    const userId = document.getElementById('recovery-user-id')?.value.trim();
    const email = document.getElementById('recovery-email')?.value.trim();
    
    if (!userId || !email) {
        alert('Please fill in both fields.');
        return;
    }
    
    if (!/^\d{7}$/.test(userId)) {
        alert('ID must be exactly 7 digits.');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    const user = registeredUsers[userId];
    
    if (!user) {
        alert('User ID not found.');
        return;
    }
    
    if (user.email !== email) {
        alert('Email does not match registered email.');
        return;
    }
    
    // Store for later use
    recoveryUserId = userId;
    
    // Show step 2
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    
    // Show spinner
    const spinner = document.getElementById('recovery-spinner');
    const otpSection = document.getElementById('otp-section');
    
    if (spinner) spinner.style.display = 'block';
    if (otpSection) otpSection.style.display = 'none';
    
    // Simulate OTP sending (in real app, you'd send actual email)
    setTimeout(() => {
        if (spinner) spinner.style.display = 'none';
        if (otpSection) otpSection.style.display = 'block';
        
        // Generate random 6-digit OTP
        recoveryOTP = Math.floor(100000 + Math.random() * 900000).toString();
        
        // In real app, send this OTP to user's email
        console.log(`OTP for ${userId}: ${recoveryOTP}`);
        alert(`For demo: OTP sent to ${email} (Check console for OTP: ${recoveryOTP})`);
    }, 2000);
}

function verifyRecoveryOTP() {
    const enteredOTP = document.getElementById('recovery-otp')?.value.trim();
    
    if (!enteredOTP || enteredOTP.length !== 6) {
        alert('Please enter the 6-digit OTP.');
        return;
    }
    
    if (enteredOTP !== recoveryOTP) {
        alert('Invalid OTP. Please try again.');
        return;
    }
    
    // OTP verified, show step 3
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
}

async function resetPasswordFinal() {
    const newPassword = document.getElementById('new-password')?.value.trim();
    const confirmPassword = document.getElementById('confirm-new-password')?.value.trim();
    
    if (!newPassword || !confirmPassword) {
        alert('Please fill in both password fields.');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    // Update password in local storage
    if (registeredUsers[recoveryUserId]) {
        registeredUsers[recoveryUserId].password = newPassword;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        
        // Update Firebase
        if (db) {
            try {
                await db.collection('users').doc(recoveryUserId).update({
                    password: newPassword,
                    lastPasswordUpdate: new Date().toISOString()
                });
                console.log('✅ Password updated in Firebase');
            } catch (error) {
                console.error('❌ Error updating password in Firebase:', error);
            }
        }
        
        alert('Password reset successfully! You can now login with your new password.');
        closeEnhancedRecovery();
        
        // Go back to login
        toggleAuthForm('login');
    } else {
        alert('User not found.');
    }
}

function resendRecoveryOTP() {
    // Generate new OTP
    recoveryOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`New OTP for ${recoveryUserId}: ${recoveryOTP}`);
    
    alert('New OTP sent to your email.');
    
    // Clear OTP input
    const otpInput = document.getElementById('recovery-otp');
    if (otpInput) otpInput.value = '';
}

function closeEnhancedRecovery() {
    const modal = document.getElementById('enhanced-recovery-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== INSTRUCTIONS FUNCTION (FIXED) ====================
function showInstructions() {
    console.log("📚 Opening instructions...");
    
    const modal = document.getElementById('instructions-modal');
    const container = document.querySelector('.instructions-content');
    
    if (!modal || !container) {
        console.error("❌ Instructions modal not found");
        alert('Instructions feature is not available.');
        return;
    }
    
    const instructionsHTML = `
        <div class="instructions-section">
            <h4><i class="fas fa-sign-in-alt"></i> Registration & Login</h4>
            <ul>
                <li>Use your 7-digit student ID to register</li>
                <li>Remember your password for future logins</li>
                <li>All fields with * are required</li>
                <li>Use the "Forgot Password" feature if needed</li>
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4><i class="fas fa-graduation-cap"></i> Course Materials</h4>
            <ul>
                <li>Click on any course card to access materials</li>
                <li>Materials are organized by semester</li>
                <li>Use Google Drive links to view/download</li>
                <li>Check both common and departmental credits</li>
                <li>Access Software and Job sections for additional resources</li>
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4><i class="fas fa-book"></i> Study Diary</h4>
            <ul>
                <li>Your diary is saved automatically in your browser</li>
                <li>Use it for notes, ideas, and study plans</li>
                <li>Download your diary for backup</li>
                <li>Diary is private and only you can see it</li>
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4><i class="fas fa-chart-line"></i> User Statistics</h4>
            <ul>
                <li>Total Users: Count of all registered users</li>
                <li>Active Now: Users currently logged in</li>
                <li>Today: New registrations today</li>
                <li>Admin can view detailed statistics</li>
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4><i class="fas fa-headphones"></i> Music & Movies</h4>
            <ul>
                <li>Music player helps with concentration</li>
                <li>Movies section has educational content</li>
                <li>All external links open in new tabs</li>
                <li>Use search to find specific content</li>
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4><i class="fas fa-user-edit"></i> Profile Management</h4>
            <ul>
                <li>Use "Update Info" to change your personal details</li>
                <li>You can update your department anytime</li>
                <li>You can change your password anytime</li>
                <li>ID and Registration No cannot be changed</li>
                <li>Contact admin for major changes</li>
            </ul>
        </div>
        
        <div class="instructions-section">
            <h4><i class="fas fa-file-alt"></i> Research Publications</h4>
            <ul>
                <li>Access research publications by the developer</li>
                <li>Publications are in international journals</li>
                <li>Click on DOI links to view full papers</li>
                <li>Publications focus on machine learning in agriculture</li>
            </ul>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: rgba(255, 126, 179, 0.1); border-radius: 10px;">
            <h4 style="color: #ffd700;"><i class="fas fa-exclamation-circle"></i> Important Notes</h4>
            <ul>
                <li>Your data is secure and won't be reset</li>
                <li>Use "Update Info" to change your details</li>
                <li>Update your department when moving to higher levels</li>
                <li>Logout when using shared computers</li>
                <li>User tracking is active and won't reset</li>
            </ul>
        </div>
    `;
    
    container.innerHTML = instructionsHTML;
    modal.classList.add('show');
    console.log("✅ Instructions modal shown");
}

function closeInstructions() {
    const modal = document.getElementById('instructions-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

// ==================== FIRST TIME VISITOR NOTIFICATION ====================
function checkFirstTimeVisitor() {
    const hasVisited = localStorage.getItem('hasVisitedEduHub');
    
    if (!hasVisited && currentUserRole !== 'admin') {
        // Show notification after 2 seconds
        setTimeout(() => {
            const notification = document.getElementById('first-time-notification');
            if (notification) {
                notification.classList.add('show');
            }
        }, 2000);
        
        localStorage.setItem('hasVisitedEduHub', 'true');
    }
}

function dismissNotification() {
    const notification = document.getElementById('first-time-notification');
    if (notification) {
        notification.classList.remove('show');
    }
}

// ==================== HELPER FUNCTIONS ====================
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function closeAllModals() {
    document.querySelectorAll('.modal.show').forEach(modal => {
        modal.classList.remove('show');
    });
    
    const notification = document.getElementById('first-time-notification');
    if (notification && notification.classList.contains('show')) {
        notification.classList.remove('show');
    }
    
    const deptNotification = document.getElementById('department-notification');
    if (deptNotification && deptNotification.classList.contains('show')) {
        deptNotification.remove();
    }
}

// ==================== ADMIN PANEL FUNCTIONS ====================
function closeAdminPanel() {
    const modal = document.getElementById('admin-panel-modal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function syncAllData() {
    syncUserToFirebase();
    showPopup('All data synced with Firebase!');
}

function resetTodayCount() {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }
    
    if (confirm("Are you sure you want to reset today's user count?")) {
        userStats.todayUsers = 0;
        updateUserStatsDisplay();
        showPopup("Today's count reset successfully!");
    }
}

function exportUserData() {
    if (currentUserRole !== 'admin') {
        alert("Access Denied! Admin Only Feature.");
        return;
    }
    
    const dataStr = JSON.stringify(registeredUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `eduhub-users-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showPopup('User data exported successfully!');
}