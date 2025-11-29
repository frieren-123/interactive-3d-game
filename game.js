import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ground
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Player (Cube)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.5;
scene.add(player);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// Input handling
const keys = {
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// Game loop
const speed = 0.1;

function animate() {
    requestAnimationFrame(animate);

    if (keys.w || keys.ArrowUp) player.position.z -= speed;
    if (keys.s || keys.ArrowDown) player.position.z += speed;
    if (keys.a || keys.ArrowLeft) player.position.x -= speed;
    if (keys.d || keys.ArrowRight) player.position.x += speed;

    // Simple boundary check
    player.position.x = Math.max(-9.5, Math.min(9.5, player.position.x));
    player.position.z = Math.max(-9.5, Math.min(9.5, player.position.z));

    // Camera follow
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
}

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
