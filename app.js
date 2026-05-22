/* ============================================================
   EKKATAKKA ACADEMY V2 — app.js
   All page interactivity: navbar, counters, province drill-down,
   teacher cards, modal, search filters, map, smart matching
   ============================================================ */

// ── STATE ──────────────────────────────────────────────────
const State = {
  drill: { province: null, district: null, localLevel: null, ward: null },
  filters: {},
  currentPage: 1,
  perPage: 8,
  viewMode: 'list',   // 'list' | 'grid'
  darkMode: false,
};

// ── DOM READY ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initScrollTop();
  initFadeObserver();

  const page = location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    initHomePage();
  }
  if (page === 'find-teachers.html') {
    initSearchPage();
    applyFilters();
  }
  if (page === 'admin.html') {
    initAdminPage();
  }
  if (page === 'dashboard-student.html') {
    initStudentDashboard();
  }
  if (page === 'dashboard-teacher.html') {
    initTeacherDashboard();
  }
});

// ── NAVBAR ─────────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(l => {
    l.addEventListener('click', () => navLinks?.classList.remove('open'));
  });
}

// ── THEME ──────────────────────────────────────────────────
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  State.darkMode = localStorage.getItem('darkMode') === '1';
  applyTheme();
  btn.addEventListener('click', () => {
    State.darkMode = !State.darkMode;
    localStorage.setItem('darkMode', State.darkMode ? '1' : '0');
    applyTheme();
  });
}
function applyTheme() {
  document.body.classList.toggle('dark-mode', State.darkMode);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = State.darkMode ? '☀️' : '🌙';
}

// ── SCROLL TOP ─────────────────────────────────────────────
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── FADE OBSERVER ──────────────────────────────────────────
function initFadeObserver() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

// ── TOAST ──────────────────────────────────────────────────
function showToast(msg, icon = 'check-circle') {
  const t = document.getElementById('toast');
  if (!t) return;
  t.innerHTML = `<i class="fas fa-${icon}" style="color:var(--success)"></i> ${msg}`;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ────────────────────────────────────────────────────────────
// HOME PAGE
// ────────────────────────────────────────────────────────────
function initHomePage() {
  animateCounters();
  initQuickSearch();
  renderProvincesGrid();
  renderFeaturedTeachers();
  initNepalMap();
}

// ── COUNTERS ───────────────────────────────────────────────
function animateCounters() {
  const targets = { 'ctr-teachers': 500, 'ctr-districts': 77, 'ctr-students': 2400 };
  Object.entries(targets).forEach(([id, target]) => {
    const el = document.getElementById(id);
    if (!el) return;
    let cur = 0;
    const step = target / 80;
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur) + (cur >= target ? '+' : '');
      if (cur >= target) clearInterval(timer);
    }, 18);
  });
}

