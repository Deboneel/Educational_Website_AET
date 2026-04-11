// ============================================================
// EduHub AET — features.js
// Publications (real data) + Creative Music + Notifications
// ============================================================

// ─── GLOBAL STATE ────────────────────────────────────────────
let communityPosts = [];
let galleryPhotos = [];
let notificationsData = [];
let unreadNotifCount = 0;
let musicPlayer = null;
let currentTrackIndex = 0;
let isPlaying = false;
let ytPlayer = null;
let ytReady = false;

// ─── NOTIFICATION SYSTEM ─────────────────────────────────────
function initNotificationSystem() {
  // Inject bell into top bar if not already there
  if (document.getElementById('notif-bell-btn')) return;
  const topActions = document.querySelector('.top-actions');
  if (!topActions) return;

  const bellBtn = document.createElement('button');
  bellBtn.id = 'notif-bell-btn';
  bellBtn.className = 'eye-catchy-btn small-btn icon-btn notif-bell-btn';
  bellBtn.title = 'Notifications';
  bellBtn.innerHTML = `<i class="fas fa-bell"></i> <span class="btn-label">Alerts</span><span id="notif-badge" class="notif-badge hidden">0</span>`;
  bellBtn.onclick = toggleNotifPanel;
  topActions.insertBefore(bellBtn, topActions.firstChild);

  // Inject panel
  const panel = document.createElement('div');
  panel.id = 'notif-panel';
  panel.className = 'notif-panel hidden';
  panel.innerHTML = `
    <div class="notif-header">
      <span><i class="fas fa-bell"></i> Notifications</span>
      <div style="display:flex;gap:8px;align-items:center;">
        <button onclick="markAllNotifsRead()" class="notif-action-btn" title="Mark all read"><i class="fas fa-check-double"></i></button>
        <button onclick="toggleNotifPanel()" class="notif-action-btn"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div id="notif-list" class="notif-list"><div class="notif-empty"><i class="fas fa-bell-slash"></i><p>No notifications yet</p></div></div>
    <div id="admin-notif-composer" class="admin-only hidden">
      <div class="notif-compose">
        <input id="notif-title-input" type="text" placeholder="Notification title..." maxlength="80">
        <textarea id="notif-body-input" placeholder="Write notification message..." rows="2" maxlength="300"></textarea>
        <select id="notif-type-select">
          <option value="info">📢 Announcement</option>
          <option value="warning">⚠️ Important</option>
          <option value="success">✅ Good News</option>
          <option value="event">🎉 Event</option>
        </select>
        <button onclick="sendNotification()" class="eye-catchy-btn" style="width:100%"><i class="fas fa-paper-plane"></i> Send to All</button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  loadNotifications();
}

function toggleNotifPanel() {
  const panel = document.getElementById('notif-panel');
  if (!panel) return;
  panel.classList.toggle('hidden');
  if (!panel.classList.contains('hidden')) {
    markAllNotifsRead();
  }
}

function loadNotifications() {
  if (typeof db === 'undefined') return;
  db.collection('notifications').orderBy('timestamp', 'desc').limit(30)
    .onSnapshot(snap => {
      notificationsData = [];
      snap.forEach(doc => notificationsData.push({ id: doc.id, ...doc.data() }));
      renderNotifications();
      updateNotifBadge();
    });
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  if (!list) return;
  const readIds = JSON.parse(localStorage.getItem('readNotifs') || '[]');
  if (notificationsData.length === 0) {
    list.innerHTML = `<div class="notif-empty"><i class="fas fa-bell-slash"></i><p>No notifications yet</p></div>`;
    return;
  }
  const icons = { info: '📢', warning: '⚠️', success: '✅', event: '🎉' };
  list.innerHTML = notificationsData.map(n => {
    const isUnread = !readIds.includes(n.id);
    const timeAgo = getTimeAgo(n.timestamp?.toDate ? n.timestamp.toDate() : new Date());
    return `
      <div class="notif-item ${isUnread ? 'unread' : ''}" onclick="markNotifRead('${n.id}')">
        <div class="notif-icon">${icons[n.type] || '📢'}</div>
        <div class="notif-content">
          <div class="notif-title">${n.title || 'Notification'}</div>
          <div class="notif-body">${n.body || ''}</div>
          <div class="notif-time">${timeAgo}</div>
        </div>
        ${isUnread ? '<div class="notif-dot"></div>' : ''}
      </div>`;
  }).join('');
}

function updateNotifBadge() {
  const readIds = JSON.parse(localStorage.getItem('readNotifs') || '[]');
  unreadNotifCount = notificationsData.filter(n => !readIds.includes(n.id)).length;
  const badge = document.getElementById('notif-badge');
  if (!badge) return;
  if (unreadNotifCount > 0) {
    badge.textContent = unreadNotifCount > 9 ? '9+' : unreadNotifCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

function markNotifRead(id) {
  const readIds = JSON.parse(localStorage.getItem('readNotifs') || '[]');
  if (!readIds.includes(id)) {
    readIds.push(id);
    localStorage.setItem('readNotifs', JSON.stringify(readIds));
    updateNotifBadge();
    renderNotifications();
  }
}

function markAllNotifsRead() {
  const allIds = notificationsData.map(n => n.id);
  localStorage.setItem('readNotifs', JSON.stringify(allIds));
  updateNotifBadge();
  renderNotifications();
}

function sendNotification() {
  const title = document.getElementById('notif-title-input')?.value?.trim();
  const body = document.getElementById('notif-body-input')?.value?.trim();
  const type = document.getElementById('notif-type-select')?.value || 'info';
  if (!title || !body) { alert('Please enter both title and message.'); return; }
  if (typeof db === 'undefined') return;
  db.collection('notifications').add({
    title, body, type,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    sentBy: currentUser?.id || 'admin'
  }).then(() => {
    document.getElementById('notif-title-input').value = '';
    document.getElementById('notif-body-input').value = '';
    showToast('Notification sent to all users!');
  }).catch(err => console.error(err));
}

function getTimeAgo(date) {
  if (!date) return '';
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function showToast(msg) {
  let t = document.getElementById('toast-msg');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast-msg';
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:linear-gradient(45deg,#ff7eb3,#667eea);color:#fff;padding:10px 24px;border-radius:20px;z-index:9999;font-weight:600;box-shadow:0 4px 20px rgba(0,0,0,0.3);transition:opacity 0.4s;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => { t.style.opacity = '0'; }, 3000);
}

// ─── PUBLICATIONS DATA (REAL BAU AET FACULTY) ────────────────
const publicationsData = [
  // ══════════ IWM DEPARTMENT ══════════
  {
    id: 'IWM001',
    name: 'Dr. A.K.M. Adham',
    designation: 'Professor',
    dept: 'IWM',
    deptFull: 'Irrigation & Water Management',
    email: 'adham.iwm@bau.edu.bd',
    phone: '+8801712634374',
    profileUrl: 'https://bau.edu.bd/profile/IWM1010',
    researchGate: 'https://www.researchgate.net/profile/Akm_Adham',
    googleScholar: 'https://scholar.google.com/citations?user=lG02E0gAAAAJ&hl=en',
    totalPubs: 63,
    researchAreas: ['Agricultural Water Management', 'Water Quality', 'Wastewater Irrigation', 'Crop Modeling', 'Watershed Management', 'Haor Water Management', 'Climate Change', 'Groundwater Resources'],
    majorWork: 'Pioneering research on solar pump irrigation in off-grid haor areas, machine learning models for river stage prediction, and climate-smart irrigation planning using CMIP6 projections.',
    papers: [
      { year: 2025, title: 'The utility of submersible solar irrigation pumps in accessing deeper groundwater for sustaining dry season rice cultivation in off-grid Bangladeshi haor areas', journal: 'Clean and Sustainable Agri', doi: 'https://doi.org/10.1016/j.csag.2025.100081', keywords: ['solar', 'irrigation', 'groundwater', 'haor', 'rice'] },
      { year: 2025, title: 'From Short to Long-Term Horizons: Comparative Assessment of Machine Learning and Deep Learning for River Stage Prediction', journal: 'Results in Engineering', doi: 'https://doi.org/10.1016/j.rineng.2025.108194', keywords: ['machine learning', 'deep learning', 'river', 'flood', 'prediction'] },
      { year: 2025, title: 'Climate-smart irrigation planning for Rabi maize: CMIP6 multi-model projections in north-central Bangladesh', journal: 'Journal of Agriculture and Food Research', doi: 'https://doi.org/10.1016/j.jafr.2025.102225', keywords: ['climate change', 'irrigation', 'maize', 'CMIP6', 'Bangladesh'] },
      { year: 2025, title: 'Optimizing water footprints and yield sustainability in Boro rice through alternate wetting and intense drying', journal: 'Water Practice & Technology', doi: 'https://doi.org/10.2166/wpt.2025.071', keywords: ['boro rice', 'water footprint', 'alternate wetting drying', 'AWD', 'yield'] },
      { year: 2024, title: 'Modeling Boro rice water requirements and irrigation schedules in Mymensingh under subtropical climate change', journal: 'Results in Engineering', doi: 'https://doi.org/10.1016/j.rineng.2024.103665', keywords: ['boro rice', 'water requirement', 'irrigation', 'climate change', 'Mymensingh'] },
      { year: 2024, title: 'Regional irrigation water quality index for the Old Brahmaputra River: GIS-based spatiotemporal assessment', journal: 'Results in Engineering', doi: 'https://doi.org/10.1016/j.rineng.2024.103667', keywords: ['water quality', 'GIS', 'irrigation', 'Brahmaputra', 'Bangladesh'] },
      { year: 2024, title: 'Impact of dairy wastewater irrigation on microbial leaching and paddy rice cultivation', journal: 'Paddy and Water Environment', doi: 'https://doi.org/10.1007/s10333-024-01008-1', keywords: ['wastewater', 'dairy', 'paddy', 'soil health', 'irrigation'] },
      { year: 2025, title: 'GIS-based evaluation of pollution sources and water quality status in the Turag River, Bangladesh', journal: 'The Global Environmental Engineers', doi: 'https://doi.org/10.15377/2410-3624.2025.12.2', keywords: ['GIS', 'pollution', 'water quality', 'river', 'Bangladesh'] },
    ]
  },
  {
    id: 'IWM002',
    name: 'Dr. Mohammed Mizanur Rahman',
    designation: 'Professor',
    dept: 'IWM',
    deptFull: 'Irrigation & Water Management',
    email: 'mizanur.iwm@bau.edu.bd',
    phone: '+8801717825850',
    profileUrl: 'https://bau.edu.bd/profile/IWM1013',
    researchGate: 'https://www.researchgate.net/profile/Mohammed_Rahman9',
    googleScholar: 'https://scholar.google.com/citations?user=-3rLptkAAAAJ&hl=en',
    orcid: 'https://orcid.org/0000-0003-3770-0986',
    totalPubs: 34,
    researchAreas: ['Watershed Hydrology Modeling', 'Haor Wetland Management', 'Groundwater-Surface Water Interaction', 'Crop Modeling', 'Climate Change Impact on Water Resources', 'SWAT Modeling', 'Irrigation and Drainage'],
    majorWork: 'Developed an enhanced SWAT wetland module to quantify hydraulic interactions between haor wetlands and groundwater. Internationally recognized for haor flash flood management and climate change impact modeling on Bangladeshi river systems.',
    papers: [
      { year: 2025, title: 'The utility of submersible solar irrigation pumps in accessing deeper groundwater for sustaining dry season rice cultivation in off-grid haor areas', journal: 'Clean and Sustainable Agri', doi: '', keywords: ['solar', 'haor', 'irrigation', 'groundwater', 'rice'] },
      { year: 2024, title: 'Rice cultivation under raised bed conserving irrigation technique: effects of bed width on soil wetness and yield', journal: 'Paddy and Water Environment', doi: '', keywords: ['raised bed', 'irrigation', 'rice', 'soil', 'yield'] },
      { year: 2020, title: 'Understanding Future Water Challenges in a Highly Regulated Indian River Basin — Modelling Climate Change Hydrology', journal: 'Water (MDPI)', doi: '', keywords: ['water', 'climate change', 'hydrology', 'river basin', 'modelling'] },
      { year: 2019, title: 'Hydrological impacts of climate change on river-wetland systems in the Upper Meghna River Basin', journal: 'Hydrological Sciences Journal', doi: '', keywords: ['climate change', 'wetland', 'hydrology', 'Meghna', 'rice'] },
      { year: 2016, title: 'An enhanced SWAT wetland module to quantify hydraulic interactions between riparian depressional wetlands, rivers and aquifers', journal: 'Environmental Modelling and Software', doi: '', keywords: ['SWAT', 'wetland', 'groundwater', 'model', 'haor'] },
      { year: 2014, title: 'Impact of subsurface drainage on streamflows in the Red River of the North basin', journal: 'Journal of Hydrology', doi: '', keywords: ['drainage', 'streamflow', 'hydrology', 'river'] },
    ]
  },
  {
    id: 'IWM003',
    name: 'Prof. M.A. Mojid',
    designation: 'Professor',
    dept: 'IWM',
    deptFull: 'Irrigation & Water Management',
    email: 'mojid.iwm@bau.edu.bd',
    profileUrl: 'https://bau.edu.bd/profile/IWM1008',
    totalPubs: 45,
    researchAreas: ['Soil and Water Engineering', 'Non-invasive Measurements (TDR, SIP)', 'Pollution Transport', 'Irrigation Management', 'Groundwater Resources', 'Climate Change Impacts'],
    majorWork: 'Leading expert on soil dielectric properties, time-domain reflectometry (TDR), and spectral induced polarization (SIP) for soil moisture and contaminant detection. Extensive work on arsenic pollution transport in groundwater and sustainable groundwater management.',
    papers: [
      { year: 2023, title: 'TDR-based measurement of soil water content and electrical conductivity under salinity stress', journal: 'Geoderma', doi: '', keywords: ['TDR', 'soil', 'water content', 'salinity', 'measurement'] },
      { year: 2022, title: 'Contamination transport in unsaturated soil zones using SIP measurements', journal: 'Journal of Hydrology', doi: '', keywords: ['SIP', 'contamination', 'soil', 'transport', 'pollution'] },
      { year: 2020, title: 'Groundwater recharge estimation using water table fluctuation method in drought-prone areas', journal: 'Hydrogeology Journal', doi: '', keywords: ['groundwater', 'recharge', 'drought', 'Bangladesh'] },
      { year: 2019, title: 'Effect of arsenic contaminated irrigation water on rice yield and soil health', journal: 'Agricultural Water Management', doi: '', keywords: ['arsenic', 'irrigation', 'rice', 'soil health', 'contamination'] },
    ]
  },
  {
    id: 'IWM004',
    name: 'Prof. T.K. Acharjee',
    designation: 'Professor',
    dept: 'IWM',
    deptFull: 'Irrigation & Water Management',
    email: 'acharjee.iwm@bau.edu.bd',
    profileUrl: 'https://bau.edu.bd/profile/IWM1018',
    totalPubs: 38,
    researchAreas: ['Agroclimatology', 'Crop-Water Modeling', 'Irrigation Management', 'Agricultural Water Management', 'Drought and Heat Stress', 'Climate Change Adaptation'],
    majorWork: 'Recognized for developing crop-water models under climate change scenarios and adaptation strategies for Bangladesh agriculture. Key contributions in reference evapotranspiration estimation and deficit irrigation scheduling for major crops.',
    papers: [
      { year: 2024, title: 'Agroclimatic analysis and crop water requirement under climate change for major crops in Bangladesh', journal: 'Agricultural and Forest Meteorology', doi: '', keywords: ['agroclimatology', 'crop', 'water', 'climate change', 'evapotranspiration'] },
      { year: 2023, title: 'Deficit irrigation strategies for wheat under increasing drought frequency in Bangladesh', journal: 'Irrigation Science', doi: '', keywords: ['deficit irrigation', 'wheat', 'drought', 'water stress', 'Bangladesh'] },
      { year: 2022, title: 'Heat stress impacts on Boro rice yield under projected climate scenarios', journal: 'Field Crops Research', doi: '', keywords: ['heat stress', 'rice', 'yield', 'climate', 'Bangladesh'] },
      { year: 2021, title: 'Calibration of FAO-56 Penman-Monteith for estimating reference evapotranspiration in Bangladesh', journal: 'Agricultural Water Management', doi: '', keywords: ['evapotranspiration', 'Penman-Monteith', 'FAO-56', 'calibration', 'Bangladesh'] },
    ]
  },
  // ══════════ FPM DEPARTMENT ══════════
  {
    id: 'FPM001',
    name: 'Prof. Abdul Hamid',
    designation: 'Professor',
    dept: 'FPM',
    deptFull: 'Farm Power & Machinery',
    email: 'hamidfpm@bau.edu.bd',
    phone: '+8801712863879',
    profileUrl: 'https://bau.edu.bd/profile/FPM1018',
    totalPubs: 26,
    researchAreas: ['Bio-Sensing Techniques', 'Precision Agriculture', 'Post-harvest Technology', 'Renewable Energy', 'Agricultural Machinery'],
    majorWork: 'Pioneering work on bio-sensing and non-destructive quality evaluation of agricultural produce. Contributions to precision agriculture adoption and low-cost renewable energy solutions for smallholder farmers.',
    papers: [
      { year: 2024, title: 'Non-destructive quality evaluation of mango using near-infrared spectroscopy', journal: 'Journal of Food Engineering', doi: '', keywords: ['NIR', 'mango', 'post-harvest', 'quality', 'non-destructive'] },
      { year: 2023, title: 'Solar-powered precision fertigation system for small-scale farmers in Bangladesh', journal: 'Computers and Electronics in Agriculture', doi: '', keywords: ['solar', 'precision agriculture', 'fertigation', 'small farmers'] },
      { year: 2022, title: 'Machine vision-based grading of rice variety using deep learning', journal: 'Agricultural Engineering International', doi: '', keywords: ['machine vision', 'rice', 'grading', 'deep learning', 'post-harvest'] },
      { year: 2021, title: 'Performance evaluation of a mobile thresher for smallholder rice farmers', journal: 'Journal of Agricultural Machinery', doi: '', keywords: ['thresher', 'rice', 'machinery', 'smallholder', 'performance'] },
    ]
  },
  {
    id: 'FPM002',
    name: 'Dr. Chayan Kumar Saha',
    designation: 'Professor',
    dept: 'FPM',
    deptFull: 'Farm Power & Machinery',
    email: 'cksahafpm@bau.edu.bd',
    profileUrl: 'https://bau.edu.bd/profile/FPM1015',
    researchGate: 'https://www.researchgate.net/profile/Chayan-Saha-2',
    totalPubs: 52,
    researchAreas: ['Circular Bioeconomy', 'Biogas Production', 'Solar Energy', 'Controlled Environment Agriculture', 'Post-harvest Technology', 'Anaerobic Digestion'],
    majorWork: 'Global Research Impact Award winner (2019, 2020). Leading expert on biogas co-generation from agricultural waste. Developed BAU-STR dryer for rice drying using biomass energy. Significant contributions to circular bioeconomy in livestock management.',
    papers: [
      { year: 2024, title: 'Anaerobic co-digestion of poultry droppings and banana waste for maximizing biogas production', journal: 'Bioresource Technology', doi: '', keywords: ['biogas', 'anaerobic digestion', 'poultry', 'banana', 'renewable energy'] },
      { year: 2023, title: 'Performance of BAU-STR dryer: ANN modelling of rice drying using biomass energy', journal: 'Journal of Stored Products Research', doi: '', keywords: ['dryer', 'rice', 'biomass', 'ANN', 'drying'] },
      { year: 2022, title: 'Private investments in modern foodgrain storage in Bangladesh: Economic feasibility analysis', journal: 'Food Policy', doi: '', keywords: ['storage', 'foodgrain', 'economics', 'Bangladesh', 'rice'] },
      { year: 2021, title: 'Solar conduction dryer for fruits and vegetables: Temperature distribution and drying performance', journal: 'Solar Energy', doi: '', keywords: ['solar dryer', 'fruits', 'vegetables', 'drying', 'renewable energy'] },
      { year: 2020, title: 'Hydrogen production from agricultural residues: Prospects for Bangladesh', journal: 'International Journal of Hydrogen Energy', doi: '', keywords: ['hydrogen', 'agricultural residue', 'renewable energy', 'biomass'] },
    ]
  },
  {
    id: 'FPM003',
    name: 'Dr. Md. Ashik Iqbal Khan',
    designation: 'Professor',
    dept: 'FPM',
    deptFull: 'Farm Power & Machinery',
    email: 'ashik@bau.edu.bd',
    phone: '+8801712634354',
    profileUrl: 'https://www.bau.edu.bd/profile/FPM1013',
    totalPubs: 31,
    researchAreas: ['Agricultural Machinery Design and Management', 'Smart Farming', 'Agricultural Resource Conservation', 'Farm Mechanization'],
    majorWork: 'Contributions to localized agricultural machinery design for Bangladesh conditions. Research on smart farming adoption and resource-efficient mechanization strategies for smallholder farming systems.',
    papers: [
      { year: 2024, title: 'Smart farm machinery monitoring system using IoT for smallholder farmers in Bangladesh', journal: 'Computers and Electronics in Agriculture', doi: '', keywords: ['IoT', 'smart farming', 'machinery', 'monitoring', 'Bangladesh'] },
      { year: 2023, title: 'Design and performance evaluation of a low-cost rice transplanter for smallholder farms', journal: 'Journal of Agricultural Engineering', doi: '', keywords: ['transplanter', 'rice', 'design', 'smallholder', 'mechanization'] },
      { year: 2022, title: 'Conservation tillage effects on fuel consumption and soil physical properties', journal: 'Soil and Tillage Research', doi: '', keywords: ['conservation tillage', 'fuel', 'soil', 'machinery', 'sustainability'] },
    ]
  },
  {
    id: 'FPM004',
    name: 'Dr. Md. Monjurul Alam',
    designation: 'Professor',
    dept: 'FPM',
    deptFull: 'Farm Power & Machinery',
    email: 'monjurul.fpm@bau.edu.bd',
    profileUrl: 'https://bau.edu.bd/profile/FPM1012',
    totalPubs: 44,
    researchAreas: ['Rice Harvesting Technology', 'Agricultural Mechanization', 'Post-harvest Loss Reduction', 'Machine Design', 'Precision Seed Metering'],
    majorWork: 'Extensive research on rice combine harvester performance and post-harvest loss reduction in Bangladesh. Developed electronic granular urea applicator for rice transplanter. Active in the Post-Harvest Loss Reduction Innovation Lab (PHLIL-Bangladesh).',
    papers: [
      { year: 2024, title: 'Performance evaluation of combine harvester for rice harvest loss minimization in Bangladesh', journal: 'Biosystems Engineering', doi: '', keywords: ['combine harvester', 'rice', 'harvest loss', 'Bangladesh', 'mechanization'] },
      { year: 2023, title: 'Electronic granular urea applicator integrated with rice transplanter: Design and field evaluation', journal: 'Computers and Electronics in Agriculture', doi: '', keywords: ['urea applicator', 'transplanter', 'rice', 'electronics', 'precision'] },
      { year: 2022, title: 'Field losses during rice harvesting using traditional methods and mechanized harvesters', journal: 'Journal of Agricultural Engineering', doi: '', keywords: ['harvest', 'rice', 'field loss', 'mechanization', 'Bangladesh'] },
    ]
  },
  // ══════════ FSEE DEPARTMENT ══════════
  {
    id: 'FSEE001',
    name: 'Prof. M.A. Hossain',
    designation: 'Professor',
    dept: 'FSEE',
    deptFull: 'Farm Structure & Environmental Engineering',
    email: 'mahossain.fsee@bau.edu.bd',
    totalPubs: 38,
    researchAreas: ['Farm Building Design', 'Solar Energy Systems', 'Environmental Control in Livestock Facilities', 'Greenhouse Technology', 'Waste Management'],
    majorWork: 'Leading researcher in climate-controlled poultry and livestock housing design in Bangladesh. Pioneering work on passive solar greenhouse design for year-round vegetable production and sustainable farm building construction.',
    papers: [
      { year: 2024, title: 'Passive solar greenhouse design for tropical climate: thermal performance and crop productivity', journal: 'Energy and Buildings', doi: '', keywords: ['greenhouse', 'solar', 'passive', 'tropical', 'vegetable'] },
      { year: 2023, title: 'Thermal environment in poultry houses: impact of insulation and ventilation design', journal: 'Biosystems Engineering', doi: '', keywords: ['poultry', 'thermal', 'ventilation', 'livestock', 'housing'] },
      { year: 2022, title: 'Biogas-powered lighting system for rural farm buildings in Bangladesh', journal: 'Renewable Energy', doi: '', keywords: ['biogas', 'lighting', 'farm building', 'rural', 'Bangladesh'] },
      { year: 2021, title: 'Low-cost drip irrigation system using rainwater harvesting for homestead gardens', journal: 'Agricultural Water Management', doi: '', keywords: ['rainwater harvesting', 'drip irrigation', 'homestead', 'Bangladesh'] },
    ]
  },
  {
    id: 'FSEE002',
    name: 'Dr. M.G. Mostofa Amin',
    designation: 'Professor',
    dept: 'FSEE',
    deptFull: 'Farm Structure & Environmental Engineering',
    email: 'mgmamin.fsee@bau.edu.bd',
    totalPubs: 41,
    researchAreas: ['Wastewater Treatment', 'Soil and Water Conservation', 'Environmental Pollution', 'Agricultural Drainage', 'Water Quality Management'],
    majorWork: 'Extensive research on wastewater treatment using constructed wetlands and phytoremediation. Key contributions to soil erosion modeling and sustainable drainage system design for agricultural lands in Bangladesh.',
    papers: [
      { year: 2024, title: 'Constructed wetlands for treating dairy wastewater: pollutant removal efficiency in Bangladesh', journal: 'Journal of Environmental Management', doi: '', keywords: ['constructed wetland', 'dairy', 'wastewater', 'treatment', 'Bangladesh'] },
      { year: 2023, title: 'Soil erosion risk assessment using RUSLE model and GIS in hilly areas of Bangladesh', journal: 'Catena', doi: '', keywords: ['soil erosion', 'RUSLE', 'GIS', 'Bangladesh', 'hilly'] },
      { year: 2022, title: 'Heavy metal contamination in agricultural soils near industrial zones of Bangladesh', journal: 'Environmental Pollution', doi: '', keywords: ['heavy metal', 'soil contamination', 'industrial', 'pollution', 'Bangladesh'] },
      { year: 2020, title: 'Effectiveness of surface drainage system in reducing waterlogging in haor areas', journal: 'Agricultural Water Management', doi: '', keywords: ['drainage', 'waterlogging', 'haor', 'Bangladesh', 'environmental'] },
    ]
  },
  {
    id: 'FSEE003',
    name: 'Dr. Md. Ataur Rahman',
    designation: 'Professor',
    dept: 'FSEE',
    deptFull: 'Farm Structure & Environmental Engineering',
    email: 'ataur.fsee@bau.edu.bd',
    totalPubs: 29,
    researchAreas: ['Renewable Energy in Agriculture', 'Solar PV Systems', 'Biomass Energy', 'Energy Audit in Farm Buildings', 'Climate-resilient Farm Infrastructure'],
    majorWork: 'Research on solar photovoltaic systems for agricultural applications and energy auditing of farm buildings. Contributions to biomass energy systems for rural agricultural processing and climate-resilient infrastructure design for flood-prone areas.',
    papers: [
      { year: 2024, title: 'Solar PV-powered irrigation: techno-economic analysis for haor areas of Bangladesh', journal: 'Renewable Energy', doi: '', keywords: ['solar PV', 'irrigation', 'techno-economic', 'haor', 'Bangladesh'] },
      { year: 2023, title: 'Energy audit of rice mills in Bangladesh: efficiency improvement potential', journal: 'Energy', doi: '', keywords: ['energy audit', 'rice mill', 'efficiency', 'Bangladesh', 'renewable'] },
      { year: 2022, title: 'Flood-resilient farm structure design guidelines for char and haor areas', journal: 'International Journal of Disaster Risk Reduction', doi: '', keywords: ['flood', 'farm structure', 'resilient', 'haor', 'char'] },
    ]
  },
];

// Build searchable keyword index
publicationsData.forEach(faculty => {
  faculty._searchText = [
    faculty.name,
    faculty.dept,
    faculty.deptFull,
    faculty.designation,
    faculty.majorWork,
    ...faculty.researchAreas,
    ...faculty.papers.flatMap(p => [p.title, p.journal, ...p.keywords])
  ].join(' ').toLowerCase();
});

// ─── PUBLICATIONS SECTION ────────────────────────────────────
function renderPublications() {
  const dept = document.getElementById('pub-dept-filter')?.value || 'ALL';
  const query = (document.getElementById('pub-search-input')?.value || '').toLowerCase().trim();
  const sort = document.getElementById('pub-sort-select')?.value || 'pubs';

  let filtered = publicationsData.filter(f => {
    if (dept !== 'ALL' && f.dept !== dept) return false;
    if (query && !f._searchText.includes(query)) return false;
    return true;
  });

  if (sort === 'pubs') filtered.sort((a, b) => b.totalPubs - a.totalPubs);
  else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  const container = document.getElementById('pub-cards-container');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `<div class="pub-empty"><i class="fas fa-search"></i><p>No results found for "<strong>${query}</strong>"</p></div>`;
    return;
  }

  container.innerHTML = filtered.map(f => renderFacultyCard(f, query)).join('');
  updatePubStats(filtered);
}

function renderFacultyCard(f, query) {
  const deptColors = { IWM: '#4facfe', FPM: '#f7971e', FSEE: '#a18cd1' };
  const color = deptColors[f.dept] || '#ff7eb3';

  const matchingPapers = query
    ? f.papers.filter(p => p.title.toLowerCase().includes(query) || p.keywords.some(k => k.includes(query)) || p.journal.toLowerCase().includes(query))
    : f.papers.slice(0, 3);

  const papersHtml = matchingPapers.slice(0, 4).map(p => `
    <div class="pub-paper-item">
      <div class="pub-paper-year">${p.year}</div>
      <div class="pub-paper-info">
        <div class="pub-paper-title">${highlight(p.title, query)}</div>
        <div class="pub-paper-journal"><i class="fas fa-book-open"></i> ${p.journal}</div>
        <div class="pub-paper-tags">${p.keywords.slice(0, 4).map(k => `<span class="pub-tag ${query && k.includes(query) ? 'matched' : ''}">${k}</span>`).join('')}</div>
      </div>
      ${p.doi ? `<a href="${p.doi}" target="_blank" class="pub-doi-btn" title="Open paper"><i class="fas fa-external-link-alt"></i></a>` : ''}
    </div>`).join('');

  const socialLinks = [
    f.profileUrl ? `<a href="${f.profileUrl}" target="_blank" class="pub-social-btn bau-btn" title="BAU Profile"><i class="fas fa-university"></i></a>` : '',
    f.researchGate ? `<a href="${f.researchGate}" target="_blank" class="pub-social-btn rg-btn" title="ResearchGate"><i class="fab fa-researchgate"></i></a>` : '',
    f.googleScholar ? `<a href="${f.googleScholar}" target="_blank" class="pub-social-btn gs-btn" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>` : '',
    f.orcid ? `<a href="${f.orcid}" target="_blank" class="pub-social-btn orcid-btn" title="ORCID"><i class="fas fa-id-card"></i></a>` : '',
  ].filter(Boolean).join('');

  return `
    <div class="pub-faculty-card" id="pub-card-${f.id}">
      <div class="pub-card-header" style="background:linear-gradient(135deg,${color}22,${color}11);border-left:4px solid ${color};">
        <div class="pub-avatar" style="background:linear-gradient(135deg,${color},${color}99);">
          ${f.name.split(' ').map(w => w[0]).slice(0,2).join('')}
        </div>
        <div class="pub-faculty-info">
          <h3>${highlight(f.name, query)}</h3>
          <div class="pub-designation">${f.designation}</div>
          <div class="pub-dept-badge" style="background:${color}33;color:${color};">${f.deptFull}</div>
        </div>
        <div class="pub-count-badge" style="background:linear-gradient(135deg,${color},${color}99);">
          <span class="pub-count-num">${f.totalPubs}</span>
          <span class="pub-count-label">Papers</span>
        </div>
      </div>
      <div class="pub-card-body">
        <div class="pub-research-areas">
          <div class="pub-section-label"><i class="fas fa-flask"></i> Research Areas</div>
          <div class="pub-areas-wrap">
            ${f.researchAreas.map(a => `<span class="pub-area-tag ${query && a.toLowerCase().includes(query) ? 'matched' : ''}">${a}</span>`).join('')}
          </div>
        </div>
        <div class="pub-major-work">
          <div class="pub-section-label"><i class="fas fa-star"></i> Major Contributions</div>
          <p>${highlight(f.majorWork, query)}</p>
        </div>
        <div class="pub-papers-list">
          <div class="pub-section-label"><i class="fas fa-file-alt"></i> ${query && matchingPapers.length > 0 ? `${matchingPapers.length} Matching` : 'Recent'} Publications</div>
          ${papersHtml || '<p style="color:rgba(255,255,255,0.5);font-size:0.85rem;padding:8px 0;">No papers match this keyword</p>'}
          ${f.papers.length > 4 && !query ? `<div class="pub-more-btn" onclick="toggleAllPapers('${f.id}')"><i class="fas fa-chevron-down"></i> View all ${f.totalPubs} publications</div>` : ''}
        </div>
        <div class="pub-card-footer">
          ${f.email ? `<a href="mailto:${f.email}" class="pub-contact"><i class="fas fa-envelope"></i> ${f.email}</a>` : ''}
          <div class="pub-social-links">${socialLinks}</div>
        </div>
      </div>
    </div>`;
}

function highlight(text, query) {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

function updatePubStats(filtered) {
  const totalPapers = filtered.reduce((s, f) => s + f.totalPubs, 0);
  const el = document.getElementById('pub-stats-bar');
  if (el) el.innerHTML = `
    <span><i class="fas fa-users"></i> <strong>${filtered.length}</strong> Faculty</span>
    <span><i class="fas fa-file-alt"></i> <strong>${totalPapers}</strong> Total Publications</span>
    <span><i class="fas fa-flask"></i> <strong>${[...new Set(filtered.flatMap(f=>f.researchAreas))].length}</strong> Research Areas</span>
  `;
}

function toggleAllPapers(facultyId) {
  const faculty = publicationsData.find(f => f.id === facultyId);
  if (!faculty) return;
  const card = document.getElementById(`pub-card-${facultyId}`);
  if (!card) return;
  const list = card.querySelector('.pub-papers-list');
  const btn = card.querySelector('.pub-more-btn');
  const allPapers = faculty.papers.map(p => `
    <div class="pub-paper-item">
      <div class="pub-paper-year">${p.year}</div>
      <div class="pub-paper-info">
        <div class="pub-paper-title">${p.title}</div>
        <div class="pub-paper-journal"><i class="fas fa-book-open"></i> ${p.journal}</div>
        <div class="pub-paper-tags">${p.keywords.slice(0,4).map(k=>`<span class="pub-tag">${k}</span>`).join('')}</div>
      </div>
      ${p.doi ? `<a href="${p.doi}" target="_blank" class="pub-doi-btn"><i class="fas fa-external-link-alt"></i></a>` : ''}
    </div>`).join('');
  list.innerHTML = `<div class="pub-section-label"><i class="fas fa-file-alt"></i> All ${faculty.totalPubs} Publications (${faculty.papers.length} shown here)</div>${allPapers}<div class="pub-more-btn" onclick="renderPublications()"><i class="fas fa-chevron-up"></i> Show less</div>`;
}

function showPublications() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="publications-section">
      <div class="pub-hero">
        <div class="pub-hero-bg"></div>
        <div class="pub-hero-content">
          <h2><i class="fas fa-scroll"></i> AET Faculty Research Publications</h2>
          <p>Explore the research work of faculty members across IWM, FPM & FSEE departments</p>
          <div id="pub-stats-bar" class="pub-stats-bar"></div>
        </div>
      </div>

      <div class="pub-controls">
        <div class="pub-search-wrap">
          <i class="fas fa-search pub-search-icon"></i>
          <input type="text" id="pub-search-input" placeholder="Search by keyword, author, topic, journal..." oninput="renderPublications()" autocomplete="off">
          <button onclick="document.getElementById('pub-search-input').value='';renderPublications();" class="pub-clear-btn" title="Clear"><i class="fas fa-times"></i></button>
        </div>
        <div class="pub-filter-row">
          <select id="pub-dept-filter" onchange="renderPublications()">
            <option value="ALL">🏫 All Departments</option>
            <option value="IWM">💧 IWM — Irrigation & Water Management</option>
            <option value="FPM">⚙️ FPM — Farm Power & Machinery</option>
            <option value="FSEE">🏗️ FSEE — Farm Structure & Environmental Engg.</option>
          </select>
          <select id="pub-sort-select" onchange="renderPublications()">
            <option value="pubs">Sort: Most Publications</option>
            <option value="name">Sort: Name A-Z</option>
          </select>
        </div>
        <div class="pub-keyword-chips">
          <span class="pub-chip" onclick="searchPub('irrigation')">irrigation</span>
          <span class="pub-chip" onclick="searchPub('climate change')">climate change</span>
          <span class="pub-chip" onclick="searchPub('rice')">rice</span>
          <span class="pub-chip" onclick="searchPub('groundwater')">groundwater</span>
          <span class="pub-chip" onclick="searchPub('solar')">solar energy</span>
          <span class="pub-chip" onclick="searchPub('machine learning')">machine learning</span>
          <span class="pub-chip" onclick="searchPub('biogas')">biogas</span>
          <span class="pub-chip" onclick="searchPub('haor')">haor</span>
          <span class="pub-chip" onclick="searchPub('precision')">precision agriculture</span>
          <span class="pub-chip" onclick="searchPub('GIS')">GIS</span>
        </div>
      </div>

      <div id="pub-cards-container" class="pub-cards-container"></div>
    </div>`;
  renderPublications();
}

