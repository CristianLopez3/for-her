// pompom-3d — procedural Pompompurin built from Three.js primitives.
// Three.js is loaded from CDN via the import map in index.html (user-approved exception).
// Visual target: the soft matte-clay Pompompurin render the user provided —
// one pale-cream egg blob (head + body merged), two long floppy ears drooping
// down to frame the face, a tilted reddish-brown beret sitting on top, open dot
// eyes + nose + w-mouth, tiny blush cheeks, stubby arms at the sides, little feet.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const pompomConfig = {
  colors: {
    cream: 0xf7df84, // warm pastel pudding-yellow, uniform across body/ears/limbs
    fuzz: 0xfdf0b0,
    blush: 0xef9d86, // soft pink cheek
    beret: 0x9c6444, // warm milk-chocolate brown
    dark: 0x3a2a1e, // eyes and mouth line (printed dark brown)
    nose: 0x7a5340, // muzzle nose, a touch lighter than the outline
  },
  material: { roughness: 0.72, metalness: 0.04 }, // soft satin, not bone-dry clay
  fuzz: { scale: 1.03, opacity: 0.12 },
  bodyNoise: { amplitude: 0.014 },
  camera: { fov: 40, position: [0, 0.9, 6.2] },
  controls: {
    target: [0, 0.25, 0],
    minDistance: 3.5,
    maxDistance: 9,
    autoRotateSpeed: 0.9,
    idleResumeMs: 2500,
  },
  pose: { beretTilt: -0.32 },
  breathing: { bobAmplitude: 0.045, bobSpeed: 1.6, scaleAmplitude: 0.012 },
  hop: { durationMs: 650, height: 0.5, wiggle: 0.12 },
};

const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

const state = {
  reducedMotion: reducedMotionQuery.matches,
  hopStart: null,
  idleTimer: null,
  pointerDown: { x: 0, y: 0 },
};

function plushMaterial(color) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: pompomConfig.material.roughness,
    metalness: pompomConfig.material.metalness,
  });
}

// Very subtle soft shell so the surface reads plush rather than hard clay.
function addFuzzShell(mesh) {
  const shell = new THREE.Mesh(
    mesh.geometry,
    new THREE.MeshBasicMaterial({
      color: pompomConfig.colors.fuzz,
      side: THREE.BackSide,
      transparent: true,
      opacity: pompomConfig.fuzz.opacity,
      depthWrite: false,
    })
  );
  shell.scale.setScalar(pompomConfig.fuzz.scale);
  mesh.add(shell);
}

function addMesh(parent, geometry, material, { position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], fuzz = false } = {}) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  if (fuzz) addFuzzShell(mesh);
  parent.add(mesh);
  return mesh;
}

function addSphere(parent, material, { radius = 1, ...opts }) {
  return addMesh(parent, new THREE.SphereGeometry(radius, 32, 24), material, opts);
}

function addCapsule(parent, material, { radius, length, ...opts }) {
  return addMesh(parent, new THREE.CapsuleGeometry(radius, length, 8, 20), material, opts);
}

function addArc(parent, material, { radius, tube, arc = Math.PI, ...opts }) {
  return addMesh(parent, new THREE.TorusGeometry(radius, tube, 10, 24, arc), material, opts);
}

// Flat printed-style feature (eye, blush) that sits flush on the curved face,
// like a Sanrio decal rather than a protruding 3D ball. Never casts shadow.
function addDecal(parent, material, { radius, segments = 24, ...opts }) {
  const mesh = addMesh(parent, new THREE.CircleGeometry(radius, segments), material, opts);
  mesh.castShadow = false;
  return mesh;
}

function flatMaterial(color) {
  return new THREE.MeshBasicMaterial({ color });
}