// ── QUICK SEARCH (hero) ────────────────────────────────────
function initQuickSearch() {
  const provSel = document.getElementById('qs-province');
  if (!provSel) return;
  DB.provinces.forEach(p => {
    provSel.innerHTML += `<option value="${p.id}">${p.name}</option>`;
  });
  const subjSel = document.getElementById('qs-subject');
  if (subjSel) {
    DB.subjects.slice(1).forEach(s => {
      subjSel.innerHTML += `<option value="${s}">${s}</option>`;
    });
  }
}
function qsOnProvince() {
  const pid = parseInt(document.getElementById('qs-province').value);
  const distSel = document.getElementById('qs-district');
  distSel.innerHTML = '<option value="">Select District</option>';
  distSel.disabled = !pid;
  if (!pid) return;
  DB.getDistrictsByProvince(pid).forEach(d => {
    distSel.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
}
function qsOnDistrict() { /* can chain to local level if needed */ }
function quickSearch() {
  const params = new URLSearchParams();
  const p = document.getElementById('qs-province')?.value;
  const d = document.getElementById('qs-district')?.value;
  const s = document.getElementById('qs-subject')?.value;
  const m = document.getElementById('qs-mode')?.value;
  if (p) params.set('province', p);
  if (d) params.set('district', d);
  if (s) params.set('subject', s);
  if (m) params.set('mode', m);
  location.href = 'find-teachers.html?' + params.toString();
}

// ── PROVINCES GRID ─────────────────────────────────────────
const PROVINCE_ICONS = ['🏔️','🌾','🏙️','🌊','🌿','🦌','🌅'];
function renderProvincesGrid() {
  const grid = document.getElementById('provincesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  DB.provinces.forEach((p, i) => {
    const count = DB.getTeacherCount(p.id);
    const card = document.createElement('div');
    card.className = 'province-card fade-up';
    card.style.transitionDelay = `${i * 0.07}s`;
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="province-icon">${PROVINCE_ICONS[i]}</div>
      <div class="province-name">${p.name.replace(' Province', '')}</div>
      <div class="province-capital">${p.capital}</div>
      <div class="province-count">${count > 0 ? count + ' Teachers' : 'Coming Soon'}</div>`;
    card.addEventListener('click', () => drillToProvince(p.id, card));
    grid.appendChild(card);
  });
  setTimeout(initFadeObserver, 50);
}

// ── DRILL DOWN ─────────────────────────────────────────────
function drillToProvince(provinceId, cardEl) {
  document.querySelectorAll('.province-card').forEach(c => c.classList.remove('active'));
  cardEl.classList.add('active');
  State.drill = { province: provinceId, district: null, localLevel: null, ward: null };

  const prov = DB.provinces.find(p => p.id === provinceId);
  const districts = DB.getDistrictsByProvince(provinceId);

  showDrill(
    `<span onclick="closeDrill()">Nepal</span> <span class="sep">›</span> <span>${prov.name}</span>`,
    `Select a District in ${prov.name}`,
    districts.map(d => {
      const llCount = DB.getLocalLevelsByDistrict(d.id).length;
      return { id: d.id, name: d.name, sub: llCount ? `${llCount} local levels` : 'Explore', arrow: true };
    }),
    item => drillToDistrict(item.id),
    null
  );
}

function drillToDistrict(districtId) {
  State.drill.district = districtId;
  const prov = DB.provinces.find(p => p.id === State.drill.province);
  const dist = DB.districts.find(d => d.id === districtId);
  const localLevels = DB.getLocalLevelsByDistrict(districtId);

  const backBtn = `<button class="btn btn-sm" style="background:var(--cream2);color:var(--navy);border:1.5px solid var(--border)" onclick="drillToProvince(${State.drill.province}, document.querySelector('.province-card.active'))">← Back</button>`;

  if (localLevels.length === 0) {
    showDrill(
      `<span onclick="closeDrill()">Nepal</span> <span class="sep">›</span> <span onclick="drillToProvince(${prov.id}, document.querySelector('.province-card[data-id=\\'${prov.id}\\']'))">${prov.name}</span> <span class="sep">›</span> <span>${dist.name}</span>`,
      `${dist.name} District`,
      [],
      null,
      `${backBtn}<a href="find-teachers.html?district=${districtId}" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> Find Teachers in ${dist.name}</a>`
    );
    return;
  }

  showDrill(
    `<span onclick="closeDrill()">Nepal</span> <span class="sep">›</span> <span onclick="drillToProvince(${prov.id}, document.querySelector('.province-card.active'))">${prov.name}</span> <span class="sep">›</span> <span>${dist.name}</span>`,
    `Select a Local Level in ${dist.name}`,
    localLevels.map(l => ({ id: l.id, name: l.name, sub: `${l.type} · ${l.wards} wards`, arrow: true })),
    item => drillToLocalLevel(item.id),
    backBtn
  );
}

function drillToLocalLevel(localLevelId) {
  State.drill.localLevel = localLevelId;
  const prov = DB.provinces.find(p => p.id === State.drill.province);
  const dist = DB.districts.find(d => d.id === State.drill.district);
  const ll = DB.localLevels.find(l => l.id === localLevelId);
  const wards = DB.getWards(localLevelId);

  const backBtn = `<button class="btn btn-sm" style="background:var(--cream2);color:var(--navy);border:1.5px solid var(--border)" onclick="drillToDistrict(${State.drill.district})">← Back</button>`;

  showDrill(
    `<span onclick="closeDrill()">Nepal</span> <span class="sep">›</span> <span onclick="drillToProvince(${prov.id}, document.querySelector('.province-card.active'))">${prov.name}</span> <span class="sep">›</span> <span onclick="drillToDistrict(${dist.id})">${dist.name}</span> <span class="sep">›</span> <span>${ll.name}</span>`,
    `Select a Ward in ${ll.name}`,
    wards.map(w => ({ id: w, name: `Ward ${w}`, sub: 'Click to find teachers', arrow: false })),
    item => drillToWard(item.id),
    `${backBtn}<a href="find-teachers.html?local_level=${localLevelId}" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> All Teachers in ${ll.name}</a>`
  );
}

function drillToWard(ward) {
  State.drill.ward = ward;
  const ll = DB.localLevels.find(l => l.id === State.drill.localLevel);
  const dist = DB.districts.find(d => d.id === State.drill.district);
  const prov = DB.provinces.find(p => p.id === State.drill.province);

  const teachers = DB.getTeachers({
    province_id: State.drill.province,
    district_id: State.drill.district,
    local_level_id: State.drill.localLevel,
    ward: ward
  });

  const backBtn = `<button class="btn btn-sm" style="background:var(--cream2);color:var(--navy);border:1.5px solid var(--border)" onclick="drillToLocalLevel(${State.drill.localLevel})">← Back</button>`;

  const drill = document.getElementById('locationDrill');
  const breadcrumb = document.getElementById('drillBreadcrumb');
  const heading = document.getElementById('drillHeading');
  const grid = document.getElementById('drillGrid');
  const actions = document.getElementById('drillActions');

  breadcrumb.innerHTML = `<span onclick="closeDrill()">Nepal</span> <span class="sep">›</span> <span>${prov.name}</span> <span class="sep">›</span> <span>${dist.name}</span> <span class="sep">›</span> <span>${ll.name}</span> <span class="sep">›</span> <span>Ward ${ward}</span>`;

  if (teachers.length === 0) {
    heading.textContent = `No teachers registered in Ward ${ward} yet`;
    grid.innerHTML = `<div style="grid-column:1/-1;padding:24px;background:var(--orange-pale);border-radius:var(--radius);color:var(--text-mid);font-size:.9rem"><i class="fas fa-info-circle" style="color:var(--orange);margin-right:8px"></i>No teachers in this ward yet. Try nearby areas or <a href="find-teachers.html?province=${prov.id}" style="color:var(--orange);font-weight:600">browse all teachers</a> in ${prov.name}.</div>`;
  } else {
    heading.textContent = `${teachers.length} Teacher${teachers.length !== 1 ? 's' : ''} in ${ll.name}, Ward ${ward}`;
    grid.innerHTML = teachers.map(t => miniTeacherCard(t)).join('');
  }

  actions.innerHTML = `${backBtn}<a href="find-teachers.html?province=${prov.id}&district=${dist.id}" class="btn btn-primary btn-sm"><i class="fas fa-search"></i> See All in ${dist.name}</a>`;
  drill.classList.add('visible');
  drill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function showDrill(breadcrumbHtml, headingText, items, onItemClick, actionsHtml) {
  const drill = document.getElementById('locationDrill');
  const breadcrumb = document.getElementById('drillBreadcrumb');
  const heading = document.getElementById('drillHeading');
  const grid = document.getElementById('drillGrid');
  const actions = document.getElementById('drillActions');

  breadcrumb.innerHTML = breadcrumbHtml;
  heading.textContent = headingText;
  actions.innerHTML = actionsHtml || '';

  if (items.length === 0) {
    grid.innerHTML = `<div style="color:var(--text-mid);font-size:.9rem;padding:16px 0">No data available. <a href="find-teachers.html" style="color:var(--orange)">Search all teachers</a></div>`;
  } else {
    grid.innerHTML = items.map(item => `
      <div class="drill-chip ${item.id === State.drill.localLevel || item.id === State.drill.district ? 'selected' : ''}" data-id="${item.id}">
        <div>
          <div class="drill-chip-name">${item.name}</div>
          <div class="drill-chip-sub">${item.sub}</div>
        </div>
        ${item.arrow ? '<i class="fas fa-chevron-right drill-chip-arrow"></i>' : ''}
      </div>`).join('');

    if (onItemClick) {
      grid.querySelectorAll('.drill-chip').forEach((chip, i) => {
        chip.addEventListener('click', () => {
          grid.querySelectorAll('.drill-chip').forEach(c => c.classList.remove('selected'));
          chip.classList.add('selected');
          onItemClick(items[i]);
        });
      });
    }
  }

  drill.classList.add('visible');
  drill.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeDrill() {
  document.getElementById('locationDrill')?.classList.remove('visible');
  document.querySelectorAll('.province-card').forEach(c => c.classList.remove('active'));
  State.drill = { province: null, district: null, localLevel: null, ward: null };
}

// ── MINI TEACHER CARD (inside drill) ──────────────────────
function miniTeacherCard(t) {
  return `<div class="drill-chip" style="cursor:pointer;flex-direction:column;align-items:flex-start;gap:6px" onclick="openTeacherModal(${t.id})">
    <div style="display:flex;align-items:center;gap:10px;width:100%">
      <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--navy),var(--navy-light));display:flex;align-items:center;justify-content:center;color:var(--white);font-weight:700;font-size:.8rem;flex-shrink:0">${t.initials}</div>
      <div style="flex:1;min-width:0">
        <div class="drill-chip-name">${t.name}</div>
        <div class="drill-chip-sub">${t.subjects.slice(0,2).join(', ')}</div>
      </div>
      <div style="font-size:.8rem;font-weight:700;color:var(--navy)">NPR ${t.price_monthly.toLocaleString()}</div>
    </div>
    <div style="display:flex;gap:6px;flex-wrap:wrap">
      ${t.mode.map(m => `<span class="tag ${m === 'Home Tuition' ? 'tag-mode-home' : 'tag-mode-online'}">${m}</span>`).join('')}
      <span style="font-size:.68rem;color:var(--warning)">★ ${t.rating}</span>
    </div>
  </div>`;
}

// ── FEATURED TEACHERS ──────────────────────────────────────
function renderFeaturedTeachers() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const top = [...DB.teachers].sort((a, b) => b.rating - a.rating).slice(0, 4);
  grid.innerHTML = top.map(t => `
    <div class="featured-card fade-up" onclick="openTeacherModal(${t.id})">
      <div class="featured-avatar">
        ${t.initials}
        <div class="featured-avatar-badge"><i class="fas fa-check"></i></div>
      </div>
      <div class="featured-name">${t.name}</div>
      <div class="featured-subject">${t.subjects[0]}</div>
      <div class="featured-rating">
        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(t.rating))}${t.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
        <span style="margin-left:4px">${t.rating} (${t.reviews})</span>
      </div>
      <div style="font-size:.78rem;color:var(--text-light);margin-bottom:12px">
        <i class="fas fa-map-marker-alt" style="color:var(--orange);margin-right:4px"></i>
        ${DB.getDistrictName(t.district_id)}
        ${t.mode.map(m => `<span class="tag ${m === 'Home Tuition' ? 'tag-mode-home' : 'tag-mode-online'}" style="margin-left:6px">${m === 'Home Tuition' ? '🏠' : '💻'} ${m}</span>`).join('')}
      </div>
      <div class="featured-price">NPR ${t.price_monthly.toLocaleString()}<span>/month</span></div>
    </div>`).join('');
  setTimeout(initFadeObserver, 50);
}

// ── NEPAL MAP ──────────────────────────────────────────────
function initNepalMap() {
  document.querySelectorAll('.province-shape').forEach(shape => {
    shape.addEventListener('click', () => {
      const pid = parseInt(shape.dataset.id);
      document.querySelectorAll('.province-shape').forEach(s => s.classList.remove('active'));
      shape.classList.add('active');
      // Mirror to province grid if on homepage
      const card = document.querySelector(`.province-card[data-id="${pid}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => drillToProvince(pid, card), 400);
      } else {
        location.href = `find-teachers.html?province=${pid}`;
      }
    });
    shape.addEventListener('mouseenter', () => {
      const pid = parseInt(shape.dataset.id);
      const prov = DB.provinces.find(p => p.id === pid);
      const count = DB.getTeacherCount(pid);
      shape.setAttribute('title', `${prov.name} — ${count > 0 ? count + ' teachers' : 'Explore'}`);
    });
  });
}