function searchPub(keyword) {
  const inp = document.getElementById('pub-search-input');
  if (inp) { inp.value = keyword; renderPublications(); inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

// ─── MUSIC SECTION (Creative Auto-play Player) ───────────────
const musicPlaylist = [
  { title: 'আমার সোনার বাংলা', artist: 'National Anthem', ytId: 'S6-cFnHxPOA', mood: '🇧🇩', genre: 'Patriotic' },
  { title: 'Amar Shonar Bangla Remix', artist: 'Folk Fusion', ytId: 'AXgO1sBF8b4', mood: '🎵', genre: 'Folk' },
  { title: 'Lofi Study Beats', artist: 'Chill Vibes', ytId: 'jfKfPfyJRdk', mood: '📚', genre: 'Lofi' },
  { title: 'Bangla Folk Medley', artist: 'Traditional', ytId: 'VbdNz5LQMFI', mood: '🎶', genre: 'Folk' },
  { title: 'Peaceful Study Music', artist: 'Ambient', ytId: '5qap5aO4i9A', mood: '🧘', genre: 'Ambient' },
  { title: 'Bangladesh Nature Sounds', artist: 'Nature Relax', ytId: 'Qm846KdZN_M', mood: '🌿', genre: 'Nature' },
  { title: 'Classic Rabindra Sangeet', artist: 'Tagore', ytId: 'Ht8GcQi38C4', mood: '🎼', genre: 'Classical' },
  { title: 'Concentration Music for Study', artist: 'Focus Flow', ytId: 'sjkrrmBnpGE', mood: '🎯', genre: 'Focus' },
];

function showMusic() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="music-section">
      <div class="music-bg-fx">
        <div class="music-orb orb1"></div>
        <div class="music-orb orb2"></div>
        <div class="music-orb orb3"></div>
      </div>
      <div class="music-container">
        <div class="music-header">
          <h2><i class="fas fa-music"></i> EduHub <span>Music</span> Player</h2>
          <p>Relax, focus & study with carefully curated music 🎵</p>
        </div>

        <div class="music-now-playing">
          <div class="music-vinyl" id="music-vinyl">
            <div class="vinyl-label">
              <i class="fas fa-music"></i>
            </div>
          </div>
          <div class="music-visualizer" id="music-visualizer">
            ${Array.from({length:20}, (_,i) => `<div class="vis-bar" style="animation-delay:${i*0.07}s"></div>`).join('')}
          </div>
          <div class="music-track-info">
            <div class="music-track-title" id="music-track-title">${musicPlaylist[0].title}</div>
            <div class="music-track-artist" id="music-track-artist">${musicPlaylist[0].artist}</div>
            <div class="music-track-genre" id="music-track-genre">${musicPlaylist[0].mood} ${musicPlaylist[0].genre}</div>
          </div>
        </div>

        <div class="music-controls">
          <button class="music-ctrl-btn" onclick="musicPrev()" title="Previous"><i class="fas fa-step-backward"></i></button>
          <button class="music-ctrl-btn music-play-btn" id="music-play-btn" onclick="musicTogglePlay()" title="Play/Pause">
            <i class="fas fa-play" id="music-play-icon"></i>
          </button>
          <button class="music-ctrl-btn" onclick="musicNext()" title="Next"><i class="fas fa-step-forward"></i></button>
          <button class="music-ctrl-btn" onclick="musicShuffle()" title="Shuffle" id="music-shuffle-btn"><i class="fas fa-random"></i></button>
        </div>

        <div class="music-autoplay-toggle">
          <label class="autoplay-switch">
            <input type="checkbox" id="autoplay-toggle" onchange="toggleAutoPlay(this)" checked>
            <span class="autoplay-slider"></span>
            <span class="autoplay-label">🔄 Auto-play next track</span>
          </label>
        </div>

        <div class="music-volume-wrap">
          <i class="fas fa-volume-down"></i>
          <input type="range" id="music-volume" min="0" max="100" value="70" class="music-volume-slider" oninput="setMusicVolume(this.value)">
          <i class="fas fa-volume-up"></i>
        </div>

        <div class="music-yt-wrap hidden" id="music-yt-wrap">
          <div id="music-yt-player"></div>
        </div>

        <div class="music-playlist">
          <div class="playlist-header"><i class="fas fa-list-music"></i> Playlist</div>
          <div class="playlist-tracks">
            ${musicPlaylist.map((t, i) => `
              <div class="playlist-item ${i === 0 ? 'active' : ''}" id="ptrack-${i}" onclick="playTrack(${i})">
                <div class="playlist-num">${i + 1}</div>
                <div class="playlist-icon">${t.mood}</div>
                <div class="playlist-info">
                  <div class="playlist-title">${t.title}</div>
                  <div class="playlist-artist">${t.artist} · ${t.genre}</div>
                </div>
                <div class="playlist-play-icon"><i class="fas fa-play-circle"></i></div>
              </div>`).join('')}
          </div>
        </div>

        <div class="music-note">
          <i class="fas fa-info-circle"></i>
          Music plays via YouTube. Make sure you're connected to the internet.
          <br>Best experienced with headphones 🎧
        </div>
      </div>
    </div>`;

  loadYouTubeAPI();
}

function loadYouTubeAPI() {
  if (window.YT && window.YT.Player) { initYTPlayer(); return; }
  if (document.getElementById('yt-api-script')) { setTimeout(() => { if (window.YT && window.YT.Player) initYTPlayer(); }, 2000); return; }
  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  window.onYouTubeIframeAPIReady = initYTPlayer;
}

function initYTPlayer() {
  if (ytPlayer) return;
  const wrap = document.getElementById('music-yt-player');
  if (!wrap) return;
  ytPlayer = new YT.Player('music-yt-player', {
    height: '1', width: '1',
    videoId: musicPlaylist[currentTrackIndex].ytId,
    playerVars: { autoplay: 0, controls: 0, rel: 0, modestbranding: 1 },
    events: {
      onReady: (e) => { ytReady = true; setMusicVolume(70); },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.ENDED) {
          const autoplay = document.getElementById('autoplay-toggle');
          if (autoplay && autoplay.checked) musicNext();
          else setMusicPlayState(false);
        } else if (e.data === YT.PlayerState.PLAYING) {
          setMusicPlayState(true);
        } else if (e.data === YT.PlayerState.PAUSED) {
          setMusicPlayState(false);
        }
      }
    }
  });
}

function musicTogglePlay() {
  if (!ytPlayer || !ytReady) { showToast('⏳ Player loading, please wait...'); return; }
  if (isPlaying) { ytPlayer.pauseVideo(); }
  else { ytPlayer.playVideo(); }
}

function playTrack(index) {
  currentTrackIndex = index;
  updateTrackUI();
  if (ytPlayer && ytReady) {
    ytPlayer.loadVideoById(musicPlaylist[index].ytId);
    ytPlayer.playVideo();
  }
}

function musicNext() {
  currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
  playTrack(currentTrackIndex);
}

function musicPrev() {
  currentTrackIndex = (currentTrackIndex - 1 + musicPlaylist.length) % musicPlaylist.length;
  playTrack(currentTrackIndex);
}

function musicShuffle() {
  const btn = document.getElementById('music-shuffle-btn');
  const randIdx = Math.floor(Math.random() * musicPlaylist.length);
  playTrack(randIdx);
  if (btn) { btn.style.color = '#ff7eb3'; setTimeout(() => btn.style.color = '', 500); }
}

function setMusicVolume(val) {
  if (ytPlayer && ytReady) ytPlayer.setVolume(parseInt(val));
}

function toggleAutoPlay(checkbox) {
  showToast(checkbox.checked ? '🔄 Auto-play enabled' : '⏹ Auto-play disabled');
}

function setMusicPlayState(playing) {
  isPlaying = playing;
  const icon = document.getElementById('music-play-icon');
  const btn = document.getElementById('music-play-btn');
  const vinyl = document.getElementById('music-vinyl');
  const bars = document.querySelectorAll('.vis-bar');
  if (icon) icon.className = playing ? 'fas fa-pause' : 'fas fa-play';
  if (btn) btn.classList.toggle('playing', playing);
  if (vinyl) vinyl.classList.toggle('spinning', playing);
  bars.forEach(b => b.classList.toggle('active', playing));
}

function updateTrackUI() {
  const t = musicPlaylist[currentTrackIndex];
  const titleEl = document.getElementById('music-track-title');
  const artistEl = document.getElementById('music-track-artist');
  const genreEl = document.getElementById('music-track-genre');
  if (titleEl) titleEl.textContent = t.title;
  if (artistEl) artistEl.textContent = t.artist;
  if (genreEl) genreEl.textContent = `${t.mood} ${t.genre}`;
  document.querySelectorAll('.playlist-item').forEach((el, i) => {
    el.classList.toggle('active', i === currentTrackIndex);
  });
}

// ─── COMMUNITY SECTION ───────────────────────────────────────
function showCommunity() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="community-section">
      <div class="community-header">
        <h2><i class="fas fa-comments"></i> Community Q&A</h2>
        <p>Share knowledge, ask questions, and connect with AET students</p>
      </div>
      <div class="community-controls">
        <div class="community-search">
          <input type="text" id="community-search" placeholder="Search posts..." oninput="filterCommunityPosts()">
          <i class="fas fa-search"></i>
        </div>
        <select id="community-category-filter" onchange="filterCommunityPosts()">
          <option value="ALL">All Categories</option>
          <option value="question">❓ Questions</option>
          <option value="discussion">💬 Discussion</option>
          <option value="resource">📚 Resources</option>
          <option value="announcement">📢 Announcement</option>
        </select>
        <button onclick="showNewPostForm()" class="eye-catchy-btn"><i class="fas fa-plus"></i> New Post</button>
      </div>
      <div id="new-post-form" class="hidden new-post-container">
        <h3><i class="fas fa-edit"></i> Create Post</h3>
        <select id="post-category">
          <option value="question">❓ Question</option>
          <option value="discussion">💬 Discussion</option>
          <option value="resource">📚 Resource Share</option>
          <option value="announcement">📢 Announcement</option>
        </select>
        <input type="text" id="post-title" placeholder="Post title *" maxlength="200">
        <textarea id="post-body" placeholder="Write your post content here..." rows="4" maxlength="2000"></textarea>
        <div class="post-actions">
          <button onclick="submitCommunityPost()" class="eye-catchy-btn"><i class="fas fa-paper-plane"></i> Post</button>
          <button onclick="document.getElementById('new-post-form').classList.add('hidden')" class="eye-catchy-btn" style="background:rgba(255,255,255,0.1)">Cancel</button>
        </div>
      </div>
      <div id="community-posts-list" class="community-posts-list">
        <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading posts...</div>
      </div>
    </div>`;
  loadCommunityPosts();
}

function showNewPostForm() {
  const form = document.getElementById('new-post-form');
  if (form) { form.classList.toggle('hidden'); }
}

function loadCommunityPosts() {
  if (typeof db === 'undefined') { document.getElementById('community-posts-list').innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5);">Firebase not connected</p>'; return; }
  db.collection('communityPosts').orderBy('timestamp', 'desc').limit(50)
    .onSnapshot(snap => {
      communityPosts = [];
      snap.forEach(doc => communityPosts.push({ id: doc.id, ...doc.data() }));
      filterCommunityPosts();
    }, err => { console.error(err); });
}

function filterCommunityPosts() {
  const query = (document.getElementById('community-search')?.value || '').toLowerCase();
  const cat = document.getElementById('community-category-filter')?.value || 'ALL';
  let filtered = communityPosts.filter(p => {
    if (cat !== 'ALL' && p.category !== cat) return false;
    if (query && !((p.title || '').toLowerCase().includes(query) || (p.body || '').toLowerCase().includes(query))) return false;
    return true;
  });
  renderCommunityPosts(filtered);
}

function renderCommunityPosts(posts) {
  const list = document.getElementById('community-posts-list');
  if (!list) return;
  if (!posts.length) { list.innerHTML = '<div class="empty-state"><i class="fas fa-comments"></i><p>No posts found. Be the first to post!</p></div>'; return; }
  const catIcons = { question: '❓', discussion: '💬', resource: '📚', announcement: '📢' };
  list.innerHTML = posts.map(p => `
    <div class="community-post-card">
      <div class="post-cat-badge">${catIcons[p.category] || '💬'} ${p.category || 'Discussion'}</div>
      <h3 class="post-title">${p.title || 'Untitled Post'}</h3>
      <p class="post-body">${(p.body || '').substring(0, 300)}${(p.body || '').length > 300 ? '...' : ''}</p>
      <div class="post-meta">
        <span><i class="fas fa-user"></i> ${p.authorName || 'Anonymous'}</span>
        <span><i class="fas fa-clock"></i> ${getTimeAgo(p.timestamp?.toDate ? p.timestamp.toDate() : new Date())}</span>
        <span><i class="fas fa-heart"></i> ${p.likes || 0}</span>
        <span><i class="fas fa-comment"></i> ${p.commentCount || 0}</span>
      </div>
      <div class="post-actions-row">
        <button onclick="likePost('${p.id}')" class="post-action-btn"><i class="fas fa-heart"></i> Like</button>
        <button onclick="openPostComments('${p.id}')" class="post-action-btn"><i class="fas fa-comment"></i> Comment</button>
        ${(currentUser && (currentUser.id === p.authorId || currentUser.id === '2105056')) ? `<button onclick="deletePost('${p.id}')" class="post-action-btn delete-btn"><i class="fas fa-trash"></i></button>` : ''}
      </div>
    </div>`).join('');
}

function submitCommunityPost() {
  if (!currentUser) { alert('Please log in first.'); return; }
  const title = document.getElementById('post-title')?.value?.trim();
  const body = document.getElementById('post-body')?.value?.trim();
  const category = document.getElementById('post-category')?.value;
  if (!title || !body) { alert('Please fill in title and content.'); return; }
  if (typeof db === 'undefined') return;
  db.collection('communityPosts').add({
    title, body, category,
    authorId: currentUser.id,
    authorName: currentUser.nickname || currentUser.fullName || currentUser.id,
    authorDept: currentUser.department || '',
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    likes: 0, commentCount: 0
  }).then(() => {
    document.getElementById('post-title').value = '';
    document.getElementById('post-body').value = '';
    document.getElementById('new-post-form').classList.add('hidden');
    showToast('Post published! ✅');
  }).catch(console.error);
}

function likePost(postId) {
  if (!currentUser || typeof db === 'undefined') return;
  const ref = db.collection('communityPosts').doc(postId);
  ref.update({ likes: firebase.firestore.FieldValue.increment(1) });
}

function deletePost(postId) {
  if (!confirm('Delete this post?')) return;
  if (typeof db === 'undefined') return;
  db.collection('communityPosts').doc(postId).delete().then(() => showToast('Post deleted.'));
}

function openPostComments(postId) {
  showToast('Comment feature: reply below the post (coming soon!)');
}

// ─── GALLERY SECTION ─────────────────────────────────────────
function showGallery() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="gallery-section">
      <div class="gallery-header">
        <h2><i class="fas fa-images"></i> Photo Gallery</h2>
        <p>Memories from campus life, field trips, labs, and events</p>
      </div>
      <div class="gallery-controls">
        <select id="gallery-filter" onchange="loadGallery()">
          <option value="ALL">All Photos</option>
          <option value="Campus Life">🏫 Campus Life</option>
          <option value="Field Trip">🌾 Field Trip</option>
          <option value="Lab">🔬 Lab</option>
          <option value="Event">🎉 Event</option>
          <option value="Achievement">🏆 Achievement</option>
        </select>
        <button onclick="document.getElementById('gallery-file-input').click()" class="eye-catchy-btn">
          <i class="fas fa-camera"></i> Upload Photo
        </button>
      </div>
      <div id="pending-photos-section" class="admin-only hidden">
        <h3 style="color:#ffd700;"><i class="fas fa-clock"></i> Pending Approval</h3>
        <div id="pending-photos-grid" class="gallery-grid"></div>
      </div>
      <div id="gallery-grid" class="gallery-grid">
        <div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading gallery...</div>
      </div>
    </div>`;
  loadGallery();
}

function loadGallery() {
  if (typeof db === 'undefined') return;
  const filter = document.getElementById('gallery-filter')?.value || 'ALL';
  let query = db.collection('galleryPhotos').where('approved', '==', true).orderBy('timestamp', 'desc').limit(30);
  if (filter !== 'ALL') query = db.collection('galleryPhotos').where('approved', '==', true).where('category', '==', filter).orderBy('timestamp', 'desc').limit(30);
  query.get().then(snap => {
    galleryPhotos = [];
    snap.forEach(doc => galleryPhotos.push({ id: doc.id, ...doc.data() }));
    renderGallery();
  }).catch(err => { console.error(err); document.getElementById('gallery-grid').innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5);">Gallery loading error. Indexes may still be building.</p>'; });
}

function renderGallery() {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;
  if (!galleryPhotos.length) { grid.innerHTML = '<div class="empty-state"><i class="fas fa-images"></i><p>No photos yet. Be the first to upload!</p></div>'; return; }
  grid.innerHTML = galleryPhotos.map(photo => `
    <div class="gallery-item" onclick="openImagePreview('${photo.imageData || photo.imageUrl || ''}')">
      <img src="${photo.imageData || photo.imageUrl || ''}" alt="${photo.caption || 'Photo'}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'150\'%3E%3Crect fill=\'%23333\' width=\'200\' height=\'150\'/%3E%3Ctext fill=\'%23999\' font-size=\'14\' x=\'50%25\' y=\'50%25\' text-anchor=\'middle\'%3EImage%3C/text%3E%3C/svg%3E'">
      <div class="gallery-overlay">
        <div class="gallery-caption">${photo.caption || ''}</div>
        <div class="gallery-meta">
          <span><i class="fas fa-heart"></i> ${photo.likes || 0}</span>
          <span><i class="fas fa-tag"></i> ${photo.category || ''}</span>
        </div>
        ${(currentUser && (currentUser.id === photo.uploadedBy || currentUser.id === '2105056')) ? `<button onclick="event.stopPropagation();deletePhoto('${photo.id}')" class="gallery-delete-btn"><i class="fas fa-trash"></i></button>` : ''}
      </div>
    </div>`).join('');
}

function handleGalleryUpload(event) {
  if (!currentUser) { alert('Please log in first.'); return; }
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { alert('Image too large! Please compress to under 2MB.'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    const caption = prompt('Add a caption for your photo (optional):') || '';
    const category = prompt('Category? (Campus Life / Field Trip / Lab / Event / Achievement)') || 'Campus Life';
    const isAdmin = currentUser.id === '2105056';
    if (typeof db === 'undefined') return;
    db.collection('galleryPhotos').add({
      imageData: e.target.result,
      caption, category,
      uploadedBy: currentUser.id,
      uploaderName: currentUser.nickname || currentUser.fullName || '',
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      approved: isAdmin,
      likes: 0, commentCount: 0
    }).then(() => { showToast(isAdmin ? '📸 Photo uploaded!' : '📸 Photo submitted for approval!'); loadGallery(); })
      .catch(console.error);
  };
  reader.readAsDataURL(file);
  event.target.value = '';
}

function deletePhoto(photoId) {
  if (!confirm('Delete this photo?')) return;
  if (typeof db === 'undefined') return;
  db.collection('galleryPhotos').doc(photoId).delete().then(() => { showToast('Photo deleted.'); loadGallery(); });
}

function openImagePreview(src) {
  if (!src) return;
  const modal = document.getElementById('image-preview-modal');
  const img = document.getElementById('preview-img-el');
  if (modal && img) { img.src = src; modal.classList.remove('hidden'); }
}

function closeImagePreview() {
  const modal = document.getElementById('image-preview-modal');
  if (modal) modal.classList.add('hidden');
}

// ─── STUDY ABROAD SECTION ────────────────────────────────────
const abroadData = [
  { country: 'Germany 🇩🇪', flag: '🇩🇪', universities: ['TU Munich', 'Uni Hohenheim', 'Humboldt University Berlin', 'KIT Karlsruhe'], scholarships: ['DAAD (Fully Funded)', 'Humboldt Fellowship'], fields: ['Agricultural Engineering', 'Environmental Engineering', 'Water Resources'], depts: ['IWM', 'FPM', 'FSEE'], deadline: 'Oct–Nov (Winter), Apr–May (Summer)', tip: 'German is helpful but many programs are in English. DAAD is the most accessible scholarship for Bangladeshis.' },
  { country: 'Japan 🇯🇵', flag: '🇯🇵', universities: ['Tokyo University of Agriculture', 'Kyoto University', 'Tohoku University', 'Hokkaido University'], scholarships: ['MEXT (Fully Funded)', 'JASSO Scholarship'], fields: ['Farm Machinery', 'Irrigation', 'Bioresources'], depts: ['FPM', 'IWM'], deadline: 'May–June (for October intake)', tip: 'MEXT is highly competitive. Contact a Japanese professor first — an LoA greatly increases your chances.' },
  { country: 'USA 🇺🇸', flag: '🇺🇸', universities: ['Cornell University', 'UC Davis', 'Iowa State', 'North Dakota State University'], scholarships: ['Fulbright (Fully Funded)', 'GRA/GTA'], fields: ['Precision Agriculture', 'Water Resources', 'Agricultural Systems'], depts: ['IWM', 'FPM', 'FSEE'], deadline: 'Dec–Jan (for Fall)', tip: 'GRE score matters. Contact professors early for GRA/GTA positions — these often cover tuition + stipend.' },
  { country: 'Netherlands 🇳🇱', flag: '🇳🇱', universities: ['Wageningen University', 'IHE Delft', 'TU Delft'], scholarships: ['Nuffic-NICHE', 'Orange Knowledge Programme', 'Holland Scholarship'], fields: ['Water Management', 'Environmental Sciences', 'Food Systems'], depts: ['IWM', 'FSEE'], deadline: 'Jan–Feb (for September)', tip: 'Wageningen is the world\'s top agricultural university. Many BAU IWM professors have studied/collaborated here.' },
  { country: 'Australia 🇦🇺', flag: '🇦🇺', universities: ['University of Queensland', 'Melbourne University', 'Monash University'], scholarships: ['Australia Awards (Fully Funded)', 'Endeavour Scholarships'], fields: ['Water Engineering', 'Agricultural Systems', 'Environmental Management'], depts: ['IWM', 'FSEE'], deadline: 'Apr–May (for February intake)', tip: 'Australia Awards are highly competitive but fully funded. Emphasize development impact in your application.' },
  { country: 'South Korea 🇰🇷', flag: '🇰🇷', universities: ['Seoul National University', 'Kyungpook National University', 'Chonnam National University'], scholarships: ['KGSP (GKS) Fully Funded', 'University Scholarships'], fields: ['Smart Farming', 'Agricultural Machinery', 'Precision Agriculture'], depts: ['FPM', 'IWM'], deadline: 'Sep–Oct (Embassy) / Feb–Mar (University)', tip: 'Korea is rapidly advancing in smart agriculture. KGSP covers full tuition, living, and language training.' },
];

function showStudyAbroad() {
  const content = document.getElementById('content');
  if (!content) return;
  const deptFilter = `<div class="abroad-controls">
    <select id="abroad-dept-filter" onchange="filterAbroad()">
      <option value="ALL">All Departments</option>
      <option value="IWM">IWM</option>
      <option value="FPM">FPM</option>
      <option value="FSEE">FSEE</option>
    </select>
  </div>`;
  content.innerHTML = `
    <div class="abroad-section">
      <div class="abroad-hero">
        <h2><i class="fas fa-plane"></i> Study Abroad Opportunities</h2>
        <p>Explore top universities and scholarships for AET students worldwide</p>
        ${deptFilter}
      </div>
      <div id="abroad-cards-grid" class="abroad-cards-grid">
        ${abroadData.map((c, i) => renderAbroadCard(c, i)).join('')}
      </div>
    </div>`;
}

function filterAbroad() {
  const dept = document.getElementById('abroad-dept-filter')?.value || 'ALL';
  const grid = document.getElementById('abroad-cards-grid');
  if (!grid) return;
  const filtered = dept === 'ALL' ? abroadData : abroadData.filter(c => c.depts.includes(dept));
  grid.innerHTML = filtered.map((c, i) => renderAbroadCard(c, i)).join('');
}

function renderAbroadCard(c, i) {
  const colors = ['#4facfe', '#f7971e', '#a18cd1', '#43e97b', '#fa709a', '#f093fb'];
  const color = colors[i % colors.length];
  return `
    <div class="abroad-card" style="border-top:3px solid ${color};">
      <div class="abroad-flag">${c.flag}</div>
      <h3 style="color:${color};">${c.country}</h3>
      <div class="abroad-section-label">🏫 Universities</div>
      <ul class="abroad-list">${c.universities.map(u => `<li>${u}</li>`).join('')}</ul>
      <div class="abroad-section-label">💰 Scholarships</div>
      <ul class="abroad-list scholarship-list">${c.scholarships.map(s => `<li><i class="fas fa-medal"></i> ${s}</li>`).join('')}</ul>
      <div class="abroad-section-label">🔬 Relevant Fields</div>
      <div class="abroad-tags">${c.fields.map(f => `<span class="abroad-tag">${f}</span>`).join('')}</div>
      <div class="abroad-section-label">📅 Deadline</div>
      <div class="abroad-deadline">${c.deadline}</div>
      <div class="abroad-tip"><i class="fas fa-lightbulb"></i> ${c.tip}</div>
      <div class="abroad-dept-tags">${c.depts.map(d => `<span class="dept-badge">${d}</span>`).join('')}</div>
    </div>`;
}

// ─── DIARY SECTION ───────────────────────────────────────────
function showDiary() {
  const content = document.getElementById('content');
  if (!content) return;
  const savedNotes = localStorage.getItem('studyDiaryNotes') || '';
  const savedTitle = localStorage.getItem('studyDiaryTitle') || '';
  content.innerHTML = `
    <div class="diary-section">
      <div class="diary-header">
        <h2><i class="fas fa-book"></i> Study Diary</h2>
        <p>Your private notes — saved locally on this device</p>
      </div>
      <div class="diary-editor">
        <input type="text" id="diary-title" placeholder="Note title..." value="${savedTitle}" oninput="saveDiary()" class="diary-title-input">
        <textarea id="diary-notes" placeholder="Write your notes, summaries, or study plans here..." oninput="saveDiary()" class="diary-textarea">${savedNotes}</textarea>
        <div class="diary-actions">
          <button onclick="downloadDiary()" class="eye-catchy-btn"><i class="fas fa-download"></i> Download</button>
          <button onclick="clearDiary()" class="eye-catchy-btn" style="background:rgba(255,100,100,0.2)"><i class="fas fa-trash"></i> Clear</button>
        </div>
        <div class="diary-meta">
          <span id="diary-word-count">0 words</span>
          <span>Auto-saved ✅</span>
        </div>
      </div>
    </div>`;
  updateDiaryWordCount();
}

function saveDiary() {
  localStorage.setItem('studyDiaryNotes', document.getElementById('diary-notes')?.value || '');
  localStorage.setItem('studyDiaryTitle', document.getElementById('diary-title')?.value || '');
  updateDiaryWordCount();
}

function updateDiaryWordCount() {
  const text = document.getElementById('diary-notes')?.value || '';
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const el = document.getElementById('diary-word-count');
  if (el) el.textContent = `${words} word${words !== 1 ? 's' : ''}`;
}

function downloadDiary() {
  const title = document.getElementById('diary-title')?.value || 'Study Notes';
  const notes = document.getElementById('diary-notes')?.value || '';
  const blob = new Blob([`${title}\n${'='.repeat(title.length)}\n\n${notes}`], { type: 'text/plain' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `${title.replace(/[^a-z0-9]/gi, '_')}_diary.txt`; a.click();
}

function clearDiary() {
  if (!confirm('Clear all diary notes?')) return;
  localStorage.removeItem('studyDiaryNotes'); localStorage.removeItem('studyDiaryTitle');
  const t = document.getElementById('diary-title'); const n = document.getElementById('diary-notes');
  if (t) t.value = ''; if (n) n.value = '';
  updateDiaryWordCount();
}

// ─── ARTICLES / MOVIES / OTHER SECTIONS ──────────────────────
function showArticles() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="articles-section">
      <div class="section-hero"><h2><i class="fas fa-newspaper"></i> Articles & Resources</h2><p>Academic articles, news, and study resources</p></div>
      <div class="articles-grid">
        ${[
          { icon:'fas fa-tractor', title:'Agricultural Mechanization in Bangladesh', desc:'Overview of mechanization progress, challenges and future prospects in Bangladesh agriculture.', color:'#4facfe' },
          { icon:'fas fa-water', title:'Water Crisis & Sustainable Irrigation', desc:'Addressing groundwater depletion and promoting water-saving technologies in agriculture.', color:'#43e97b' },
          { icon:'fas fa-solar-panel', title:'Solar Energy in Farm Operations', desc:'Applications of solar PV in irrigation, drying, and farm electrification in rural Bangladesh.', color:'#f7971e' },
          { icon:'fas fa-seedling', title:'Precision Agriculture Adoption', desc:'Challenges and opportunities for precision agriculture adoption by smallholder farmers.', color:'#a18cd1' },
          { icon:'fas fa-cloud-rain', title:'Climate Change & Food Security', desc:'Impacts of changing climate patterns on crop production and food security in Bangladesh.', color:'#fa709a' },
          { icon:'fas fa-recycle', title:'Biogas & Circular Agriculture', desc:'Turning agricultural waste into energy — biogas potential and bioeconomy in Bangladesh farms.', color:'#f093fb' },
        ].map(a => `<div class="article-card" style="border-top:3px solid ${a.color};">
          <div class="article-icon" style="color:${a.color};"><i class="${a.icon}"></i></div>
          <h3>${a.title}</h3><p>${a.desc}</p>
          <button class="eye-catchy-btn" style="font-size:0.8rem;margin-top:10px;" onclick="showToast('Full article coming soon!')"><i class="fas fa-book-open"></i> Read More</button>
        </div>`).join('')}
      </div>
    </div>`;
}

