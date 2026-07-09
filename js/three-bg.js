/* ── Three.js background ────────────────────────────────
   FIX: renderer wasn't disposed on page unload — memory leak
        if user navigates (SPA-style) or on hot-reloads.
   FIX: pixelRatio capped at 2 but some devices have ratio 3+
        causing blurry canvas. Keep cap at 2 for performance.
   FIX: window resize didn't update renderer pixel ratio
        (e.g. moving browser between monitors with diff DPR).
   FIX: shapes array never cleared between tab-visibility
        restore calls — animate() was being called twice
        after coming back from hidden tab, doubling speed.
        Fixed by tracking a single rafId and never double-starting.
   ══════════════════════════════════════════════════════ */
(function initThree() {
  const skip =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.innerWidth < 700 ||
    typeof THREE === 'undefined';

  const canvas = document.getElementById('bg-canvas');
  if (skip || !canvas) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 18;

  const matPurple = new THREE.MeshPhongMaterial({ color:0x6b21a8, emissive:0x3b0764, transparent:true, opacity:.7, shininess:120 });
  const matCyan   = new THREE.MeshPhongMaterial({ color:0x0891b2, emissive:0x0e4f5e, transparent:true, opacity:.65, shininess:100 });
  const matWire   = new THREE.MeshBasicMaterial({ color:0xa855f7, wireframe:true, transparent:true, opacity:.2 });
  const matWire2  = new THREE.MeshBasicMaterial({ color:0x06b6d4, wireframe:true, transparent:true, opacity:.15 });

  scene.add(new THREE.AmbientLight(0x1a0030, 2));
  const l1 = new THREE.PointLight(0x6b21a8, 3, 40); l1.position.set(-8, 8, 8); scene.add(l1);
  const l2 = new THREE.PointLight(0x0891b2, 3, 40); l2.position.set( 8,-6, 6); scene.add(l2);

  const shapes = [];
  function addShape(geo, mat, x, y, z) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {
      rx: (Math.random()-.5)*.008, ry: (Math.random()-.5)*.008, rz: (Math.random()-.5)*.005,
      floatSpeed: Math.random()*.003+.001, floatAmp: Math.random()*.6+.2,
      floatOffset: Math.random()*Math.PI*2, baseY: y,
    };
    scene.add(mesh); shapes.push(mesh);
  }

  addShape(new THREE.SphereGeometry(.9,32,32),     matPurple, -9, 4, 0);
  addShape(new THREE.SphereGeometry(.6,32,32),     matCyan,   10,-3,-2);
  addShape(new THREE.SphereGeometry(1.1,32,32),    matPurple,  5, 5,-4);
  addShape(new THREE.SphereGeometry(.5,32,32),     matCyan,   -5,-5, 2);
  addShape(new THREE.BoxGeometry(1.4,1.4,1.4),     matPurple,  7, 3, 1);
  addShape(new THREE.BoxGeometry(1,1,1),            matCyan,   -7,-2,-1);
  addShape(new THREE.BoxGeometry(.8,.8,.8),         matWire,    2,-6, 0);
  addShape(new THREE.BoxGeometry(1.6,1.6,1.6),     matWire2, -10, 1,-3);
  addShape(new THREE.OctahedronGeometry(1),         matCyan,   -3, 6,-2);
  addShape(new THREE.OctahedronGeometry(.7),        matPurple,  8,-5, 1);
  addShape(new THREE.OctahedronGeometry(1.2),       matWire,   -1,-3,-3);
  addShape(new THREE.IcosahedronGeometry(.8,0),     matCyan,    4,-1,-5);
  addShape(new THREE.IcosahedronGeometry(.6,0),     matWire2,  -6, 3,-4);
  addShape(new THREE.TorusGeometry(.9,.25,16,60),   matWire,   -2, 2, 2);
  addShape(new THREE.TorusGeometry(.7,.18,12,48),   matWire2,   6,-4,-2);

  let mouseX = 0, mouseY = 0;
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - .5) * 2;
      mouseY = (e.clientY / window.innerHeight - .5) * 2;
    });
  }

  let t = 0;
  // FIX: single rafId — prevents double-animation on visibility restore
  let rafId = null;
  let running = false;

  function animate() {
    if (!running) return;
    rafId = requestAnimationFrame(animate);
    t++;
    shapes.forEach(m => {
      m.rotation.x += m.userData.rx;
      m.rotation.y += m.userData.ry;
      m.rotation.z += m.userData.rz;
      m.position.y = m.userData.baseY + Math.sin(t * m.userData.floatSpeed + m.userData.floatOffset) * m.userData.floatAmp;
    });
    camera.position.x += (mouseX * 2 - camera.position.x) * .015;
    camera.position.y += (-mouseY * 1.5 - camera.position.y) * .015;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }

  function start() { if (!running) { running = true;  animate(); } }
  function stop()  { running = false; if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  start();

  document.addEventListener('visibilitychange', () => {
    document.hidden ? stop() : start();
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // FIX: update pixel ratio on resize (monitor change)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // FIX: dispose resources on page unload to prevent memory leak
  window.addEventListener('pagehide', () => {
    stop();
    renderer.dispose();
    [matPurple, matCyan, matWire, matWire2].forEach(m => m.dispose());
    shapes.forEach(m => m.geometry.dispose());
  });
})();