// ────────────────────────────────────────────────────────────
// SEARCH PAGE
// ────────────────────────────────────────────────────────────
function initSearchPage() {
  // Populate sidebar selects
  populateSelect('sf-province', DB.provinces, 'name', 'id', 'All Provinces');
  populateSelect('sf-subject', DB.subjects.slice(1).map(s => ({ id: s, name: s })), 'name', 'id', 'All Subjects');
  populateSelect('sf-grade', DB.grades.map(g => ({ id: g, name: g })), 'name', 'id', 'All Grades');

  // Top filter bar
  populateSelect('tf-province', DB.provinces, 'name', 'id', '🗺 Province');
  populateSelect('tf-subject', DB.subjects.slice(1).map(s => ({ id: s, name: s })), 'name', 'id', '📚 Subject');
  populateSelect('tf-grade', DB.grades.map(g => ({ id: g, name: g })), 'name', 'id', '🎓 Grade');
}

function populateSelect(id, items, labelKey, valKey, placeholder) {
  const el = document.getElementById(id);
  if (!el) return;
  const first = el.options[0]?.text || placeholder;
  el.innerHTML = `<option value="">${first}</option>`;
  items.forEach(item => {
    el.innerHTML += `<option value="${item[valKey]}">${item[labelKey]}</option>`;
  });
}

