// =====================================================================
// features.js — EduHub AET New Features
// Community Q&A, Photo Gallery, Study Abroad, Class Routine, Doc Upload
// This file extends script.js without modifying it.
// =====================================================================

// ==================== HELPER: SHOW CONTENT OVERRIDE ====================
// Patch showContent to support new sections
const _origShowContent = window.showContent;
window.showContent = function(section) {
    // Highlight active nav btn
    document.querySelectorAll('.main-nav .nav-btn').forEach(b => b.classList.remove('active-nav'));
    const btns = document.querySelectorAll('.main-nav .nav-btn');
    btns.forEach(b => { if(b.getAttribute('onclick') && b.getAttribute('onclick').includes(`'${section}'`)) b.classList.add('active-nav'); });

    switch(section) {
        case 'community':  showCommunity();  break;
        case 'gallery':    showGallery();    break;
        case 'abroad':     showStudyAbroad(); break;
        case 'routine':    showRoutine();    break;
        default:
            if(_origShowContent) _origShowContent(section);
    }
};

// ==================== PASSWORD TOGGLE ====================
function togglePw(inputId, icon) {
    const inp = document.getElementById(inputId);
    if (!inp) return;
    if (inp.type === 'password') {
        inp.type = 'text';
        icon.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        inp.type = 'password';
        icon.innerHTML = '<i class="fas fa-eye"></i>';
    }
}

// ==================== CLOSE IMAGE PREVIEW ====================
function closeImagePreview() {
    const m = document.getElementById('image-preview-modal');
    if(m) m.classList.add('hidden');
}
function openImagePreview(url) {
    const m = document.getElementById('image-preview-modal');
    const img = document.getElementById('preview-img-el');
    if(m && img) { img.src = url; m.classList.remove('hidden'); }
}

