// andrinkaech.ch – 3D-Szene im Hero (three.js r128)

(function () {
  // ---------- three.js scene ----------
  if (!window.THREE) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');
  const canvas = document.getElementById('three');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  // Less flat ambient light and a stronger warm key light, so the objects get real shading and contrast
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9aa3b8, 0.55));
  const sun = new THREE.DirectionalLight(0xfff3e2, 1.35);
  sun.position.set(5, 8, 7); scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffffff, 0.25);
  fill.position.set(0, 2, 10); scene.add(fill);
  const rim = new THREE.DirectionalLight(0x9fb5ff, 0.3);
  rim.position.set(-6, -2, 4); scene.add(rim);

  // Hex colours are sRGB; convert them to linear so the sRGB output shows them as intended instead of washed out
  const mat = (c, r = 0.55, m = 0.05) => {
    const material = new THREE.MeshStandardMaterial({ roughness: r, metalness: m });
    material.color.set(c).convertSRGBToLinear();
    return material;
  };

  // Laptop with code on screen
  function makeLaptop() {
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.6), mat(0xd5dbe7, 0.35, 0.4));
    g.add(base);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.01, 0.45), mat(0xc3cad9, 0.3, 0.3));
    pad.position.set(0, 0.065, 0.45); g.add(pad);
    const keys = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.01, 0.6), mat(0x2a3147, 0.7));
    keys.position.set(0, 0.065, -0.2); g.add(keys);
    const hinge = new THREE.Group(); hinge.position.set(0, 0.06, -0.8); g.add(hinge);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.55, 0.08), mat(0xd5dbe7, 0.35, 0.4));
    lid.position.set(0, 0.775, 0); hinge.add(lid);
    const c = document.createElement('canvas'); c.width = 640; c.height = 400;
    const x = c.getContext('2d');
    x.fillStyle = '#161c2e'; x.fillRect(0, 0, 640, 400);
    ['#ff6159', '#ffbd2e', '#28c941'].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.arc(28 + i * 26, 26, 8, 0, Math.PI * 2); x.fill(); });
    x.font = '500 27px "JetBrains Mono", Menlo, monospace';
    const lines = [
      [['#c792ea', 'const '], ['#82aaff', 'andrin'], ['#e9edf6', ' = {']],
      [['#e9edf6', '  beruf: '], ['#c3e88d', "'Informatiker EFZ'"], ['#e9edf6', ',']],
      [['#e9edf6', '  schule: '], ['#c3e88d', "'BM TALS'"], ['#e9edf6', ',']],
      [['#e9edf6', '  firma: '], ['#c3e88d', "'rondisach'"], ['#e9edf6', ',']],
      [['#e9edf6', '  englisch: '], ['#f78c6c', "'C1'"]],
      [['#e9edf6', '};']]
    ];
    const total = lines.reduce((s, ln) => s + ln.reduce((a, seg) => a + seg[1].length, 0), 0);
    function draw(n, caret) {
      x.fillStyle = '#161c2e'; x.fillRect(0, 44, 640, 356);
      x.font = '500 27px "JetBrains Mono", Menlo, monospace';
      let left = n, cx = 30, cy = 92;
      for (let i = 0; i < lines.length; i++) {
        let px = 30; cy = 92 + i * 50;
        for (const [col, t] of lines[i]) {
          if (left <= 0) break;
          const part = t.slice(0, left); left -= part.length;
          x.fillStyle = col; x.fillText(part, px, cy); px += x.measureText(part).width;
        }
        cx = px;
        if (left <= 0) break;
      }
      if (caret) { x.fillStyle = '#82aaff'; x.fillRect(cx + 3, cy - 22, 3, 28); }
    }
    draw(total, false);
    const tex = new THREE.CanvasTexture(c); tex.encoding = THREE.sRGBEncoding; tex.anisotropy = 4;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.375), new THREE.MeshBasicMaterial({ map: tex }));
    screen.position.set(0, 0.775, 0.045); hinge.add(screen);
    hinge.rotation.x = -0.28;
    g.rotation.set(0.35, -0.5, 0);
    g.userData.code = { draw, tex, total, key: '' };
    return g;
  }

  // Pizza
  function makePizza() {
    const g = new THREE.Group();
    const crust = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.15, 0.2, 64), mat(0xd99a52, 0.8));
    g.add(crust);
    const rimT = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.11, 16, 64), mat(0xc9843f, 0.85));
    rimT.rotation.x = Math.PI / 2; rimT.position.y = 0.1; g.add(rimT);
    const sauce = new THREE.Mesh(new THREE.CylinderGeometry(1.02, 1.02, 0.04, 64), mat(0xc8412c, 0.6));
    sauce.position.y = 0.11; g.add(sauce);
    const cheeseM = mat(0xf4d98a, 0.5);
    for (let i = 0; i < 9; i++) {
      const a = i * 2.4, r = 0.25 + (i % 3) * 0.28;
      const ch = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 12), cheeseM);
      ch.scale.set(1.1, 0.14, 0.9); ch.position.set(Math.cos(a) * r, 0.14, Math.sin(a) * r); g.add(ch);
    }
    const pepM = mat(0x9e2a1f, 0.55);
    [[0.55, 0.2], [-0.45, 0.45], [0.1, -0.6], [-0.6, -0.35], [0.35, 0.68], [0.0, 0.05]].forEach(([px, pz]) => {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.04, 24), pepM);
      p.position.set(px, 0.16, pz); g.add(p);
    });
    const basilM = mat(0x3f8f45, 0.6);
    [[0.7, -0.25], [-0.2, 0.7], [-0.75, 0.05]].forEach(([px, pz], i) => {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.13, 16, 10), basilM);
      b.scale.set(1.4, 0.15, 0.7); b.rotation.y = i * 1.3; b.position.set(px, 0.17, pz); g.add(b);
    });
    g.rotation.set(0.85, 0, -0.2);
    return g;
  }

  // Graduation cap for the BM
  function makeCap() {
    const g = new THREE.Group();
    const navy = mat(0x22305c, 0.6);
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.68, 0.5, 40), navy);
    g.add(crown);
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 1.8), navy);
    board.position.y = 0.29; board.rotation.y = Math.PI / 4; g.add(board);
    const gold = mat(0xe2b23f, 0.35, 0.4);
    const btn = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), gold);
    btn.position.y = 0.36; g.add(btn);
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.95, 8), gold);
    cord.rotation.z = Math.PI / 2; cord.position.set(0.47, 0.35, 0); g.add(cord);
    const hang = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 8), gold);
    hang.position.set(0.93, 0.1, 0); g.add(hang);
    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.1, 0.25, 12), gold);
    tassel.position.set(0.93, -0.25, 0); g.add(tassel);
    g.rotation.set(0.45, 0.4, 0.12);
    return g;
  }

  const objects = {
    code: { mesh: makeLaptop(), d: [0.5, 0.42], m: [0.6, 0.76], s: 1.0, ms: 0.5 },
    pizza: { mesh: makePizza(), d: [0.58, -0.4], m: [0.7, -0.2], s: 1.0, ms: 0.5 },
    cap: { mesh: makeCap(), d: [-0.6, -0.52], m: [-0.62, 0.76], s: 1.0, ms: 0.55 }
  };
  Object.values(objects).forEach((o, i) => { o.phase = i * 2.1; o.base = o.mesh.rotation.clone(); o.hover = 0; scene.add(o.mesh); });

  // Soft floating orbs
  const orbs = [];
  const orbDefs = [[-0.82, 0.55, 0.35, 'soft'], [-0.35, -0.85, 0.22, 'accent'], [0.86, 0.02, 0.28, 'soft'], [0.2, 0.86, 0.16, 'gold'], [-0.9, -0.1, 0.18, 'soft'], [0.92, -0.86, 0.4, 'soft']];
  orbDefs.forEach(([nx, ny, r, kind], i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), mat(0xffffff, 0.45));
    m.userData = { nx, ny, kind, phase: i * 1.7 };
    scene.add(m); orbs.push(m);
  });
  function paintOrbs() {
    const cs = getComputedStyle(document.documentElement);
    const col = { soft: cs.getPropertyValue('--halo').trim(), accent: cs.getPropertyValue('--accent').trim(), gold: '#e2b23f' };
    orbs.forEach(o => o.material.color.set(col[o.userData.kind] || '#dfe5f1').convertSRGBToLinear());
  }
  paintOrbs();
  try { matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { paintOrbs(); frame(); }); } catch (e) {}
  new MutationObserver(() => { paintOrbs(); frame(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const labels = {};
  document.querySelectorAll('.obj-label').forEach(l => { labels[l.dataset.obj] = l; });

  let W = 1, H = 1, halfH = 1, halfW = 1, mobile = false;
  function layout() {
    W = hero.clientWidth; H = hero.clientHeight;
    renderer.setSize(W, H, false);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    halfW = halfH * camera.aspect;
    mobile = W < 720;
    // keep objects clear of the centre column on wide screens
    const spreadX = Math.min(halfW, halfH * 1.9);
    Object.entries(objects).forEach(([k, o]) => {
      const [nx, ny] = mobile ? o.m : o.d;
      o.pos = new THREE.Vector3(nx * spreadX, ny * halfH, 0);
      o.scale = (mobile ? o.ms * Math.min(1, halfW / 3.4) : o.s) * Math.min(1.15, halfH / 4.4);
      o.mesh.scale.setScalar(o.scale);
      o.mesh.position.copy(o.pos);
      const lb = labels[k];
      const p = o.pos.clone(); p.y -= 1.45 * o.scale; p.project(camera);
      lb.style.left = ((p.x + 1) / 2 * 100) + '%';
      lb.style.top = ((1 - p.y) / 2 * 100) + '%';
    });
    orbs.forEach(m => { m.position.set(m.userData.nx * halfW * 0.95, m.userData.ny * halfH * 0.95, -2); });
    frame();
  }

  // Pointer: parallax + hover + click
  const pointer = new THREE.Vector2(0, 0), target = new THREE.Vector2(0, 0);
  const ray = new THREE.Raycaster();
  let hovered = null;
  function pick(ev) {
    const r = hero.getBoundingClientRect();
    const v = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(v, camera);
    for (const [k, o] of Object.entries(objects)) { if (ray.intersectObject(o.mesh, true).length) return k; }
    return null;
  }
  hero.addEventListener('pointermove', ev => {
    const r = hero.getBoundingClientRect();
    target.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
    hovered = pick(ev);
    hero.style.cursor = hovered ? 'pointer' : '';
    if (reduce) frame();
  });
  hero.addEventListener('pointerleave', () => { target.set(0, 0); hovered = null; hero.style.cursor = ''; });
  hero.addEventListener('click', ev => {
    if (ev.target.closest('button, a')) return;
    const k = pick(ev);
    if (k) document.querySelector(labels[k].dataset.target).scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  });

  const clock = new THREE.Clock();
  let t = 0;
  const easeOutBack = x => { const c = 1.5; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  function frame() {
    pointer.lerp(target, 0.06);
    // laptop: code types itself, then the caret keeps blinking
    const cd = objects.code.mesh.userData.code;
    if (cd) {
      const n = reduce ? cd.total : Math.min(cd.total, Math.max(0, Math.floor((t - 1.6) * 24)));
      const caret = !reduce && Math.floor(t * 2.4) % 2 === 0;
      const key = n + (caret ? 'c' : '');
      if (key !== cd.key) { cd.key = key; cd.draw(n, caret); cd.tex.needsUpdate = true; }
    }
    Object.entries(objects).forEach(([k, o], idx) => {
      o.hover += ((hovered === k ? 1 : 0) - o.hover) * 0.12;
      // intro: each object flies in from its side of the screen, one after another
      const raw = reduce ? 1 : Math.min(1, Math.max(0, (t - 0.35 - idx * 0.18) / 1.1));
      const e = raw >= 1 ? 1 : Math.max(0.001, easeOutBack(raw));
      const away = 1 - Math.min(1, e);
      const sx = Math.sign(o.pos.x) || 1, sy = Math.sign(o.pos.y) || 1;
      const bob = reduce ? 0 : Math.sin(t * 0.9 + o.phase) * 0.12;
      o.mesh.position.set(o.pos.x + pointer.x * 0.25 + sx * away * halfW * 0.9, o.pos.y + bob + pointer.y * 0.2 + sy * away * halfH * 0.5, 0);
      o.mesh.rotation.x = o.base.x - pointer.y * 0.25 + away * 1.4;
      o.mesh.rotation.y = o.base.y + pointer.x * 0.35 + (reduce ? 0 : Math.sin(t * 0.5 + o.phase) * 0.25) + o.spin - away * 2.4;
      o.mesh.scale.setScalar(o.scale * e * (1 + o.hover * 0.12));
      labels[k].style.color = o.hover > 0.5 ? 'var(--accent)' : '';
    });
    orbs.forEach(m => {
      const d = m.userData;
      m.position.y = d.ny * halfH * 0.95 + (reduce ? 0 : Math.sin(t * 0.6 + d.phase) * 0.2);
      m.position.x = d.nx * halfW * 0.95 - pointer.x * 0.4;
    });
    renderer.render(scene, camera);
  }
  Object.values(objects).forEach(o => { o.spin = 0; });

  let running = false, visible = true;
  function loop() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.25); // larger cap so slow devices still finish the intro on time
    t += dt;
    Object.entries(objects).forEach(([k, o]) => { if (hovered === k) o.spin += dt * 1.6; });
    frame();
    requestAnimationFrame(loop);
  }
  function setRunning(on) {
    if (reduce) { running = false; frame(); return; }
    if (on && !running) { running = true; clock.getDelta(); requestAnimationFrame(loop); }
    if (!on) running = false;
  }
  // The browser already pauses requestAnimationFrame in hidden tabs, so only the hero's visibility stops the loop.
  new IntersectionObserver(es => { visible = es[0].isIntersecting; setRunning(visible); }).observe(hero);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) setRunning(visible); });
  new ResizeObserver(layout).observe(hero);
  layout();
  setRunning(true);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
    // redraw the code texture once the mono font is in
    const old = objects.code.mesh; scene.remove(old);
    const fresh = makeLaptop(); objects.code.mesh = fresh; objects.code.base = fresh.rotation.clone();
    scene.add(fresh); layout();
  });
})();