// Sidebar selects chaining
function sfOnProvince() {
  const pid = parseInt(document.getElementById('sf-province')?.value);
  const distSel = document.getElementById('sf-district');
  const llSel = document.getElementById('sf-locallevel');
  const wSel = document.getElementById('sf-ward');
  resetSelect(distSel, 'All Districts');
  resetSelect(llSel, 'All Local Levels');
  resetSelect(wSel, 'All Wards');
  if (distSel) distSel.disabled = !pid;
  if (!pid) { applyFilters(); return; }
  DB.getDistrictsByProvince(pid).forEach(d => {
    distSel.innerHTML += `<option value="${d.id}">${d.name}</option>`;
  });
  applyFilters();
}
function sfOnDistrict() {
  const did = parseInt(document.getElementById('sf-district')?.value);
  const llSel = document.getElementById('sf-locallevel');
  const wSel = document.getElementById('sf-ward');
  resetSelect(llSel, 'All Local Levels');
  resetSelect(wSel, 'All Wards');
  if (llSel) llSel.disabled = !did;
  if (!did) { applyFilters(); return; }
  const lls = DB.getLocalLevelsByDistrict(did);
  lls.forEach(l => { llSel.innerHTML += `<option value="${l.id}">${l.name} (${l.type})</option>`; });
  applyFilters();
}
function sfOnLocalLevel() {
  const lid = parseInt(document.getElementById('sf-locallevel')?.value);
  const wSel = document.getElementById('sf-ward');
  resetSelect(wSel, 'All Wards');
  if (wSel) wSel.disabled = !lid;
  if (!lid) { applyFilters(); return; }
  DB.getWards(lid).forEach(w => { wSel.innerHTML += `<option value="${w}">Ward ${w}</option>`; });
  applyFilters();
}

// Top filter bar chaining
function tfOnProvince() {
  const pid = parseInt(document.getElementById('tf-province')?.value);
  const distSel = document.getElementById('tf-district');
  const llSel = document.getElementById('tf-locallevel');
  const wSel = document.getElementById('tf-ward');
  resetSelect(distSel, '🏙 District');
  resetSelect(llSel, '🏘 Local Level');
  resetSelect(wSel, '🔢 Ward');
  distSel.disabled = !pid; llSel.disabled = true; wSel.disabled = true;
  if (!pid) { applyFilters(); return; }
  DB.getDistrictsByProvince(pid).forEach(d => { distSel.innerHTML += `<option value="${d.id}">${d.name}</option>`; });
}
function tfOnDistrict() {
  const did = parseInt(document.getElementById('tf-district')?.value);
  const llSel = document.getElementById('tf-locallevel');
  const wSel = document.getElementById('tf-ward');
  resetSelect(llSel, '🏘 Local Level');
  resetSelect(wSel, '🔢 Ward');
  llSel.disabled = !did; wSel.disabled = true;
  if (!did) { applyFilters(); return; }
  DB.getLocalLevelsByDistrict(did).forEach(l => { llSel.innerHTML += `<option value="${l.id}">${l.name}</option>`; });
}
function tfOnLocalLevel() {
  const lid = parseInt(document.getElementById('tf-locallevel')?.value);
  const wSel = document.getElementById('tf-ward');
  resetSelect(wSel, '🔢 Ward');
  wSel.disabled = !lid;
  if (!lid) { applyFilters(); return; }
  DB.getWards(lid).forEach(w => { wSel.innerHTML += `<option value="${w}">Ward ${w}</option>`; });
}

function resetSelect(el, placeholder) {
  if (!el) return;
  el.innerHTML = `<option value="">${placeholder}</option>`;
  el.disabled = true;
}

// ── APPLY FILTERS ──────────────────────────────────────────
function applyFilters() {
  const f = collectFilters();
  State.filters = f;
  State.currentPage = 1;

  let results = DB.getTeachers(f);
  results = sortTeachers(results);

  renderActiveFilterTags(f);
  renderTeacherResults(results);
  renderPagination(results.length);

  const countEl = document.getElementById('resultCount');
  if (countEl) countEl.textContent = results.length;
}