// ==================== CLASS ROUTINE ====================
function showRoutine() {
    const content = document.getElementById('content');
    if(!content) return;

    const routineData = {
        header: {
            faculty: "Faculty of Agricultural Engineering & Technology",
            university: "Bangladesh Agricultural University, Mymensingh",
            program: "B.Sc. Agril. Engg.",
            level: "Level-4, Semester-2 (July-December/24)",
            classStarts: "07.12.2025",
            classCeases: "13.03.2026",
            finalExam: "22.03.2026 – 23.04.2026",
            dean: "Professor Dr. Md. Abdul Mojid"
        },
        sets: {
            "B": "FPM — B₁: 2105002-045, B₂: 2105046-2105092",
            "C": "FSEE — 21 students",
            "D": "IWM — 20 students"
        },
        schedule: [
            {
                day: "Sunday",
                classes: [
                    { time: "8:00–8:55", set: "B₁", course: "FPM 4222 Testing & Standardization", dept: "FPM" },
                    { time: "8:00–8:55", set: "B₂", course: "FPM 4216 Design & Fabrication", dept: "FPM" },
                    { time: "8:00–10:55", set: "C", course: "FSEE 4222 Computer Aided Analysis & Design of Structure Set-C", dept: "FSEE" },
                    { time: "8:00–10:55", set: "D", course: "IWM 4220 Hydro Systems Modeling Set-D", dept: "IWM" },
                    { time: "11:00–11:55", set: "All", course: "FSEE 4217 Disaster Management", dept: "FSEE" },
                    { time: "11:00–11:55", set: "All", course: "FPM 4221 Testing & Standardization of Agril...", dept: "FPM" },
                    { time: "11:00–11:55", set: "D", course: "IWM 4221 Irrigation System Design", dept: "IWM" },
                    { time: "12:00–12:55", set: "All", course: "FSEE 4213 Rural Housing", dept: "FSEE" },
                    { time: "12:00–12:55", set: "All", course: "FPM 4215 Machine Design", dept: "FPM" },
                    { time: "12:00–12:55", set: "D", course: "IWM 4217 Ground Water Technology", dept: "IWM" },
                    { time: "2:30–3:25", set: "All", course: "FSEE 4211 Environmental Impact Assessment", dept: "FSEE" },
                    { time: "3:30–4:25", set: "All", course: "IWM 4215 Drainage & Reclamation Engg.", dept: "IWM" },
                ]
            },
            {
                day: "Monday",
                classes: [
                    { time: "8:00–10:55", set: "C", course: "FSEE 4216 Water Supply and Sanitation Set-C", dept: "FSEE" },
                    { time: "8:00–10:55", set: "D", course: "IWM 4218 Ground Water and Well (D)", dept: "IWM" },
                    { time: "11:00–11:55", set: "All", course: "FSEE4227 Rural Engineering", dept: "FSEE" },
                    { time: "11:00–11:55", set: "All", course: "FPM 4215 Machine Design", dept: "FPM" },
                    { time: "11:00–11:55", set: "D", course: "IWM 4229 On-Farm Water Management", dept: "IWM" },
                    { time: "12:00–12:55", set: "All", course: "FSEE 4213 Rural Housing", dept: "FSEE" },
                    { time: "12:00–12:55", set: "All", course: "FPM 4213 Non-Destructive Technique", dept: "FPM" },
                    { time: "12:00–12:55", set: "D", course: "IWM 4221 Irrigation System Design", dept: "IWM" },
                    { time: "2:30–3:25", set: "All", course: "FPM 4211 Renewable Energy", dept: "FPM" },
                    { time: "3:30–4:25", set: "All", course: "FSEE 4211 Environmental Impact Assessment", dept: "FSEE" },
                ]
            },
            {
                day: "Tuesday",
                classes: [
                    { time: "8:00–10:55", set: "B₁", course: "FPM 4216 Design & Fabrication", dept: "FPM" },
                    { time: "8:00–10:55", set: "D", course: "IWM 4230 On-Farm Water Management (D)", dept: "IWM" },
                    { time: "11:00–11:55", set: "All", course: "FSEE 4215 Water Supply and Sanitation", dept: "FSEE" },
                    { time: "11:00–11:55", set: "All", course: "FPM 4219 Engineering Properties of Agricultural Product", dept: "FPM" },
                    { time: "12:00–12:55", set: "All", course: "FSEE4227 Rural Engineering", dept: "FSEE" },
                    { time: "12:00–12:55", set: "All", course: "FPM 4215 Machine Design", dept: "FPM" },
                    { time: "12:00–12:55", set: "All", course: "IWM 4219 Hydro Systems Modeling", dept: "IWM" },
                    { time: "2:30–3:25", set: "All", course: "IWM 4215 Drainage & Reclamation Engg.", dept: "IWM" },
                    { time: "3:30–4:25", set: "All", course: "FPM 4211 Renewable Energy", dept: "FPM" },
                ]
            },
            {
                day: "Wednesday",
                classes: [
                    { time: "8:00–10:55", set: "B₂", course: "FPM 4218 Robotics and Intel..", dept: "FPM" },
                    { time: "8:00–10:55", set: "B₂", course: "FPM 4222 Testing and..", dept: "FPM" },
                    { time: "11:00–11:55", set: "All", course: "FSEE 4225 Applied Soil Mechanics", dept: "FSEE" },
                    { time: "11:00–11:55", set: "All", course: "FPM 4217 Robotics & Intelligent Systems", dept: "FPM" },
                    { time: "11:00–11:55", set: "D", course: "IWM 4217 Ground Water and Well Technology", dept: "IWM" },
                    { time: "12:00–12:55", set: "All", course: "FSEE 4215 Water Supply and Sanitation", dept: "FSEE" },
                    { time: "12:00–12:55", set: "All", course: "FPM 4213 Non-Destructive Bio-Sensing Technique", dept: "FPM" },
                    { time: "12:00–12:55", set: "D", course: "IWM 4229 On-Farm Water Management", dept: "IWM" },
                ]
            },
            {
                day: "Thursday",
                classes: [
                    { time: "8:00–10:55", set: "B₂", course: "FPM 4218 Robotics and Intel..", dept: "FPM" },
                    { time: "11:00–11:55", set: "All", course: "FSEE 4217 Disaster Management", dept: "FSEE" },
                    { time: "12:00–12:55", set: "All", course: "FSEE 4225 Applied Soil Mechanics", dept: "FSEE" },
                    { time: "12:00–12:55", set: "All", course: "FPM 4219 Engineering Properties", dept: "FPM" },
                ]
            }
        ],
        courses: {
            FPM: [
                { no: "FPM 4211", credit: 2 }, { no: "FPM 4213", credit: 2 }, { no: "FPM 4215", credit: 3 },
                { no: "FPM 4216", credit: 1 }, { no: "FPM 4217", credit: 2 }, { no: "FPM 4218", credit: 2 },
                { no: "FPM 4219", credit: 2 }, { no: "FPM 4221", credit: 1 }, { no: "FPM 4222", credit: 2 },
                { no: "AET 4202", credit: 2 }
            ],
            FSEE: [
                { no: "FSEE 4211", credit: 2 }, { no: "FSEE 4213", credit: 2 }, { no: "FSEE 4215", credit: 2 },
                { no: "FSEE 4216", credit: 1 }, { no: "FSEE 4217", credit: 2 }, { no: "FSEE4227", credit: 1 },
                { no: "FSEE 4222", credit: 2 }, { no: "FSEE 4225", credit: 2 }
            ],
            IWM: [
                { no: "IWM 4215", credit: 2 }, { no: "IWM 4217", credit: 2 }, { no: "IWM 4218", credit: 1 },
                { no: "IWM 4219", credit: 1 }, { no: "IWM 4220", credit: 1 }, { no: "IWM 4221", credit: 2 },
                { no: "IWM 4229", credit: 2 }, { no: "IWM 4230", credit: 1 }
            ]
        }
    };

    const deptColors = { FPM: '#ff7eb3', FSEE: '#00ffc8', IWM: '#ffd700' };
    let html = `
    <div class="routine-section">
        <div class="routine-header">
            <h2><i class="fas fa-calendar-alt"></i> Class Routine</h2>
            <div class="routine-meta">
                <span><i class="fas fa-university"></i> ${routineData.header.faculty}</span>
                <span><i class="fas fa-layer-group"></i> ${routineData.header.level}</span>
                <span><i class="fas fa-chalkboard-teacher"></i> Dean: ${routineData.header.dean}</span>
            </div>
            <div class="routine-dates">
                <span><i class="fas fa-play-circle"></i> Class Starts: ${routineData.header.classStarts}</span>
                <span><i class="fas fa-stop-circle"></i> Class Ceases: ${routineData.header.classCeases}</span>
                <span><i class="fas fa-pen"></i> Final Exam: ${routineData.header.finalExam}</span>
            </div>
            <p style="color:#ffd700;font-size:0.85rem;margin-top:10px;">
                <i class="fas fa-info-circle"></i> Theory Class: Gallery-1 (Common Courses), Dept: FSEE-19, FPM-119, IWM-120 | Practical: Respective Lab
            </p>
        </div>

        <!-- Set Legend -->
        <div class="routine-sets">
            <h4 style="color:#ff7eb3;margin-bottom:15px;"><i class="fas fa-users"></i> Department Sets</h4>
            <div class="sets-grid">
                ${Object.entries(routineData.sets).map(([set, info]) => `
                    <div class="set-card">
                        <div class="set-label">Set ${set}</div>
                        <div class="set-info">${info}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <!-- Filter -->
        <div class="routine-filter">
            <button class="filter-btn active" onclick="filterRoutine('All', this)">All Departments</button>
            <button class="filter-btn fpm-filter" onclick="filterRoutine('FPM', this)">FPM</button>
            <button class="filter-btn fsee-filter" onclick="filterRoutine('FSEE', this)">FSEE</button>
            <button class="filter-btn iwm-filter" onclick="filterRoutine('IWM', this)">IWM</button>
        </div>

        <!-- Schedule -->
        <div id="routine-schedule">
        ${routineData.schedule.map(day => `
            <div class="routine-day">
                <div class="day-header">${day.day}</div>
                <div class="day-classes">
                    ${day.classes.map(cls => `
                        <div class="class-item dept-item-${cls.dept.toLowerCase()}" data-dept="${cls.dept}">
                            <div class="class-time"><i class="fas fa-clock"></i> ${cls.time}</div>
                            <div class="class-name">${cls.course}</div>
                            <div class="class-meta">
                                <span class="dept-pill" style="background:${deptColors[cls.dept] || '#ff7eb3'}22;color:${deptColors[cls.dept] || '#ff7eb3'};border:1px solid ${deptColors[cls.dept] || '#ff7eb3'};">${cls.dept}</span>
                                ${cls.set !== 'All' ? `<span class="set-pill">Set ${cls.set}</span>` : '<span class="set-pill all-sets">All Sets</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('')}
        </div>

        <!-- Course List -->
        <div class="routine-course-list">
            <h4 style="color:#ff7eb3;margin:20px 0 15px;"><i class="fas fa-list"></i> Enrolled Courses by Department</h4>
            <div class="course-dept-grid">
                ${Object.entries(routineData.courses).map(([dept, courses]) => `
                    <div class="course-dept-card" style="border-top:3px solid ${deptColors[dept] || '#ff7eb3'};">
                        <h5 style="color:${deptColors[dept] || '#ff7eb3'};">${dept}</h5>
                        ${courses.map(c => `<div class="course-pill">${c.no} (${c.credit} cr)</div>`).join('')}
                    </div>
                `).join('')}
            </div>
        </div>
    </div>`;

    content.innerHTML = html;
}

function filterRoutine(dept, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.class-item').forEach(item => {
        if (dept === 'All' || item.dataset.dept === dept) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ==================== COMMUNITY Q&A ====================
function showCommunity() {
    const content = document.getElementById('content');
    if(!content) return;

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    content.innerHTML = `
    <div class="community-section">
        <div class="section-header">
            <h2><i class="fas fa-comments"></i> Community Q&amp;A</h2>
            <p class="section-subtitle">Ask questions, share knowledge, discuss — your academic social space</p>
        </div>

        <!-- New Post -->
        <div class="new-post-card">
            <div class="post-avatar"><i class="fas fa-user-circle"></i></div>
            <div class="post-input-area">
                <textarea id="community-post-text" placeholder="Ask a question or share something with your classmates..." rows="3"></textarea>
                <div class="post-options">
                    <select id="post-category" class="post-select">
                        <option value="Question">❓ Question</option>
                        <option value="Discussion">💬 Discussion</option>
                        <option value="Resource">📎 Resource Share</option>
                        <option value="Announcement">📢 Announcement</option>
                        <option value="Other">🌀 Other</option>
                    </select>
                    <select id="post-dept-tag" class="post-select">
                        <option value="General">General</option>
                        <option value="FPM">FPM</option>
                        <option value="FSEE">FSEE</option>
                        <option value="IWM">IWM</option>
                        <option value="Level 1">Level 1</option>
                        <option value="Level 2">Level 2</option>
                    </select>
                    <button onclick="submitCommunityPost()" class="eye-catchy-btn small-btn">
                        <i class="fas fa-paper-plane"></i> Post
                    </button>
                </div>
            </div>
        </div>

        <!-- Search/Filter -->
        <div class="community-filter">
            <input type="text" id="community-search" placeholder="🔍 Search posts..." oninput="filterCommunityPosts()" class="community-search-input">
            <div class="filter-tabs">
                <button class="filter-tab active" onclick="loadCommunityPosts('all', this)">All</button>
                <button class="filter-tab" onclick="loadCommunityPosts('Question', this)">Questions</button>
                <button class="filter-tab" onclick="loadCommunityPosts('Discussion', this)">Discussions</button>
                <button class="filter-tab" onclick="loadCommunityPosts('Resource', this)">Resources</button>
            </div>
        </div>

        <!-- Posts Feed -->
        <div id="community-posts-feed" class="posts-feed">
            <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading posts...</div>
        </div>
    </div>`;

    loadCommunityPosts('all');
}

async function submitCommunityPost() {
    const text = document.getElementById('community-post-text')?.value.trim();
    const category = document.getElementById('post-category')?.value;
    const deptTag = document.getElementById('post-dept-tag')?.value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if (!text) { showPopup('Please write something before posting.'); return; }
    if (!currentUser.username) { showPopup('Please login first.'); return; }

    const nickname = currentUser.nickname || currentUser.username;

    const post = {
        userId: currentUser.username,
        nickname: nickname,
        text: text,
        category: category,
        deptTag: deptTag,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        likes: [],
        commentCount: 0
    };

    try {
        if(db) {
            await db.collection('communityPosts').add(post);
        }
        document.getElementById('community-post-text').value = '';
        showPopup('Post submitted successfully!');
        loadCommunityPosts('all');
    } catch(e) {
        console.error(e);
        showPopup('Error submitting post. Please try again.');
    }
}

let _communityFilter = 'all';
async function loadCommunityPosts(filter, btn) {
    _communityFilter = filter;
    if(btn) {
        document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const feed = document.getElementById('community-posts-feed');
    if(!feed) return;
    feed.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    try {
        if(!db) { feed.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;">Could not connect to database.</p>'; return; }
        let query = db.collection('communityPosts').orderBy('timestamp', 'desc').limit(50);
        if(filter !== 'all') query = db.collection('communityPosts').where('category', '==', filter).orderBy('timestamp', 'desc').limit(50);

        const snap = await query.get();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const posts = [];
        snap.forEach(doc => posts.push({ id: doc.id, ...doc.data() }));

        if(posts.length === 0) {
            feed.innerHTML = '<div class="empty-state"><i class="fas fa-comments fa-3x"></i><p>No posts yet. Be the first to start a discussion!</p></div>';
            return;
        }

        const catEmoji = { Question:'❓', Discussion:'💬', Resource:'📎', Announcement:'📢', Other:'🌀' };
        const deptColors = { FPM:'#ff7eb3', FSEE:'#00ffc8', IWM:'#ffd700', General:'#667eea', 'Level 1':'#f39c12', 'Level 2':'#e67e22' };

        feed.innerHTML = posts.map(post => {
            const ts = post.timestamp?.toDate ? post.timestamp.toDate().toLocaleString() : 'Just now';
            const liked = post.likes && post.likes.includes(currentUser.username);
            const isAdmin = currentUser.username === '2105056';
            const isOwner = post.userId === currentUser.username;
            return `
            <div class="post-card" id="post-${post.id}">
                <div class="post-header">
                    <div class="post-avatar-sm"><i class="fas fa-user-circle"></i></div>
                    <div class="post-author-info">
                        <strong>${escapeHtml(post.nickname || 'User')}</strong>
                        <span class="post-time"><i class="fas fa-clock"></i> ${ts}</span>
                    </div>
                    <div class="post-tags">
                        <span class="cat-tag">${catEmoji[post.category] || '💬'} ${post.category}</span>
                        <span class="dept-tag-pill" style="background:${deptColors[post.deptTag] || '#667eea'}22;color:${deptColors[post.deptTag] || '#667eea'};border:1px solid ${deptColors[post.deptTag] || '#667eea'};">${post.deptTag || 'General'}</span>
                    </div>
                </div>
                <div class="post-body">${escapeHtml(post.text).replace(/\n/g,'<br>')}</div>
                <div class="post-actions">
                    <button class="post-action-btn ${liked?'liked':''}" onclick="togglePostLike('${post.id}', this)">
                        <i class="fas fa-thumbs-up"></i> <span class="like-count">${(post.likes||[]).length}</span>
                    </button>
                    <button class="post-action-btn" onclick="toggleComments('${post.id}')">
                        <i class="fas fa-comment"></i> <span>${post.commentCount || 0}</span> Comments
                    </button>
                    ${(isAdmin || isOwner) ? `<button class="post-action-btn delete-btn" onclick="deletePost('${post.id}')"><i class="fas fa-trash"></i></button>` : ''}
                </div>
                <div class="comments-section hidden" id="comments-${post.id}">
                    <div id="comments-list-${post.id}" class="comments-list"></div>
                    <div class="add-comment">
                        <input type="text" id="comment-input-${post.id}" placeholder="Write a comment..." class="comment-input">
                        <button onclick="submitComment('${post.id}')" class="eye-catchy-btn small-btn"><i class="fas fa-send"></i></button>
                    </div>
                </div>
            </div>`;
        }).join('');
    } catch(e) {
        console.error(e);
        feed.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;">Error loading posts.</p>';
    }
}

async function togglePostLike(postId, btn) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!currentUser.username || !db) return;
    const ref = db.collection('communityPosts').doc(postId);
    try {
        const doc = await ref.get();
        const likes = doc.data().likes || [];
        const idx = likes.indexOf(currentUser.username);
        if(idx === -1) { likes.push(currentUser.username); btn.classList.add('liked'); }
        else { likes.splice(idx,1); btn.classList.remove('liked'); }
        await ref.update({ likes });
        btn.querySelector('.like-count').textContent = likes.length;
    } catch(e) { console.error(e); }
}

async function toggleComments(postId) {
    const sec = document.getElementById(`comments-${postId}`);
    if(!sec) return;
    sec.classList.toggle('hidden');
    if(!sec.classList.contains('hidden')) loadComments(postId);
}

async function loadComments(postId) {
    const list = document.getElementById(`comments-list-${postId}`);
    if(!list || !db) return;
    list.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
        const snap = await db.collection('communityPosts').doc(postId).collection('comments').orderBy('timestamp','asc').get();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const isAdmin = currentUser.username === '2105056';
        if(snap.empty) { list.innerHTML = '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;padding:8px;">No comments yet.</p>'; return; }
        list.innerHTML = '';
        snap.forEach(doc => {
            const c = doc.data();
            const ts = c.timestamp?.toDate ? c.timestamp.toDate().toLocaleString() : '';
            const isOwner = c.userId === currentUser.username;
            list.innerHTML += `
            <div class="comment-item">
                <i class="fas fa-user-circle"></i>
                <div class="comment-body">
                    <strong>${escapeHtml(c.nickname||'User')}</strong>
                    <span class="comment-time">${ts}</span>
                    <p>${escapeHtml(c.text).replace(/\n/g,'<br>')}</p>
                </div>
                ${(isAdmin||isOwner)?`<button onclick="deleteComment('${postId}','${doc.id}')" class="delete-comment-btn"><i class="fas fa-times"></i></button>`:''}
            </div>`;
        });
    } catch(e) { list.innerHTML = '<p>Error loading comments.</p>'; }
}

async function submitComment(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    const text = input?.value.trim();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!text || !currentUser.username || !db) return;
    try {
        await db.collection('communityPosts').doc(postId).collection('comments').add({
            userId: currentUser.username,
            nickname: currentUser.nickname || currentUser.username,
            text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection('communityPosts').doc(postId).update({ commentCount: firebase.firestore.FieldValue.increment(1) });
        input.value = '';
        loadComments(postId);
        // Update count display
        const countEl = document.querySelector(`#post-${postId} .post-actions .post-action-btn:nth-child(2) span`);
        if(countEl) countEl.textContent = parseInt(countEl.textContent||0)+1;
    } catch(e) { console.error(e); }
}

async function deletePost(postId) {
    if(!confirm('Delete this post?')) return;
    try { await db.collection('communityPosts').doc(postId).delete(); loadCommunityPosts(_communityFilter); } catch(e) { console.error(e); }
}
async function deleteComment(postId, commentId) {
    if(!confirm('Delete comment?')) return;
    try {
        await db.collection('communityPosts').doc(postId).collection('comments').doc(commentId).delete();
        await db.collection('communityPosts').doc(postId).update({ commentCount: firebase.firestore.FieldValue.increment(-1) });
        loadComments(postId);
    } catch(e) { console.error(e); }
}

function filterCommunityPosts() {
    const query = document.getElementById('community-search')?.value.toLowerCase() || '';
    document.querySelectorAll('.post-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? '' : 'none';
    });
}

// ==================== PHOTO GALLERY ====================
function showGallery() {
    const content = document.getElementById('content');
    if(!content) return;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser.username === '2105056';

    content.innerHTML = `
    <div class="gallery-section">
        <div class="section-header">
            <h2><i class="fas fa-images"></i> Photo Gallery</h2>
            <p class="section-subtitle">Share moments from campus life, field trips, lab sessions, and events</p>
        </div>

        <!-- Upload Area -->
        <div class="gallery-upload-area" ${!isAdmin ? '' : ''}>
            <div class="upload-card" onclick="triggerGalleryUpload()">
                <i class="fas fa-cloud-upload-alt fa-2x"></i>
                <p><strong>Upload Photo</strong></p>
                <p style="font-size:0.8rem;color:rgba(255,255,255,0.6);">
                    ${isAdmin ? 'Photos will be published instantly.' : 'Photos will be reviewed by admin before publishing.'}
                </p>
            </div>
            ${isAdmin ? `
            <div class="upload-card pending-uploads" onclick="loadPendingPhotos()" style="cursor:pointer;">
                <i class="fas fa-clock fa-2x" style="color:#ffd700;"></i>
                <p><strong>Pending Approval</strong></p>
                <p style="font-size:0.8rem;color:rgba(255,255,255,0.6);">Review and approve user uploads</p>
            </div>` : ''}
        </div>

        <!-- Caption input (shows after selecting photo) -->
        <div id="gallery-upload-form" class="hidden" style="margin-bottom:20px;background:rgba(255,255,255,0.05);padding:20px;border-radius:12px;">
            <img id="gallery-preview-thumb" src="" alt="" style="max-height:150px;border-radius:8px;margin-bottom:10px;">
            <input type="text" id="gallery-caption" placeholder="Add a caption..." style="width:100%;padding:10px;border-radius:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;margin-bottom:10px;">
            <select id="gallery-category" style="padding:8px;border-radius:8px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;margin-bottom:10px;">
                <option value="Campus Life">Campus Life</option>
                <option value="Field Trip">Field Trip</option>
                <option value="Lab Session">Lab Session</option>
                <option value="Event">Event</option>
                <option value="Achievement">Achievement</option>
                <option value="Other">Other</option>
            </select>
            <div style="display:flex;gap:10px;">
                <button onclick="submitGalleryPhoto()" class="eye-catchy-btn"><i class="fas fa-upload"></i> Submit</button>
                <button onclick="cancelGalleryUpload()" class="eye-catchy-btn" style="background:linear-gradient(45deg,#e74c3c,#c0392b);"><i class="fas fa-times"></i> Cancel</button>
            </div>
        </div>

        <!-- Filter -->
        <div class="gallery-filter">
            <button class="filter-btn active" onclick="loadGalleryPhotos('all', this)">All</button>
            <button class="filter-btn" onclick="loadGalleryPhotos('Campus Life', this)">Campus Life</button>
            <button class="filter-btn" onclick="loadGalleryPhotos('Field Trip', this)">Field Trips</button>
            <button class="filter-btn" onclick="loadGalleryPhotos('Lab Session', this)">Lab Sessions</button>
            <button class="filter-btn" onclick="loadGalleryPhotos('Event', this)">Events</button>
            <button class="filter-btn" onclick="loadGalleryPhotos('Achievement', this)">Achievements</button>
        </div>

        <!-- Gallery Grid -->
        <div id="gallery-grid" class="gallery-grid">
            <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading gallery...</div>
        </div>
    </div>`;

    loadGalleryPhotos('all');
}

let _galleryFileData = null;

function triggerGalleryUpload() {
    document.getElementById('gallery-file-input').click();
}

function handleGalleryUpload(event) {
    const file = event.target.files[0];
    if(!file) return;
    if(file.size > 5 * 1024 * 1024) { alert('File too large. Max 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
        _galleryFileData = { file, dataUrl: e.target.result };
        document.getElementById('gallery-preview-thumb').src = e.target.result;
        document.getElementById('gallery-upload-form').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
    event.target.value = '';
}

function cancelGalleryUpload() {
    _galleryFileData = null;
    document.getElementById('gallery-upload-form').classList.add('hidden');
    document.getElementById('gallery-preview-thumb').src = '';
    document.getElementById('gallery-caption').value = '';
}

async function submitGalleryPhoto() {
    if(!_galleryFileData) return;
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!currentUser.username) { alert('Please login first.'); return; }

    const caption = document.getElementById('gallery-caption')?.value.trim() || 'No caption';
    const category = document.getElementById('gallery-category')?.value || 'Other';
    const isAdmin = currentUser.username === '2105056';

    // Store as base64 in Firestore (for simplicity - no Firebase Storage setup needed)
    // Note: for large scale use, switch to Firebase Storage
    const photoData = {
        userId: currentUser.username,
        nickname: currentUser.nickname || currentUser.username,
        caption,
        category,
        imageData: _galleryFileData.dataUrl,  // base64
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        approved: isAdmin,  // admin photos auto-approved
        likes: [],
        commentCount: 0
    };

    try {
        if(db) {
            await db.collection('galleryPhotos').add(photoData);
            showPopup(isAdmin ? 'Photo published!' : 'Photo submitted! Awaiting admin approval.');
            cancelGalleryUpload();
            loadGalleryPhotos('all');
        }
    } catch(e) {
        console.error(e);
        alert('Error uploading photo. The image may be too large for the database. Try a smaller image.');
    }
}

let _galleryFilterCat = 'all';
async function loadGalleryPhotos(category, btn) {
    _galleryFilterCat = category;
    if(btn) {
        document.querySelectorAll('.gallery-filter .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }
    const grid = document.getElementById('gallery-grid');
    if(!grid || !db) return;
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    try {
        let query = db.collection('galleryPhotos').where('approved','==',true).orderBy('timestamp','desc').limit(40);
        if(category !== 'all') {
            query = db.collection('galleryPhotos').where('approved','==',true).where('category','==',category).orderBy('timestamp','desc').limit(40);
        }
        const snap = await query.get();
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const isAdmin = currentUser.username === '2105056';

        if(snap.empty) {
            grid.innerHTML = '<div class="empty-state"><i class="fas fa-images fa-3x"></i><p>No photos yet. Upload the first one!</p></div>';
            return;
        }

        grid.innerHTML = '';
        snap.forEach(doc => {
            const p = doc.data();
            const ts = p.timestamp?.toDate ? p.timestamp.toDate().toLocaleDateString() : '';
            const liked = p.likes && p.likes.includes(currentUser.username);
            const isOwner = p.userId === currentUser.username;
            const div = document.createElement('div');
            div.className = 'gallery-card';
            div.innerHTML = `
                <div class="gallery-img-wrap" onclick="openImagePreview('${p.imageData}')">
                    <img src="${p.imageData}" alt="${escapeHtml(p.caption)}" loading="lazy">
                    <div class="gallery-overlay"><i class="fas fa-search-plus"></i></div>
                </div>
                <div class="gallery-card-body">
                    <div class="gallery-category-badge">${p.category}</div>
                    <p class="gallery-caption">${escapeHtml(p.caption)}</p>
                    <div class="gallery-meta">
                        <span><i class="fas fa-user-circle"></i> ${escapeHtml(p.nickname||'User')}</span>
                        <span><i class="fas fa-calendar"></i> ${ts}</span>
                    </div>
                    <div class="gallery-actions">
                        <button class="gallery-action-btn ${liked?'liked':''}" onclick="toggleGalleryLike('${doc.id}', this)">
                            <i class="fas fa-heart"></i> <span>${(p.likes||[]).length}</span>
                        </button>
                        <button class="gallery-action-btn" onclick="toggleGalleryComments('${doc.id}')">
                            <i class="fas fa-comment"></i> ${p.commentCount||0}
                        </button>
                        ${(isAdmin||isOwner)?`<button class="gallery-action-btn delete-btn" onclick="deleteGalleryPhoto('${doc.id}')"><i class="fas fa-trash"></i></button>`:''}
                    </div>
                    <div class="gallery-comments hidden" id="gcomments-${doc.id}">
                        <div id="gcomments-list-${doc.id}"></div>
                        <div class="add-comment">
                            <input type="text" id="gcomment-input-${doc.id}" placeholder="Comment..." class="comment-input">
                            <button onclick="submitGalleryComment('${doc.id}')" class="eye-catchy-btn small-btn"><i class="fas fa-send"></i></button>
                        </div>
                    </div>
                </div>`;
            grid.appendChild(div);
        });
    } catch(e) {
        console.error(e);
        grid.innerHTML = '<p style="color:rgba(255,255,255,0.6);text-align:center;padding:40px;">Error loading gallery. Make sure Firestore indexes are set up.<br><small>You may need to create composite indexes for gallery queries.</small></p>';
    }
}

async function loadPendingPhotos() {
    if(!db) return;
    const grid = document.getElementById('gallery-grid');
    if(!grid) return;
    grid.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading pending photos...</div>';
    try {
        const snap = await db.collection('galleryPhotos').where('approved','==',false).orderBy('timestamp','desc').get();
        if(snap.empty) { grid.innerHTML = '<div class="empty-state"><i class="fas fa-check fa-3x" style="color:#2ecc71;"></i><p>No pending photos!</p></div>'; return; }
        grid.innerHTML = '<h4 style="color:#ffd700;margin-bottom:15px;"><i class="fas fa-clock"></i> Pending Approval</h4>';
        snap.forEach(doc => {
            const p = doc.data();
            const div = document.createElement('div');
            div.className = 'gallery-card pending';
            div.innerHTML = `
                <img src="${p.imageData}" alt="${escapeHtml(p.caption)}" style="width:100%;height:180px;object-fit:cover;border-radius:8px;">
                <div class="gallery-card-body">
                    <p class="gallery-caption">${escapeHtml(p.caption)}</p>
                    <p style="font-size:0.8rem;color:rgba(255,255,255,0.6);">By: ${escapeHtml(p.nickname||'User')} | ${p.category}</p>
                    <div style="display:flex;gap:8px;margin-top:10px;">
                        <button onclick="approvePhoto('${doc.id}')" class="eye-catchy-btn small-btn" style="background:linear-gradient(45deg,#27ae60,#2ecc71)"><i class="fas fa-check"></i> Approve</button>
                        <button onclick="rejectPhoto('${doc.id}')" class="eye-catchy-btn small-btn" style="background:linear-gradient(45deg,#e74c3c,#c0392b)"><i class="fas fa-times"></i> Reject</button>
                    </div>
                </div>`;
            grid.appendChild(div);
        });
    } catch(e) { grid.innerHTML = '<p>Error loading pending photos.</p>'; }
}

async function approvePhoto(id) {
    try { await db.collection('galleryPhotos').doc(id).update({ approved: true }); loadPendingPhotos(); showPopup('Photo approved!'); } catch(e) {}
}
async function rejectPhoto(id) {
    if(!confirm('Reject and delete this photo?')) return;
    try { await db.collection('galleryPhotos').doc(id).delete(); loadPendingPhotos(); showPopup('Photo rejected.'); } catch(e) {}
}
async function deleteGalleryPhoto(id) {
    if(!confirm('Delete this photo?')) return;
    try { await db.collection('galleryPhotos').doc(id).delete(); loadGalleryPhotos(_galleryFilterCat); } catch(e) {}
}
async function toggleGalleryLike(photoId, btn) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!currentUser.username || !db) return;
    const ref = db.collection('galleryPhotos').doc(photoId);
    try {
        const doc = await ref.get();
        const likes = doc.data().likes || [];
        const idx = likes.indexOf(currentUser.username);
        if(idx === -1) { likes.push(currentUser.username); btn.classList.add('liked'); }
        else { likes.splice(idx,1); btn.classList.remove('liked'); }
        await ref.update({ likes });
        btn.querySelector('span').textContent = likes.length;
    } catch(e) {}
}
async function toggleGalleryComments(photoId) {
    const sec = document.getElementById(`gcomments-${photoId}`);
    if(!sec) return;
    sec.classList.toggle('hidden');
    if(!sec.classList.contains('hidden')) loadGalleryComments(photoId);
}
async function loadGalleryComments(photoId) {
    const list = document.getElementById(`gcomments-list-${photoId}`);
    if(!list||!db) return;
    list.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    try {
        const snap = await db.collection('galleryPhotos').doc(photoId).collection('comments').orderBy('timestamp','asc').get();
        list.innerHTML = '';
        if(snap.empty) { list.innerHTML = '<p style="color:rgba(255,255,255,0.5);font-size:0.8rem;padding:5px;">No comments yet.</p>'; return; }
        snap.forEach(doc => {
            const c = doc.data();
            list.innerHTML += `<div class="comment-item"><i class="fas fa-user-circle"></i><div class="comment-body"><strong>${escapeHtml(c.nickname||'User')}</strong><p>${escapeHtml(c.text)}</p></div></div>`;
        });
    } catch(e) {}
}
async function submitGalleryComment(photoId) {
    const input = document.getElementById(`gcomment-input-${photoId}`);
    const text = input?.value.trim();
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if(!text||!currentUser.username||!db) return;
    try {
        await db.collection('galleryPhotos').doc(photoId).collection('comments').add({
            userId: currentUser.username,
            nickname: currentUser.nickname||currentUser.username,
            text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        await db.collection('galleryPhotos').doc(photoId).update({ commentCount: firebase.firestore.FieldValue.increment(1) });
        input.value = '';
        loadGalleryComments(photoId);
    } catch(e) {}
}

// ==================== DOCUMENT UPLOAD ====================
function triggerDocUpload() {
    document.getElementById('doc-file-input').click();
}
function handleDocUpload(event) {
    const file = event.target.files[0];
    if(!file) return;
    // Future: implement doc upload with admin approval
    alert('Document upload feature: Files will be reviewed by admin.\n\nFor now, please contact the admin directly at deboneel1998@gmail.com to upload documents.');
    event.target.value = '';
}

// ==================== STUDY ABROAD ====================
function showStudyAbroad() {
    const content = document.getElementById('content');
    if(!content) return;

    const universities = [
        {
            country: "Germany 🇩🇪",
            flag: "🇩🇪",
            scholarship: "DAAD Scholarship",
            scholarshipUrl: "https://www.daad.de/en/",
            deadline: "October – November (varies)",
            details: "Fully funded scholarships for agricultural and environmental engineering students. One of the most prestigious scholarships worldwide.",
            universities: [
                { name: "Humboldt University of Berlin", url: "https://www.hu-berlin.de/en", field: "Agricultural Sciences" },
                { name: "University of Hohenheim", url: "https://www.uni-hohenheim.de/en", field: "Agricultural Sciences, Water Mgmt" },
                { name: "Technical University of Munich", url: "https://www.tum.de/en/", field: "Environmental Engineering" },
                { name: "Leibniz University Hannover", url: "https://www.uni-hannover.de/en/", field: "Civil & Environmental Engg." },
            ],
            tips: "Strong IELTS (6.5+) or German language required. Very research-focused. Apply through DAAD portal.",
            color: "#000000"
        },
        {
            country: "Japan 🇯🇵",
            flag: "🇯🇵",
            scholarship: "MEXT (Monbukagakusho)",
            scholarshipUrl: "https://www.studyinjapan.go.jp/en/",
            deadline: "May – June (Embassy level)",
            details: "Japanese government scholarship covering tuition, living allowance, and travel. Strong in agricultural and water engineering.",
            universities: [
                { name: "The University of Tokyo", url: "https://www.u-tokyo.ac.jp/en/", field: "Agricultural & Environmental Engg." },
                { name: "Kyoto University", url: "https://www.kyoto-u.ac.jp/en", field: "Agriculture, Water Resources" },
                { name: "Hokkaido University", url: "https://www.hokudai.ac.jp/en/", field: "Agricultural Sciences" },
                { name: "Gifu University", url: "https://www.gifu-u.ac.jp/english/", field: "Applied Biological Sciences" },
            ],
            tips: "Apply through Bangladesh Embassy in Tokyo or directly to universities. Japanese language helpful but not always required.",
            color: "#bc0000"
        },
        {
            country: "USA 🇺🇸",
            flag: "🇺🇸",
            scholarship: "Fulbright Program",
            scholarshipUrl: "https://foreign.fulbrightonline.org/",
            deadline: "January – March",
            details: "Prestigious program for graduate study. Also check university-specific fellowships and GRA/GTA positions.",
            universities: [
                { name: "UC Davis", url: "https://www.ucdavis.edu/", field: "Biological & Agricultural Engg." },
                { name: "Texas A&M University", url: "https://www.tamu.edu/", field: "Agricultural Engineering" },
                { name: "Cornell University", url: "https://www.cornell.edu/", field: "Biological & Environmental Engg." },
                { name: "Purdue University", url: "https://www.purdue.edu/", field: "Agricultural & Biological Engg." },
            ],
            tips: "GRE + TOEFL/IELTS required. Look for funded PhD positions with assistantships. Email professors directly.",
            color: "#003087"
        },
        {
            country: "Australia 🇦🇺",
            flag: "🇦🇺",
            scholarship: "Australia Awards / RTP",
            scholarshipUrl: "https://www.australiaawards.gov.au/",
            deadline: "April – June (Australia Awards)",
            details: "Australia Awards covers full scholarship. Research Training Program (RTP) for domestic/international PhD students.",
            universities: [
                { name: "University of Queensland", url: "https://www.uq.edu.au/", field: "Agricultural Science" },
                { name: "University of Melbourne", url: "https://www.unimelb.edu.au/", field: "Ecosystem Science" },
                { name: "Charles Darwin University", url: "https://www.cdu.edu.au/", field: "Environmental Science" },
                { name: "Griffith University", url: "https://www.griffith.edu.au/", field: "Water & Environmental Management" },
            ],
            tips: "Australia Awards is highly competitive. Strong academic records + community work experience preferred.",
            color: "#00008b"
        },
        {
            country: "Netherlands 🇳🇱",
            flag: "🇳🇱",
            scholarship: "Nuffic/Orange Knowledge / NFP",
            scholarshipUrl: "https://www.nuffic.nl/en/subjects/scholarships",
            deadline: "November – January",
            details: "Excellent for water management and irrigation engineering — very relevant to IWM students.",
            universities: [
                { name: "Wageningen University", url: "https://www.wur.nl/en.htm", field: "Agricultural & Water Management" },
                { name: "IHE Delft", url: "https://www.un-ihe.org/", field: "Water Science & Engineering" },
                { name: "TU Delft", url: "https://www.tudelft.nl/en/", field: "Civil & Hydraulic Engg." },
            ],
            tips: "Wageningen is world-renowned for agricultural sciences. Netherlands is ideal for IWM students.",
            color: "#ff6600"
        },
        {
            country: "South Korea 🇰🇷",
            flag: "🇰🇷",
            scholarship: "KGSP (Korean Government Scholarship)",
            scholarshipUrl: "https://www.studyinkorea.go.kr/en/sub/gks/allnew_gks.do",
            deadline: "February – March",
            details: "Fully funded by Korean government. Includes 1-year Korean language training before degree program.",
            universities: [
                { name: "Seoul National University", url: "https://www.snu.ac.kr/index.html", field: "Agricultural Biotechnology" },
                { name: "Korea University", url: "https://www.korea.edu/", field: "Environmental Systems Engg." },
                { name: "Jeonbuk National University", url: "https://www.jbnu.ac.kr/", field: "Biosystems Machinery Engg." },
            ],
            tips: "Apply through Embassy route for higher success rate. Strong in biosystems and smart farming.",
            color: "#c60c30"
        },
        {
            country: "Canada 🇨🇦",
            flag: "🇨🇦",
            scholarship: "Vanier CGS / University Awards",
            scholarshipUrl: "https://www.vanier.gc.ca/en/home-accueil.html",
            deadline: "October – November",
            details: "Strong programs in water resources and environmental engineering. Many universities offer funded PhD positions.",
            universities: [
                { name: "University of Guelph", url: "https://www.uoguelph.ca/", field: "Bioresource Engineering" },
                { name: "McGill University", url: "https://www.mcgill.ca/", field: "Bioresource Engineering" },
                { name: "University of British Columbia", url: "https://www.ubc.ca/", field: "Land & Water Systems" },
            ],
            tips: "Look for funded PhD positions. Canadian immigration pathways post-graduation are very favorable.",
            color: "#d52b1e"
        },
        {
            country: "UK 🇬🇧",
            flag: "🇬🇧",
            scholarship: "Commonwealth Scholarship / Chevening",
            scholarshipUrl: "https://www.chevening.org/",
            deadline: "October – November (Chevening)",
            details: "Chevening covers full scholarship for one-year Masters programs. Commonwealth for PhD.",
            universities: [
                { name: "University of Exeter", url: "https://www.exeter.ac.uk/", field: "Environmental Engineering" },
                { name: "Cranfield University", url: "https://www.cranfield.ac.uk/", field: "Water & Agri Engineering" },
                { name: "University of Reading", url: "https://www.reading.ac.uk/", field: "Agriculture, Food & Climate" },
            ],
            tips: "Chevening requires 2 years of work experience. Very competitive but highly rewarding.",
            color: "#012169"
        }
    ];

    let html = `
    <div class="abroad-section">
        <div class="section-header">
            <h2><i class="fas fa-plane"></i> Study Abroad Opportunities</h2>
            <p class="section-subtitle">Explore higher education opportunities worldwide — perfect for AET graduates</p>
        </div>

        <!-- Quick Tips Banner -->
        <div class="abroad-tips-banner">
            <h4><i class="fas fa-lightbulb" style="color:#ffd700;"></i> General Requirements for Abroad Study</h4>
            <div class="tips-grid">
                <div class="tip-item"><i class="fas fa-language"></i> IELTS 6.0-7.0+ or TOEFL 80-100+</div>
                <div class="tip-item"><i class="fas fa-certificate"></i> Strong CGPA (3.0+/4.0 preferred)</div>
                <div class="tip-item"><i class="fas fa-envelope"></i> Research papers/publications help a lot</div>
                <div class="tip-item"><i class="fas fa-user-tie"></i> 2 Reference letters from professors</div>
                <div class="tip-item"><i class="fas fa-scroll"></i> Statement of Purpose (SOP)</div>
                <div class="tip-item"><i class="fas fa-flask"></i> Research experience matters</div>
            </div>
        </div>

        <!-- Country Filter -->
        <div class="abroad-filter">
            <button class="filter-btn active" onclick="filterAbroad('all',this)">🌍 All Countries</button>
            <button class="filter-btn" onclick="filterAbroad('iwm',this)">💧 Best for IWM</button>
            <button class="filter-btn" onclick="filterAbroad('fpm',this)">⚙️ Best for FPM</button>
            <button class="filter-btn" onclick="filterAbroad('fsee',this)">🏗️ Best for FSEE</button>
        </div>

        <!-- Universities Grid -->
        <div id="abroad-grid" class="abroad-grid">
            ${universities.map((uni, idx) => `
            <div class="abroad-card" data-tags="${getAbroadTags(uni.country)}">
                <div class="abroad-card-header" style="border-top:4px solid ${uni.color};">
                    <div class="country-flag">${uni.flag}</div>
                    <div class="country-info">
                        <h3>${uni.country}</h3>
                        <div class="scholarship-badge">
                            <a href="${uni.scholarshipUrl}" target="_blank">
                                <i class="fas fa-award"></i> ${uni.scholarship}
                            </a>
                        </div>
                        <div class="deadline-badge">
                            <i class="fas fa-calendar-alt"></i> Deadline: ${uni.deadline}
                        </div>
                    </div>
                </div>
                <p class="abroad-description">${uni.details}</p>
                <div class="uni-list">
                    ${uni.universities.map(u => `
                    <div class="uni-item">
                        <a href="${u.url}" target="_blank" class="uni-link">
                            <i class="fas fa-university"></i> ${u.name}
                        </a>
                        <span class="uni-field"><i class="fas fa-microscope"></i> ${u.field}</span>
                    </div>`).join('')}
                </div>
                <div class="abroad-tips">
                    <i class="fas fa-info-circle" style="color:#ffd700;"></i>
                    <strong>Tip:</strong> ${uni.tips}
                </div>
                <div class="abroad-actions">
                    <a href="${uni.scholarshipUrl}" target="_blank" class="abroad-action-btn primary-abroad-btn">
                        <i class="fas fa-external-link-alt"></i> Apply / Learn More
                    </a>
                </div>
            </div>`).join('')}
        </div>

        <!-- Useful Resources -->
        <div class="abroad-resources">
            <h3><i class="fas fa-link"></i> Useful Resources</h3>
            <div class="resources-links">
                <a href="https://www.scholars4dev.com/" target="_blank" class="resource-link"><i class="fas fa-graduation-cap"></i> Scholars4Dev</a>
                <a href="https://opportunitiescircle.com/" target="_blank" class="resource-link"><i class="fas fa-globe"></i> Opportunities Circle</a>
                <a href="https://www.findaphd.com/" target="_blank" class="resource-link"><i class="fas fa-flask"></i> Find a PhD</a>
                <a href="https://www.ielts.org/" target="_blank" class="resource-link"><i class="fas fa-language"></i> IELTS</a>
                <a href="https://www.toefl.org/" target="_blank" class="resource-link"><i class="fas fa-language"></i> TOEFL</a>
                <a href="https://aet.bau.edu.bd/" target="_blank" class="resource-link"><i class="fas fa-university"></i> AET BAU</a>
            </div>
        </div>
    </div>`;

    content.innerHTML = html;
}

function getAbroadTags(country) {
    const tags = { iwm: ['Germany','Netherlands','Japan','Canada'], fpm: ['Germany','Japan','USA','South Korea'], fsee: ['Australia','UK','USA','Germany'] };
    const result = [];
    if(tags.iwm.some(c => country.includes(c))) result.push('iwm');
    if(tags.fpm.some(c => country.includes(c))) result.push('fpm');
    if(tags.fsee.some(c => country.includes(c))) result.push('fsee');
    result.push('all');
    return result.join(' ');
}

function filterAbroad(tag, btn) {
    document.querySelectorAll('.abroad-filter .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.abroad-card').forEach(card => {
        const tags = card.dataset.tags || '';
        card.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
    });
}

// ==================== UTILITY ====================
function escapeHtml(text) {
    if(!text) return '';
    return String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
