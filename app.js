/* PT Contoh Nusantara demo. Bağımlılık yok: tek rAF döngüsü + CSS değişkenleri (--p). */
(() => {
  const D = document.documentElement;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  const mqRM = matchMedia('(prefers-reduced-motion: reduce)');
  const mqMob = matchMedia('(max-width: 759px)');
  D.classList.add('js');

  /* ---------- ID / EN ---------- */
  const EN = {
    demo: 'Demo — content and company name are examples only', menu: 'Menu',
    nav1: 'Home', nav2: 'About Us', nav3: 'Services', nav4: 'Gallery', nav5: 'Contact',
    h1: "From Surabaya's port, goods reach all of East Java.",
    hsub: 'PT Contoh Nusantara handles distribution and sourcing for shops, factories and growing businesses. On time, on record, and honest about price.',
    cta: 'Contact us', cta2: 'See services',
    t1: 'Born in a port', t2: 'city, we know what', t3: 'on time means.',
    tp: 'For centuries Surabaya has been the trading gate of East Java. PT Contoh Nusantara carries that tradition on with trucks, warehouses and a team that logs every shipment from the quay to the customer door.',
    v1: 'Keep our word.', v1t: 'Written schedules, clear news when plans change.',
    v2: 'Honest pricing.', v2t: 'Costs itemised up front, no hidden extras.',
    v3: 'Gotong royong.', v3t: 'Drivers, warehouse and office work as one team.',
    s1: 'years serving customers across East Java', s2: 'East Java regencies and cities we reach',
    s3: 'business partners, from grocery stalls to factories', s4: 'warehouses in Surabaya, Malang and Jember',
    snote: 'Figures are examples for this demo only.',
    lh: 'One route, four services.',
    a1: 'Port and customs', a1w: 'Surabaya, Tanjung Perak', a1t: 'We collect containers at the port, handle paperwork and move cargo before it piles up on the quay.',
    a2: 'Warehousing and stock', a2w: 'Malang', a2t: 'Tidy warehouses, counted stock and reports you can open any time.',
    a3: 'Regional distribution', a3w: 'Jember', a3t: 'Our fleet delivers to shops, markets and factories across East Java on a fixed schedule.',
    a4: 'Sourcing and supply', a4w: 'Banyuwangi, onward to Bali', a4t: 'We find goods from trusted suppliers, then carry on to Bali and Nusa Tenggara via the Ketapang crossing.',
    gh: 'Gallery', gp: 'Scenes from our work, drawn for this demo. Keep scrolling from the quay to the warehouse.',
    c1: 'Container ship', c1t: 'Loading at the quay as the sun rises.',
    c2: 'Malang warehouse', c2t: 'Numbered racks, stock counted every week.',
    c3: 'Crossing Suramadu', c3t: 'Trucks cross to Madura on schedule.',
    c4: 'Kawung motif', c4t: 'The batik pattern behind our identity.',
    c5: 'Farm goods', c5t: 'Rice, coffee and sugar from chosen suppliers.',
    c6: 'Dusk at the quay', c6t: 'The last shift closes the day with a cargo count.',
    kh: 'Tell us what you need to ship.', kp: 'Write the goods, destination and schedule you want. Our team replies the same working day.',
    ka: 'Address', kav: 'Jl. Contoh Raya No. 1, Surabaya, East Java (sample address)',
    kt: 'Phone and WhatsApp', kj: 'Hours', kjv: 'Monday to Saturday, 08:00 to 17:00 WIB',
    fn: 'Name', fc: 'Email or WhatsApp number', fm: 'Message', fph: 'Goods, destination and schedule', fs: 'Send message',
    foot: '© 2026 PT Contoh Nusantara (sample name, not a real company)', up: 'Back to top', wa: 'Chat on WhatsApp',
    thanks: 'Thank you. This is a demo, your message was not sent.',
    err: 'Please fill in every field.'
  };
  const ID = {};
  $$('[data-i]').forEach(e => ID[e.dataset.i] = e.textContent);
  const PH = { id: $('[data-i-ph]').placeholder, en: EN.fph };
  const TITLES = { id: document.title, en: 'PT Contoh Nusantara | Distribution and Sourcing, Surabaya, East Java' };
  let lang = 'id';
  function setLang(l) {
    lang = l; const d = l === 'en' ? EN : ID;
    D.lang = l;
    $$('[data-i]').forEach(e => e.textContent = d[e.dataset.i]);
    $$('[data-i-ph]').forEach(e => e.placeholder = PH[l]);
    $$('[data-i-al]').forEach(e => e.setAttribute('aria-label', l === 'en' ? EN.wa : 'Chat WhatsApp'));
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === l));
    document.title = TITLES[l];
    $('#form').dataset.l = l;
    try { localStorage.setItem('cn-lang', l); } catch (e) {}
    layout(); tick();
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  /* ---------- menü ---------- */
  const nav = $('#nav'), burger = $('#burger');
  burger.addEventListener('click', () => { const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o); });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* ---------- form (demo) ---------- */
  $('#form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, ok = $('#ok');
    if (!f.checkValidity()) { f.reportValidity(); ok.textContent = lang === 'en' ? EN.err : 'Mohon isi semua kolom.'; return; }
    ok.textContent = lang === 'en' ? EN.thanks : 'Terima kasih. Ini demo, pesan Anda tidak dikirim.';
    f.reset();
  });

  /* ---------- sahneler ---------- */
  const hero = $('#beranda'), about = $('#aboutBox'), route = $('#layanan'), gal = $('#galeri'),
        gstage = $('#gstage'), gtrack = $('#gtrack'), topEl = $('#top');
  const line = $('#routeLine'), truck = $('#truck'), nodes = $$('.node'), svcs = $$('.svc');
  const L = line.getTotalLength();
  line.style.strokeDasharray = L;
  // her durağın rota üzerindeki konumu (0..1)
  const stops = nodes.map(n => {
    const c = $('circle', n), cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy');
    let best = 0, bd = 1e9;
    for (let i = 0; i <= 400; i++) { const p = line.getPointAtLength(L * i / 400); const d = (p.x - cx) ** 2 + (p.y - cy) ** 2; if (d < bd) { bd = d; best = i / 400; } }
    return best;
  });
  const sections = ['beranda', 'tentang', 'layanan', 'galeri', 'kontak'].map(id => $('#' + id));
  const navLinks = $$('.nav a');
  const counters = $$('[data-count]');
  let anim = !mqRM.matches, mob = mqMob.matches, vh = innerHeight, vw = innerWidth, queued = false;

  function mode() {
    anim = !mqRM.matches; mob = mqMob.matches;
    D.classList.toggle('anim', anim); D.classList.toggle('rm', !anim); D.classList.toggle('mob', mob);
    layout(); tick();
  }
  function layout() {
    vh = innerHeight; vw = innerWidth;
    $('#map').setAttribute('viewBox', mob ? '200 70 440 270' : '0 0 640 380');
    if (anim && !mob) {
      const dist = Math.max(0, gtrack.scrollWidth - vw);
      gal.style.setProperty('--gh', (dist + vh) + 'px');
    } else { gal.style.removeProperty('--gh'); gtrack.style.transform = ''; }
  }
  const prog = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - vh)); };

  function tick() {
    queued = false;
    const y = scrollY;
    topEl.classList.toggle('solid', y > 40);

    // hero
    if (anim) hero.style.setProperty('--p', prog(hero).toFixed(4)); else hero.style.removeProperty('--p');

    // sayılar: kaydırmayla sayar
    const rs = $('#stats').getBoundingClientRect();
    const ct = anim ? clamp((vh * 0.95 - rs.top) / (vh * 0.55)) : 1;
    counters.forEach(c => { c.textContent = Math.round(+c.dataset.count * ease(ct)) + (c.dataset.plus ? '+' : ''); });
    if (!anim || about.getBoundingClientRect().top < vh * 0.8) about.classList.add('in');

    // rota (imza hareket)
    let rp = 1;
    if (anim) rp = clamp((prog(route) - 0.05) / 0.88);
    line.style.strokeDashoffset = L * (1 - rp);
    const pt = line.getPointAtLength(L * rp);
    truck.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
    truck.style.display = anim ? '' : 'none';
    let active = 0;
    nodes.forEach((n, i) => { const lit = rp >= stops[i] - 0.01; n.classList.toggle('lit', lit); if (lit) active = i; });
    svcs.forEach((s, i) => s.classList.toggle('on', anim ? i === active : true));

    // galeri: dikey kaydırma -> yatay
    if (anim && !mob) {
      const dist = Math.max(0, gtrack.scrollWidth - vw);
      gtrack.style.transform = `translate3d(${-prog(gal) * dist}px,0,0)`;
    }

    // aktif menü
    let cur = 0;
    sections.forEach((s, i) => { if (s.getBoundingClientRect().top <= vh * 0.35) cur = i; });
    if (y + vh >= D.scrollHeight - 4) cur = sections.length - 1;
    navLinks.forEach((a, i) => i === cur ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
  }
  const req = () => { if (!queued) { queued = true; requestAnimationFrame(tick); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', () => { layout(); req(); });
  mqRM.addEventListener('change', mode); mqMob.addEventListener('change', mode);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layout(); req(); });

  let saved = null; try { saved = localStorage.getItem('cn-lang'); } catch (e) {}
  mode();
  if (saved === 'en') setLang('en');
})();