function collectFilters() {
  const f = {};
  // Sidebar
  const sfProv = document.getElementById('sf-province')?.value;
  const sfDist = document.getElementById('sf-district')?.value;
  const sfLL = document.getElementById('sf-locallevel')?.value;
  const sfWard = document.getElementById('sf-ward')?.value;
  const sfSubject = document.getElementById('sf-subject')?.value;
  const sfGrade = document.getElementById('sf-grade')?.value;
  const sfMode = document.querySelector('input[name="sf-mode"]:checked')?.value;
  const sfGender = document.querySelector('input[name="sf-gender"]:checked')?.value;
  const sfPrice = document.getElementById('sf-price')?.value;
  const sfVerified = document.getElementById('sf-verified')?.checked;
  const sfDemo = document.getElementById('sf-demo')?.checked;

  // Top bar overrides
  const tfProv = document.getElementById('tf-province')?.value;
  const tfDist = document.getElementById('tf-district')?.value;
  const tfLL = document.getElementById('tf-locallevel')?.value;
  const tfWard = document.getElementById('tf-ward')?.value;
  const tfSubject = document.getElementById('tf-subject')?.value;
  const tfGrade = document.getElementById('tf-grade')?.value;
  const tfMode = document.getElementById('tf-mode')?.value;

  const provinceId = parseInt(tfProv || sfProv);
  const districtId = parseInt(tfDist || sfDist);
  const llId = parseInt(tfLL || sfLL);
  const wardNum = parseInt(tfWard || sfWard);

  if (provinceId) f.province_id = provinceId;
  if (districtId) f.district_id = districtId;
  if (llId) f.local_level_id = llId;
  if (wardNum) f.ward = wardNum;
  if (tfSubject || sfSubject) f.subject = tfSubject || sfSubject;
  if (tfGrade || sfGrade) f.grade = tfGrade || sfGrade;
  if (tfMode || sfMode) f.mode = tfMode || sfMode;
  if (sfGender) f.gender = sfGender;
  if (sfPrice && parseInt(sfPrice) < 10000) f.max_price = parseInt(sfPrice);
  if (sfVerified) f.verified = true;
  if (sfDemo) f.demo = true;

  return f;
}

function sortTeachers(teachers) {
  const sort = document.getElementById('sortSelect')?.value || 'rating';
  return [...teachers].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'price_asc') return a.price_monthly - b.price_monthly;
    if (sort === 'price_desc') return b.price_monthly - a.price_monthly;
    if (sort === 'experience') return b.experience - a.experience;
    if (sort === 'reviews') return b.reviews - a.reviews;
    return 0;
  });
}

function renderActiveFilterTags(f) {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  const labels = [];
  if (f.province_id) labels.push({ key: 'province_id', label: DB.getProvinceName(f.province_id) });
  if (f.district_id) labels.push({ key: 'district_id', label: DB.getDistrictName(f.district_id) });
  if (f.local_level_id) labels.push({ key: 'local_level_id', label: DB.getLocalLevelName(f.local_level_id) });
  if (f.ward) labels.push({ key: 'ward', label: `Ward ${f.ward}` });
  if (f.subject) labels.push({ key: 'subject', label: f.subject });
  if (f.grade) labels.push({ key: 'grade', label: f.grade });
  if (f.mode) labels.push({ key: 'mode', label: f.mode });
  if (f.gender) labels.push({ key: 'gender', label: f.gender });
  if (f.max_price) labels.push({ key: 'max_price', label: `≤ NPR ${f.max_price}` });
  if (f.verified) labels.push({ key: 'verified', label: 'Verified Only' });

  container.innerHTML = labels.map(l =>
    `<div class="active-filter-tag">${l.label}<button onclick="removeFilter('${l.key}')"><i class="fas fa-times"></i></button></div>`
  ).join('');
}

function removeFilter(key) {
  // Reset corresponding input
  const map = {
    province_id: ['sf-province', 'tf-province'],
    district_id: ['sf-district', 'tf-district'],
    local_level_id: ['sf-locallevel', 'tf-locallevel'],
    ward: ['sf-ward', 'tf-ward'],
    subject: ['sf-subject', 'tf-subject'],
    grade: ['sf-grade', 'tf-grade'],
    mode: ['tf-mode'],
    gender: null,
    max_price: ['sf-price'],
    verified: ['sf-verified'],
  };
  (map[key] || []).forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; if (el.type === 'checkbox') el.checked = false; }
  });
  if (key === 'mode') {
    const r = document.querySelector('input[name="sf-mode"][value=""]');
    if (r) r.checked = true;
  }
  if (key === 'gender') {
    const r = document.querySelector('input[name="sf-gender"][value=""]');
    if (r) r.checked = true;
  }
  applyFilters();
}

function resetFilters() {
  document.querySelectorAll('.filter-select, .filter-pill-select, #sf-subject, #sf-grade, #sf-province, #sf-district, #sf-locallevel, #sf-ward').forEach(el => {
    el.value = '';
    el.disabled = el.id !== 'sf-province' && el.id !== 'tf-province' && el.id !== 'sf-subject' && el.id !== 'sf-grade' && el.id !== 'tf-subject' && el.id !== 'tf-grade' && el.id !== 'tf-mode';
  });
  document.querySelectorAll('input[name="sf-mode"], input[name="sf-gender"]').forEach((r, i) => { if (i === 0) r.checked = true; else r.checked = false; });
  const priceEl = document.getElementById('sf-price');
  if (priceEl) { priceEl.value = 10000; updatePriceLabel(10000); }
  document.getElementById('sf-verified') && (document.getElementById('sf-verified').checked = false);
  document.getElementById('sf-demo') && (document.getElementById('sf-demo').checked = false);
  applyFilters();
}

function updatePriceLabel(val) {
  const el = document.getElementById('priceLabel');
  if (el) el.textContent = parseInt(val) >= 10000 ? 'Any Price' : `NPR ${parseInt(val).toLocaleString()}`;
}