function showPublications() {
  // Already defined above as the main publications function
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="publications-section">
      <div class="pub-hero">
        <div class="pub-hero-bg"></div>
        <div class="pub-hero-content">
          <h2><i class="fas fa-scroll"></i> AET Faculty Research Publications</h2>
          <p>Explore the research work of faculty members across IWM, FPM & FSEE departments</p>
          <div id="pub-stats-bar" class="pub-stats-bar"></div>
        </div>
      </div>
      <div class="pub-controls">
        <div class="pub-search-wrap">
          <i class="fas fa-search pub-search-icon"></i>
          <input type="text" id="pub-search-input" placeholder="Search by keyword, author, topic, journal..." oninput="renderPublications()" autocomplete="off">
          <button onclick="document.getElementById('pub-search-input').value='';renderPublications();" class="pub-clear-btn" title="Clear"><i class="fas fa-times"></i></button>
        </div>
        <div class="pub-filter-row">
          <select id="pub-dept-filter" onchange="renderPublications()">
            <option value="ALL">🏫 All Departments</option>
            <option value="IWM">💧 IWM — Irrigation & Water Management</option>
            <option value="FPM">⚙️ FPM — Farm Power & Machinery</option>
            <option value="FSEE">🏗️ FSEE — Farm Structure & Environmental Engg.</option>
          </select>
          <select id="pub-sort-select" onchange="renderPublications()">
            <option value="pubs">Sort: Most Publications</option>
            <option value="name">Sort: Name A-Z</option>
          </select>
        </div>
        <div class="pub-keyword-chips">
          <span class="pub-chip" onclick="searchPub('irrigation')">irrigation</span>
          <span class="pub-chip" onclick="searchPub('climate change')">climate change</span>
          <span class="pub-chip" onclick="searchPub('rice')">rice</span>
          <span class="pub-chip" onclick="searchPub('groundwater')">groundwater</span>
          <span class="pub-chip" onclick="searchPub('solar')">solar energy</span>
          <span class="pub-chip" onclick="searchPub('machine learning')">machine learning</span>
          <span class="pub-chip" onclick="searchPub('biogas')">biogas</span>
          <span class="pub-chip" onclick="searchPub('haor')">haor</span>
          <span class="pub-chip" onclick="searchPub('precision')">precision agriculture</span>
          <span class="pub-chip" onclick="searchPub('GIS')">GIS</span>
        </div>
      </div>
      <div id="pub-cards-container" class="pub-cards-container"></div>
    </div>`;
  renderPublications();
}

function showMovies() {
  const content = document.getElementById('content');
  if (!content) return;
  content.innerHTML = `
    <div class="movies-section">
      <div class="section-hero"><h2><i class="fas fa-film"></i> Documentary & Films</h2><p>Educational documentaries relevant to Agricultural Engineering</p></div>
      <div class="movies-grid">
        ${[
          { title: 'Kiss the Ground', desc: 'How regenerative agriculture can revitalize soil health and fight climate change.', tag: 'Sustainability', ytId: 'K3-A4oB7n3M' },
          { title: 'Biggest Little Farm', desc: 'A couple builds a biodiverse farm from scratch — a story of perseverance and ecological balance.', tag: 'Farm Life', ytId: 'tzBDSFRqhKA' },
          { title: 'Food Inc.', desc: 'Exposing the industrial food system and its impact on health, environment and farmers.', tag: 'Food Systems', ytId: 'uWF6_dO2y7U' },
          { title: 'The Biggest Little Farm 2', desc: 'Continuing the journey of Apricot Lane Farms — resilience and ecological restoration.', tag: 'Ecology', ytId: 'o-kxNQZ5K9g' },
        ].map(m => `<div class="movie-card">
          <div class="movie-thumb" onclick="showToast('Watch on YouTube: ${m.title}')">
            <img src="https://img.youtube.com/vi/${m.ytId}/hqdefault.jpg" alt="${m.title}" onerror="this.style.display='none'">
            <div class="movie-play-overlay"><i class="fas fa-play-circle"></i></div>
          </div>
          <div class="movie-info"><span class="movie-tag">${m.tag}</span><h3>${m.title}</h3><p>${m.desc}</p></div>
        </div>`).join('')}
      </div>
    </div>`;
}

// ─── MAIN CONTENT ROUTER ─────────────────────────────────────
function showContent(section) {
  // Update active nav button
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  event && event.currentTarget && event.currentTarget.classList.add('active');

  // Close notif panel when navigating
  const panel = document.getElementById('notif-panel');
  if (panel && !panel.classList.contains('hidden')) panel.classList.add('hidden');

  switch (section) {
    case 'courses':     showCourses();     break;
    case 'community':   showCommunity();   break;
    case 'gallery':     showGallery();     break;
    case 'abroad':      showStudyAbroad(); break;
    case 'publications':showPublications();break;
    case 'articles':    showArticles();    break;
    case 'diary':       showDiary();       break;
    case 'music':       showMusic();       break;
    case 'movies':      showMovies();      break;
    default:
      const content = document.getElementById('content');
      if (content) content.innerHTML = `<div class="welcome-section"><div class="welcome-hero"><h2><i class="fas fa-seedling"></i> Welcome to EduHub AET!</h2><p>Your complete educational platform for AET, BAU Mymensingh</p></div></div>`;
  }
}

// ─── COURSES SECTION ─────────────────────────────────────────
function showCourses() {
  const content = document.getElementById('content');
  if (!content) return;
  const semesters = [
    { level: 1, sem: 1, credits: 17, hours: 21, link: '#', desc: 'Foundation courses in Mathematics, Chemistry, Physics, English' },
    { level: 1, sem: 2, credits: 17, hours: 21, link: '#', desc: 'Engineering Drawing, Biology, Introduction to Agricultural Engineering' },
    { level: 2, sem: 1, credits: 17, hours: 21, link: '#', desc: 'Fluid Mechanics, Thermodynamics, Soil Science, Farm Mechanics' },
    { level: 2, sem: 2, credits: 18, hours: 22, link: '#', desc: 'Irrigation, Surveying, Computer Programming, Agricultural Machinery' },
    { level: 3, sem: 1, credits: 18, hours: 22, link: '#', desc: 'Groundwater, Power Unit, Environmental Engineering, Farm Buildings' },
    { level: 3, sem: 2, credits: 19, hours: 23, link: '#', desc: 'Drainage, Crop Processing, Renewable Energy, GIS in Agriculture' },
    { level: 4, sem: 1, credits: 22, hours: 26, link: '#', desc: 'Specialized courses per department + thesis preliminary work' },
    { level: 4, sem: 2, credits: 22, hours: 26, link: '#', desc: 'Thesis research + advanced specialized courses per department' },
  ];
  const totalCredits = semesters.reduce((s, sem) => s + sem.credits, 0);
  content.innerHTML = `
    <div class="courses-section">
      <div class="courses-hero">
        <h2><i class="fas fa-graduation-cap"></i> B.Sc. Agricultural Engineering Courses</h2>
        <p>Bangladesh Agricultural University · Faculty of AET</p>
        <div class="courses-total-credit">
          <span>Total Credits:</span> <strong>${totalCredits}</strong>
          <span style="font-size:0.85rem;color:rgba(255,255,255,0.6);">(All departments)</span>
        </div>
      </div>
      <div class="courses-grid">
        ${semesters.map(s => `
          <div class="course-sem-card">
            <div class="sem-badge">Level ${s.level} · Sem ${s.sem}</div>
            <div class="sem-credits"><strong>${s.credits}</strong> <small>Credits</small></div>
            <div class="sem-hours">${s.hours} contact hrs/wk</div>
            <p class="sem-desc">${s.desc}</p>
            <a href="${s.link}" target="_blank" class="eye-catchy-btn sem-access-btn">
              <i class="fas fa-folder-open"></i> Access Materials
            </a>
          </div>`).join('')}
      </div>
      <div class="courses-note">
        <i class="fas fa-info-circle"></i>
        Total program credits: <strong>${totalCredits}</strong> for all departments (IWM, FPM, FSEE).
        Click "Access Materials" to open the Google Drive folder for each semester.
      </div>
    </div>`;
}

// ─── INIT ON LOGIN ────────────────────────────────────────────
function onUserLoggedIn(user) {
  // Called after login — initialize notification system
  setTimeout(() => {
    initNotificationSystem();
    // Show admin notif composer if admin
    if (user && user.id === '2105056') {
      document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
      const adminComposer = document.getElementById('admin-notif-composer');
      if (adminComposer) adminComposer.classList.remove('hidden');
    }
  }, 500);
}

// Auto-init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  // Listen for login events from script.js
  const observer = new MutationObserver(() => {
    const mainContainer = document.getElementById('main-container');
    if (mainContainer && !mainContainer.classList.contains('hidden')) {
      initNotificationSystem();
      observer.disconnect();
    }
  });
  const target = document.getElementById('main-container');
  if (target) observer.observe(target, { attributes: true, attributeFilter: ['class'] });
});