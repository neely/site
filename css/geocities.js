/* geocities.js — Mount/unmount Geocities theme extras
   Injects: marquee, construction banner, spinning protein,
   visitor counter, Cool Links, and Webring.
   All injected nodes are tracked and removed cleanly on unmount.
   Three.js is loaded lazily and intentionally NOT removed on
   unmount (so remounting is instant on repeat visits).
----------------------------------------------------------------- */
const GC = (() => {

  let nodes   = [];    // tracked injected DOM nodes
  let mounted = false;
  let animId  = null;
  let glRenderer = null;

  // ── DOM helpers ───────────────────────────────────────────────
  function make(tag, attrs, html) {
    const e = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (k === 'class') e.className = v;
      else e.setAttribute(k, v);
    });
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  function track(e) { nodes.push(e); return e; }

  // ── Derived content (stays in sync with index.html) ───────────
  function pubCount() {
    const pub = document.querySelector('.item.publications');
    if (!pub) return '??';
    return [...pub.querySelectorAll('p')]
      .filter(p => /^\d+\./.test(p.textContent.trim())).length;
  }

  function marqueeHTML() {
    const name  = (document.querySelector('.header_name')?.textContent || 'Benjamin Neely').trim().toUpperCase();
    const title = document.querySelector('#left_col .title')?.textContent?.trim() || 'RESEARCHER';
    const inst  = document.querySelector('#left_col .subtitle')?.textContent?.trim() || 'NIST';
    return [
      `🧬 WELCOME TO ${name}'S HOMEPAGE 🧬`,
      `★ ${title} @ ${inst} ★`,
      '🐬 DOLPHINS! SEA LIONS! BATS! 🦇',
      `✦ ${pubCount()} PUBLICATIONS AND COUNTING ✦`,
      '⚗️ MASS SPECTROMETRY 4 LYFE ⚗️',
    ].join('&nbsp;&nbsp;&nbsp;&nbsp;');
  }

  // ── Injectors ─────────────────────────────────────────────────
  function injectMarquee() {
    const wrap = track(make('div', { id: 'gc-marquee' }));
    const mq   = make('marquee', { scrollamount: '4' });
    mq.innerHTML = marqueeHTML();
    wrap.appendChild(mq);
    document.body.prepend(wrap);
  }

  function injectConstruction() {
    const d = track(make('div', { id: 'gc-construction' }));
    d.innerHTML = `<span>🚧</span><span class="gc-blink">★ UNDER CONSTRUCTION ★</span><span>🚧</span>`;
    const content = document.getElementById('content');
    content.parentNode.insertBefore(d, content);
  }

  function injectHeaderExtras() {
    const header = document.getElementById('header');

    // Spinning protein canvas
    const wrap = track(make('div', { id: 'gc-protein-wrap' }));
    wrap.innerHTML = `<canvas id="gc-canvas" width="180" height="180"></canvas>
                      <div class="gc-blink" id="gc-protein-label">✦ SPINNING PROTEIN ✦</div>`;
    header.appendChild(wrap);

    // Visitor counter
    const counter = track(make('div', { id: 'gc-counter' }));
    counter.innerHTML = `<span class="gc-counter-label">YOU ARE VISITOR NUMBER</span>
                         <span class="gc-counter-num">001,337</span>
                         <span class="gc-counter-label">SINCE 1997</span>`;
    header.appendChild(counter);

    // Netscape badge
    const badge = track(make('div', { id: 'gc-badge' }));
    badge.textContent = '✓ BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 AT 800×600';
    header.appendChild(badge);
  }

  // Hardcoded — update here if media links change
  function injectCoolLinks() {
    const d = track(make('div', { class: 'item', id: 'gc-coollinks' }));
    d.innerHTML = `
      <span class="large_title">Cool Links!!</span>
      <p><a href="https://www.nautilus.bio/blog/science-communication-and-proteomics-benefits-barriers-and-solution-with-ben-neely-and-ben-orsburn/" target="_blank">🎙️ Science Communication and Proteomics Podcast</a></p>
      <p><a href="https://anchor.fm/theproteomicsshow" target="_blank">🎙️ The Proteomics Show</a></p>
      <p><a href="https://www.genengnews.com/multimedia/is-proteomics-the-next-big-ome/" target="_blank">📺 Is Proteomics the Next Big "Ome"? (2024)</a></p>
      <p><a href="https://www.technologynetworks.com/proteomics/news/brewing-up-a-storm-scientists-conduct-a-global-beer-proteomics-study-343689" target="_blank">🍺 Global Beer Proteomics Study (2020)</a></p>
      <p><a href="https://www.nist.gov/news-events/news/2017/02/diving-deep-dolphin-genome-could-benefit-human-health" target="_blank">🐬 Diving Deep into the Dolphin Genome (2017)</a></p>
      <p><a href="https://www.nist.gov/blogs/taking-measure/blood-sweat-and-genomes-quest-advance-measurement-science-non-model-organisms" target="_blank">🧬 Blood, Sweat and Genomes (2019)</a></p>`;
    document.getElementById('right_col').appendChild(d);
  }

  function injectWebring() {
    const d = track(make('div', { class: 'item', id: 'gc-webring' }));
    d.innerHTML = `
      <span class="large_title" style="display:block;text-align:center">Webring</span>
      <p style="text-align:center">
        <a href="#">◄◄ Prev</a> &nbsp;|&nbsp;
        <a href="#">PROTEOMICS<br>WEBRING</a>
        &nbsp;|&nbsp; <a href="#">Next ►►</a>
      </p>`;
    document.getElementById('right_col').appendChild(d);
  }

  // ── Three.js protein ribbon ───────────────────────────────────
  function initProtein() {
    const canvas = document.getElementById('gc-canvas');
    if (!canvas || !window.THREE) return;
    const T = window.THREE;

    const renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(180, 180);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    glRenderer = renderer;

    const scene  = new T.Scene();
    const camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    scene.add(new T.AmbientLight(0xffffff, 0.4));
    const d1 = new T.DirectionalLight(0xff88ff, 1.2);
    d1.position.set(5, 5, 5);
    scene.add(d1);
    const d2 = new T.DirectionalLight(0x88ffff, 0.8);
    d2.position.set(-5, -3, 2);
    scene.add(d2);

    const protein = new T.Group();
    scene.add(protein);

    function v(x, y, z) { return new T.Vector3(x, y, z); }

    function tube(pts, r, color, seg = 8) {
      const geo = new T.TubeGeometry(new T.CatmullRomCurve3(pts), pts.length * 4, r, seg, false);
      return new T.Mesh(geo, new T.MeshPhongMaterial({ color, shininess: 80 }));
    }

    // Alpha helix 1 — teal
    const h1 = [];
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, a = t * Math.PI * 4;
      h1.push(v(Math.cos(a) * 0.55, t * 3.2 - 1.6, Math.sin(a) * 0.55));
    }
    protein.add(tube(h1, 0.18, 0x00cccc));

    // Alpha helix 2 — magenta, tilted
    const h2 = [];
    for (let i = 0; i <= 48; i++) {
      const t = i / 48, a = t * Math.PI * 3.2 + 1.0;
      h2.push(v(Math.cos(a) * 0.5 + 1.1, t * 2.4 - 0.5, Math.sin(a) * 0.5 - 0.6));
    }
    const hm = tube(h2, 0.16, 0xdd44cc);
    hm.rotation.z = 0.4;
    protein.add(hm);

    // Beta strands — gold and orange
    const b1 = [], b2 = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      b1.push(v(t * 2.4 - 1.2, -1.4 + Math.sin(t * Math.PI) * 0.15, -1.2));
      b2.push(v(t * 2.2 - 1.1, -1.9 + Math.sin(t * Math.PI) * 0.12, -0.7));
    }
    protein.add(tube(b1, 0.22, 0xddaa00, 4));
    protein.add(tube(b2, 0.19, 0xff6600, 4));

    // Loop regions — grey
    protein.add(tube([v(0.55,1.6,0),   v(0.9,1.2,0.8),   v(1.5,0.9,0.2),  v(1.1,0.4,-0.3)],  0.08, 0xaaaaaa, 6));
    protein.add(tube([v(-0.55,-1.6,0), v(-0.3,-1.8,-0.7), v(0.4,-1.6,-1.0), v(1.0,-1.4,-1.2)], 0.08, 0xaaaaaa, 6));

    protein.position.set(-0.3, 0, 0);

    function animate() {
      animId = requestAnimationFrame(animate);
      protein.rotation.y += 0.012;
      protein.rotation.x += 0.003;
      renderer.render(scene, camera);
    }
    animate();
  }

  function loadThree(cb) {
    if (window.THREE) { cb(); return; }
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = cb;
    document.head.appendChild(s);
    // Intentionally not tracked — Three.js stays loaded for fast remounting
  }

  // ── Public API ────────────────────────────────────────────────
  function mount() {
    if (mounted) return;
    mounted = true;
    injectMarquee();
    injectConstruction();
    injectHeaderExtras();
    injectCoolLinks();
    injectWebring();
    loadThree(initProtein);
  }

  function unmount() {
    if (!mounted) return;
    mounted = false;
    if (animId)     { cancelAnimationFrame(animId); animId = null; }
    if (glRenderer) { glRenderer.dispose(); glRenderer = null; }
    nodes.forEach(n => n.remove());
    nodes = [];
  }

  return { mount, unmount };
})();