// ── RENDER TEACHER CARDS ───────────────────────────────────
function renderTeacherResults(teachers) {
  const container = document.getElementById('teachersContainer');
  if (!container) return;

  const start = (State.currentPage - 1) * State.perPage;
  const page = teachers.slice(start, start + State.perPage);

  if (teachers.length === 0) {
    container.innerHTML = `<div class="no-results"><i class="fas fa-search"></i><h3>No teachers found</h3><p>Try removing some filters or browse a broader location.</p><a href="#" onclick="resetFilters();return false" class="btn btn-primary" style="margin-top:16px">Clear Filters</a></div>`;
    return;
  }

  const isGrid = State.viewMode === 'grid';
  container.className = isGrid ? 'teachers-grid-2col' : 'teachers-grid';
  container.innerHTML = page.map(t => teacherCard(t, isGrid)).join('');
}

function teacherCard(t, compact = false) {
  const badgeClass = t.badge === 'Top Rated' ? 'badge-top' : t.badge === 'Expert' ? 'badge-expert' : 'badge-verified';
  const stars = '★'.repeat(Math.floor(t.rating)) + (t.rating % 1 >= 0.5 ? '½' : '');
  const loc = [DB.getLocalLevelName(t.local_level_id), DB.getDistrictName(t.district_id)].filter(Boolean).join(', ');

  if (compact) {
    return `<div class="teacher-card" onclick="openTeacherModal(${t.id})">
      <div class="teacher-avatar">${t.initials}</div>
      <div class="teacher-body">
        <div class="teacher-name-row">
          <span class="teacher-name">${t.name}</span>
          ${t.verified ? '<span class="teacher-badge badge-verified"><i class="fas fa-check"></i> Verified</span>' : ''}
        </div>
        <div class="teacher-qual">${t.qualification}</div>
        <div class="teacher-tags">${t.subjects.slice(0,3).map(s => `<span class="tag tag-subject">${s}</span>`).join('')}${t.mode.map(m => `<span class="tag ${m === 'Home Tuition' ? 'tag-mode-home' : 'tag-mode-online'}">${m}</span>`).join('')}</div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
          <span style="color:var(--warning);font-weight:700">★ ${t.rating}</span>
          <span style="font-family:'Playfair Display',serif;font-weight:700;color:var(--navy)">NPR ${t.price_monthly.toLocaleString()}/mo</span>
          <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();bookTeacher(${t.id})">Book</button>
        </div>
      </div>
    </div>`;
  }

  return `<div class="teacher-card" onclick="openTeacherModal(${t.id})">
    <div class="teacher-avatar">${t.initials}</div>
    <div class="teacher-body">
      <div class="teacher-name-row">
        <span class="teacher-name">${t.name}</span>
        <span class="teacher-badge ${badgeClass}">${t.badge}</span>
        ${t.demo ? '<span class="teacher-badge" style="background:#ede9fe;color:#5b21b6">Free Demo</span>' : ''}
      </div>
      <div class="teacher-qual">${t.qualification} · ${t.experience} yrs exp</div>
      <div class="teacher-tags">
        ${t.subjects.slice(0,3).map(s => `<span class="tag tag-subject">${s}</span>`).join('')}
        ${t.mode.map(m => `<span class="tag ${m === 'Home Tuition' ? 'tag-mode-home' : 'tag-mode-online'}">${m === 'Home Tuition' ? '🏠 ' : '💻 '}${m}</span>`).join('')}
        ${t.grades.slice(0,2).map(g => `<span class="tag">${g}</span>`).join('')}
      </div>
      <div class="teacher-location">
        <i class="fas fa-map-marker-alt"></i>
        ${loc || 'Nepal'}${t.ward ? `, Ward ${t.ward}` : ''}
        ${t.mode.includes('Home Tuition') ? `<span style="margin-left:8px;color:var(--success)"><i class="fas fa-route"></i> ${t.travel_radius_km}km radius</span>` : ''}
      </div>
      <div class="teacher-meta">
        <span class="rating"><i class="fas fa-star"></i> ${t.rating} (${t.reviews} reviews)</span>
        <span><i class="fas fa-clock"></i> ${t.available_days.join(', ')}</span>
        ${t.languages.length > 1 ? `<span><i class="fas fa-language"></i> ${t.languages.join(', ')}</span>` : ''}
      </div>
    </div>
    <div class="teacher-side">
      <div>
        <div class="teacher-price">NPR ${t.price_monthly.toLocaleString()}</div>
        <div class="teacher-price-label">per month</div>
        <div style="font-size:.78rem;color:var(--text-light);margin-top:4px">NPR ${t.price_hourly}/hr</div>
      </div>
      <div class="teacher-actions">
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();bookTeacher(${t.id})"><i class="fas fa-calendar-check"></i> Book Now</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openTeacherModal(${t.id})"><i class="fas fa-user"></i> Profile</button>
      </div>
    </div>
  </div>`;
}

// ── PAGINATION ─────────────────────────────────────────────
function renderPagination(total) {
  const container = document.getElementById('pagination');
  if (!container) return;
  const pages = Math.ceil(total / State.perPage);
  if (pages <= 1) { container.innerHTML = ''; return; }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i === State.currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}