// Subtle organic imperfection so the surface is not a perfect sphere.
function displaceVertices(geometry, amplitude) {
  const pos = geometry.attributes.position;
  const normal = new THREE.Vector3();
  const point = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 1) {
    point.fromBufferAttribute(pos, i);
    normal.copy(point).normalize();
    const noise =
      Math.sin(point.x * 12.9 + point.y * 7.3) *
      Math.cos(point.z * 11.1 + point.x * 5.7);
    point.addScaledVector(normal, noise * amplitude);
    pos.setXYZ(i, point.x, point.y, point.z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

function buildPompompurin() {
  const { colors, pose } = pompomConfig;
  const cream = plushMaterial(colors.cream);
  const beretMat = plushMaterial(colors.beret);
  const noseMat = plushMaterial(colors.nose);
  const inkMat = flatMaterial(colors.dark); // crisp printed lines (eyes, mouth)
  const blushMat = flatMaterial(colors.blush);
  const group = new THREE.Group();

  // Pudding body: one soft egg (head + body merged, no neck), a touch wider at the
  // base so the silhouette reads like a flan rather than a perfect ball.
  const blobGeometry = new THREE.SphereGeometry(1.3, 48, 36);
  displaceVertices(blobGeometry, pompomConfig.bodyNoise.amplitude);
  addMesh(group, blobGeometry, cream, {
    position: [0, 0.02, 0],
    scale: [1.06, 1.12, 1.0],
    fuzz: true,
  });
  // Subtle wider lower belly for the pudding taper.
  addSphere(group, cream, {
    radius: 1.05,
    position: [0, -0.7, 0.02],
    scale: [1.08, 0.82, 1.02],
    fuzz: true,
  });

  // Floppy Golden-Retriever ears: wide flat paddles hanging down the sides of the
  // head, tips a touch outward. Each is one flattened sphere on its own pivot.
  [-1, 1].forEach((side) => {
    const ear = new THREE.Group();
    ear.position.set(side * 1.12, 0.98, 0.1);
    ear.rotation.z = side * 0.22; // hangs down, bottom splays outward to read distinct
    group.add(ear);
    addSphere(ear, cream, {
      radius: 0.58,
      position: [0, -0.82, 0],
      scale: [0.56, 1.5, 0.32], // wide + long + flat = distinct floppy paddle
      fuzz: true,
    });
  });

  // Beret: a soft flattened brown disc sitting tilted on top, with a small stem.
  const beret = new THREE.Group();
  beret.position.set(0.12, 1.42, 0.04);
  beret.rotation.set(0.12, 0, pose.beretTilt); // tips forward + to one side
  group.add(beret);
  addSphere(beret, beretMat, { radius: 0.62, scale: [1.05, 0.4, 1.02] }); // dome
  addSphere(beret, beretMat, { radius: 0.66, position: [0, -0.14, 0], scale: [1, 0.22, 1] }); // brim lip
  addSphere(beret, beretMat, { radius: 0.09, position: [0, 0.22, 0], scale: [1, 0.85, 1] }); // stem

  // Printed face — flat decals flush on the front, Sanrio decal style (not 3D balls).
  // Dot eyes.
  addDecal(group, inkMat, { radius: 0.082, position: [-0.42, 0.42, 1.23], rotation: [0, 0.32, 0] });
  addDecal(group, inkMat, { radius: 0.082, position: [0.42, 0.42, 1.23], rotation: [0, -0.32, 0] });
  // Muzzle nose: a small soft brown nub that catches a little light.
  addSphere(group, noseMat, {
    radius: 0.1,
    position: [0, 0.16, 1.3],
    scale: [1.35, 1.0, 0.5],
  });
  // Thin printed philtrum line, then the w-shaped smile below the nose.
  addMesh(group, new THREE.CapsuleGeometry(0.017, 0.1, 4, 8), inkMat, {
    position: [0, 0.03, 1.3],
  }).castShadow = false;
  addArc(group, inkMat, { radius: 0.11, tube: 0.02, position: [-0.09, -0.02, 1.29], rotation: [0, 0, Math.PI] }).castShadow = false;
  addArc(group, inkMat, { radius: 0.11, tube: 0.02, position: [0.09, -0.02, 1.29], rotation: [0, 0, Math.PI] }).castShadow = false;
  // Soft pink cheek blush, flat ovals flush on the surface.
  addDecal(group, blushMat, { radius: 0.15, position: [-0.66, 0.06, 1.13], scale: [1.2, 0.82, 1], rotation: [0, 0.42, 0] });
  addDecal(group, blushMat, { radius: 0.15, position: [0.66, 0.06, 1.13], scale: [1.2, 0.82, 1], rotation: [0, -0.42, 0] });

  // Little arm nubs resting at the sides, sunk into the body.
  addCapsule(group, cream, {
    radius: 0.27,
    length: 0.3,
    position: [-1.14, -0.38, 0.38],
    rotation: [0, 0, 0.5],
    fuzz: true,
  });
  addCapsule(group, cream, {
    radius: 0.27,
    length: 0.3,
    position: [1.14, -0.38, 0.38],
    rotation: [0, 0, -0.5],
    fuzz: true,
  });

  // Two little feet poking forward at the bottom front.
  addSphere(group, cream, {
    radius: 0.5,
    position: [-0.5, -1.12, 0.55],
    scale: [0.72, 0.55, 1.05],
    rotation: [0, 0.22, 0],
    fuzz: true,
  });
  addSphere(group, cream, {
    radius: 0.5,
    position: [0.5, -1.12, 0.55],
    scale: [0.72, 0.55, 1.05],
    rotation: [0, -0.22, 0],
    fuzz: true,
  });

  return group;
}

function init() {
  const stage = document.getElementById('pompom-stage');
  if (!stage) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x181818); // matches --surface

  const camera = new THREE.PerspectiveCamera(
    pompomConfig.camera.fov,
    stage.clientWidth / stage.clientHeight,
    0.1,
    100
  );
  camera.position.set(...pompomConfig.camera.position);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.appendChild(renderer.domElement);

  // Soft three-point studio light: warm ambient, a gentle warm key with a soft
  // shadow, a cool fill to lift the left side, and a barely-there purple rim.
  scene.add(new THREE.AmbientLight(0xfffaed, 0.9));

  const keyLight = new THREE.DirectionalLight(0xfff1d6, 1.0);
  keyLight.position.set(3.5, 4.5, 3);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -4;
  keyLight.shadow.camera.right = 4;
  keyLight.shadow.camera.top = 4;
  keyLight.shadow.camera.bottom = -4;
  keyLight.shadow.radius = 8;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe6ddf5, 0.35); // soft cool fill, left
  fillLight.position.set(-3.5, 1.5, 2.5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xa78bfa, 0.18); // barely-there accent
  rimLight.position.set(-3, 2, -4);
  scene.add(rimLight);

  const purin = buildPompompurin();
  scene.add(purin);

  // Soft blob-style contact shadow catcher under the character.
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(3.5, 48),
    new THREE.ShadowMaterial({ opacity: 0.25 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -1.4;
  ground.receiveShadow = true;
  scene.add(ground);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.target.set(...pompomConfig.controls.target);
  controls.minDistance = pompomConfig.controls.minDistance;
  controls.maxDistance = pompomConfig.controls.maxDistance;
  controls.autoRotate = !state.reducedMotion;
  controls.autoRotateSpeed = pompomConfig.controls.autoRotateSpeed;

  controls.addEventListener('start', () => {
    stage.classList.add('dragging');
    controls.autoRotate = false;
    if (state.idleTimer) clearTimeout(state.idleTimer);
  });

  controls.addEventListener('end', () => {
    stage.classList.remove('dragging');
    if (state.reducedMotion) return;
    state.idleTimer = setTimeout(() => {
      controls.autoRotate = true;
    }, pompomConfig.controls.idleResumeMs);
  });

  reducedMotionQuery.addEventListener('change', (event) => {
    state.reducedMotion = event.matches;
    controls.autoRotate = !event.matches;
    if (event.matches) {
      purin.position.y = 0;
      purin.rotation.z = 0;
      purin.scale.setScalar(1);
    }
  });

  // Click/tap (not drag) on the character triggers a happy hop.
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  renderer.domElement.addEventListener('pointerdown', (event) => {
    state.pointerDown.x = event.clientX;
    state.pointerDown.y = event.clientY;
  });

  renderer.domElement.addEventListener('pointerup', (event) => {
    const moved = Math.hypot(
      event.clientX - state.pointerDown.x,
      event.clientY - state.pointerDown.y
    );
    if (moved > 6 || state.reducedMotion) return;

    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.intersectObjects(purin.children, true).length > 0) {
      state.hopStart = performance.now();
    }
  });

  function resize() {
    const width = stage.clientWidth;
    const height = stage.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    if (!state.reducedMotion) {
      const { bobAmplitude, bobSpeed, scaleAmplitude } = pompomConfig.breathing;
      let y = Math.sin(elapsed * bobSpeed) * bobAmplitude;
      let wiggle = 0;
      purin.scale.setScalar(1 + Math.sin(elapsed * bobSpeed) * scaleAmplitude);

      if (state.hopStart !== null) {
        const t = (performance.now() - state.hopStart) / pompomConfig.hop.durationMs;
        if (t >= 1) {
          state.hopStart = null;
        } else {
          y += Math.sin(Math.PI * t) * pompomConfig.hop.height;
          wiggle = Math.sin(t * Math.PI * 4) * pompomConfig.hop.wiggle;
        }
      }

      purin.position.y = y;
      purin.rotation.z = wiggle;
    }

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

// Module scripts run after the document is parsed, so top-level init is safe.
init();