function goToPage(n) {
  State.currentPage = n;
  const f = State.filters;
  let results = DB.getTeachers(f);
  results = sortTeachers(results);
  renderTeacherResults(results);
  renderPagination(results.length);
  document.getElementById('teachersContainer')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setView(mode) {
  State.viewMode = mode;
  document.getElementById('viewList')?.classList.toggle('active', mode === 'list');
  document.getElementById('viewGrid')?.classList.toggle('active', mode === 'grid');
  applyFilters();
}

// ── TEACHER MODAL ──────────────────────────────────────────
function openTeacherModal(id) {
  const t = DB.teachers.find(x => x.id === id);
  if (!t) return;
  const overlay = document.getElementById('teacherModal');
  const box = document.getElementById('modalBox');
  const loc = [DB.getLocalLevelName(t.local_level_id), DB.getDistrictName(t.district_id), DB.getProvinceName(t.province_id)].filter(Boolean).join(', ');

  box.innerHTML = `
    <div class="modal-header">
      <div class="modal-avatar">${t.initials}</div>
      <div class="modal-header-info">
        <div class="modal-name">${t.name}</div>
        <div class="modal-qual">${t.qualification}</div>
        <div class="modal-rating-row">
          <span style="color:var(--warning);font-weight:700">★ ${t.rating}</span>
          <span style="color:rgba(255,255,255,.55);font-size:.82rem">(${t.reviews} reviews)</span>
          ${t.verified ? '<span style="background:var(--success);color:var(--white);font-size:.7rem;padding:3px 10px;border-radius:100px;font-weight:700"><i class="fas fa-check"></i> Verified</span>' : ''}
          ${t.badge !== 'Verified' ? `<span style="background:rgba(232,125,42,.2);color:var(--orange-light);font-size:.7rem;padding:3px 10px;border-radius:100px;font-weight:700">${t.badge}</span>` : ''}
        </div>
      </div>
      <button class="modal-close" onclick="closeTeacherModal()"><i class="fas fa-times"></i></button>
    </div>
    <div class="modal-body">
      <div class="modal-section">
        <div class="modal-section-title">About</div>
        <p style="font-size:.93rem;color:var(--text-mid);line-height:1.7">${t.bio}</p>
      </div>
      <div class="modal-section">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          <div style="background:var(--cream);border-radius:var(--radius-sm);padding:16px;text-align:center">
            <div style="font-size:1.6rem;font-weight:700;font-family:'Playfair Display',serif;color:var(--navy)">${t.experience}</div>
            <div style="font-size:.75rem;color:var(--text-light)">Years Exp</div>
          </div>
          <div style="background:var(--cream);border-radius:var(--radius-sm);padding:16px;text-align:center">
            <div style="font-size:1.6rem;font-weight:700;font-family:'Playfair Display',serif;color:var(--navy)">${t.rating}</div>
            <div style="font-size:.75rem;color:var(--text-light)">Rating</div>
          </div>
          <div style="background:var(--cream);border-radius:var(--radius-sm);padding:16px;text-align:center">
            <div style="font-size:1.6rem;font-weight:700;font-family:'Playfair Display',serif;color:var(--navy)">${t.reviews}</div>
            <div style="font-size:.75rem;color:var(--text-light)">Reviews</div>
          </div>
        </div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Subjects & Grades</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px">${t.subjects.map(s => `<span class="tag tag-subject">${s}</span>`).join('')}</div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${t.grades.map(g => `<span class="tag">${g}</span>`).join('')}</div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Teaching Mode & Location</div>
        <div style="display:flex;gap:10px;margin-bottom:12px;flex-wrap:wrap">
          ${t.mode.map(m => `<span class="tag ${m === 'Home Tuition' ? 'tag-mode-home' : 'tag-mode-online'}" style="font-size:.88rem;padding:6px 14px">${m === 'Home Tuition' ? '🏠 Home Tuition' : '💻 Online'}</span>`).join('')}
        </div>
        <div style="font-size:.88rem;color:var(--text-mid)"><i class="fas fa-map-marker-alt" style="color:var(--orange);margin-right:6px"></i>${loc}${t.ward ? `, Ward ${t.ward}` : ''}</div>
        ${t.travel_radius_km > 0 ? `<div style="font-size:.82rem;color:var(--text-light);margin-top:4px"><i class="fas fa-route" style="margin-right:6px"></i>Can travel up to ${t.travel_radius_km} km</div>` : ''}
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Availability</div>
        <div class="schedule-chips" style="margin-bottom:12px">
          ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => `<span class="schedule-chip" style="${t.available_days.includes(d) ? 'background:var(--navy);color:var(--white)' : ''}">${d}</span>`).join('')}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">${t.time_slots.map(s => `<span class="schedule-chip">${s}</span>`).join('')}</div>
      </div>
      <div class="modal-section">
        <div class="modal-section-title">Pricing</div>
        <div class="price-boxes">
          <div class="price-box"><div class="amount">NPR ${t.price_monthly.toLocaleString()}</div><div class="period">Per Month</div></div>
          <div class="price-box"><div class="amount">NPR ${t.price_hourly}</div><div class="period">Per Hour</div></div>
        </div>
      </div>
      <div class="modal-ctas">
        <button class="btn btn-primary" onclick="bookTeacher(${t.id});closeTeacherModal()"><i class="fas fa-calendar-check"></i> Book Now</button>
        ${t.demo ? `<button class="btn btn-navy" onclick="showToast('Demo class request sent!');closeTeacherModal()"><i class="fas fa-play"></i> Request Free Demo</button>` : ''}
        <a href="https://wa.me/9779763248479?text=I want to book ${encodeURIComponent(t.name)} for tuition" class="btn" style="background:#25d366;color:var(--white)" target="_blank"><i class="fab fa-whatsapp"></i> WhatsApp</a>
      </div>
    </div>`;

  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeTeacherModal() {
  document.getElementById('teacherModal')?.classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('click', e => {
  if (e.target.id === 'teacherModal') closeTeacherModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeTeacherModal();
});

function bookTeacher(id) {
  const t = DB.teachers.find(x => x.id === id);
  showToast(`Booking request sent for ${t?.name}! We'll call you within 2 hours.`);
}

// ────────────────────────────────────────────────────────────
// ADMIN PAGE (lightweight preview)
// ────────────────────────────────────────────────────────────
function initAdminPage() {
  const teachersTbody = document.getElementById('adminTeachersBody');
  if (!teachersTbody) return;
  DB.teachers.forEach(t => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><div style="display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--navy),var(--navy-light));display:flex;align-items:center;justify-content:center;color:var(--white);font-weight:700;font-size:.8rem">${t.initials}</div>${t.name}</div></td>
      <td>${t.subjects.slice(0,2).join(', ')}</td>
      <td>${DB.getDistrictName(t.district_id)}</td>
      <td>${t.mode.join(' + ')}</td>
      <td>NPR ${t.price_monthly.toLocaleString()}</td>
      <td><span style="color:var(--warning)">★ ${t.rating}</span></td>
      <td><span style="background:${t.verified ? 'var(--success)' : 'var(--warning)'};color:var(--white);padding:3px 10px;border-radius:100px;font-size:.72rem;font-weight:700">${t.verified ? 'Verified' : 'Pending'}</span></td>
      <td><button class="btn btn-sm btn-primary" onclick="showToast('Profile opened')">View</button></td>`;
    teachersTbody.appendChild(tr);
  });

  // Stats
  document.getElementById('adminStatTeachers') && (document.getElementById('adminStatTeachers').textContent = DB.teachers.length);
  document.getElementById('adminStatProvinces') && (document.getElementById('adminStatProvinces').textContent = DB.provinces.length);
  document.getElementById('adminStatDistricts') && (document.getElementById('adminStatDistricts').textContent = DB.districts.length);
}

// ────────────────────────────────────────────────────────────
// STUDENT DASHBOARD
// ────────────────────────────────────────────────────────────
function initStudentDashboard() {
  const saved = document.getElementById('savedTeachersGrid');
  if (!saved) return;
  // Show top 3 as "saved"
  DB.teachers.slice(0, 3).forEach(t => {
    saved.innerHTML += `<div class="featured-card" onclick="openTeacherModal(${t.id})" style="text-align:left">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
        <div style="width:48px;height:48px;border-radius:10px;background:linear-gradient(135deg,var(--navy),var(--navy-light));display:flex;align-items:center;justify-content:center;color:var(--white);font-weight:700">${t.initials}</div>
        <div><div style="font-weight:700;color:var(--navy)">${t.name}</div><div style="font-size:.78rem;color:var(--text-light)">${t.subjects[0]}</div></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="color:var(--warning);font-size:.85rem">★ ${t.rating}</span>
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation();bookTeacher(${t.id})">Book</button>
      </div>
    </div>`;
  });
}

// ────────────────────────────────────────────────────────────
// TEACHER DASHBOARD
// ────────────────────────────────────────────────────────────
function initTeacherDashboard() {
  const teacher = DB.teachers[0]; // Simulated logged-in teacher
  const nameEl = document.getElementById('tdName');
  if (nameEl) nameEl.textContent = teacher.name;
  const subjEl = document.getElementById('tdSubjects');
  if (subjEl) subjEl.textContent = teacher.subjects.join(', ');
}

// ── SMART RECOMMENDATIONS ──────────────────────────────────
function getRecommendations(studentLocation, subject, budget, mode) {
  let scored = DB.teachers.map(t => {
    let score = 0;
    if (t.province_id === studentLocation.province_id) score += 30;
    if (t.district_id === studentLocation.district_id) score += 25;
    if (t.subjects.some(s => s.toLowerCase().includes(subject.toLowerCase()))) score += 20;
    if (budget && t.price_monthly <= budget) score += 10;
    if (t.mode.includes(mode)) score += 10;
    score += t.rating * 2;
    score += Math.min(t.reviews / 10, 3);
    return { ...t, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, 5);
}

// ── NEARBY TEACHERS (geolocation stub) ─────────────────────
function findNearbyTeachers() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported', 'exclamation-triangle');
    return;
  }
  showToast('Detecting your location...', 'map-marker-alt');
  navigator.geolocation.getCurrentPosition(
    pos => {
      showToast('Location detected! Showing nearby teachers.');
      location.href = 'find-teachers.html?nearby=1';
    },
    () => showToast('Could not get location. Please select manually.', 'exclamation-circle')
  );
}

// expose globals used by inline handlers
window.qsOnProvince = qsOnProvince;
window.qsOnDistrict = qsOnDistrict;
window.quickSearch = quickSearch;
window.drillToProvince = drillToProvince;
window.drillToDistrict = drillToDistrict;
window.drillToLocalLevel = drillToLocalLevel;
window.drillToWard = drillToWard;
window.closeDrill = closeDrill;
window.openTeacherModal = openTeacherModal;
window.closeTeacherModal = closeTeacherModal;
window.bookTeacher = bookTeacher;
window.applyFilters = applyFilters;
window.resetFilters = resetFilters;
window.removeFilter = removeFilter;
window.updatePriceLabel = updatePriceLabel;
window.setView = setView;
window.goToPage = goToPage;
window.sfOnProvince = sfOnProvince;
window.sfOnDistrict = sfOnDistrict;
window.sfOnLocalLevel = sfOnLocalLevel;
window.tfOnProvince = tfOnProvince;
window.tfOnDistrict = tfOnDistrict;
window.tfOnLocalLevel = tfOnLocalLevel;
window.initSearchPage = initSearchPage;
window.findNearbyTeachers = findNearbyTeachers;
window.showToast = showToast;
