import * as THREE from 'three';

// --- 1. 初始化场景、相机和渲染器 ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB); // 天空蓝背景

// 相机设置
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// 渲染器设置
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. 添加物体 ---

// 地面
const groundGeometry = new THREE.PlaneGeometry(20, 20);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // 森林绿
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2; // 旋转至水平
scene.add(ground);

// 玩家 (立方体)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xFF0000 }); // 红色玩家
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.y = 0.5; // 放置在地面上
scene.add(player);

// 灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // 环境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 平行光
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

// --- 3. 交互控制 ---
const keys = {
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
};

window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = true;
});

window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
});

// --- 4. 游戏循环 ---
const speed = 0.1;

function animate() {
    requestAnimationFrame(animate);

    // 移动逻辑
    if (keys.w || keys.ArrowUp) player.position.z -= speed;
    if (keys.s || keys.ArrowDown) player.position.z += speed;
    if (keys.a || keys.ArrowLeft) player.position.x -= speed;
    if (keys.d || keys.ArrowRight) player.position.x += speed;

    // 简单的边界限制 (防止跑出地面)
    player.position.x = Math.max(-9.5, Math.min(9.5, player.position.x));
    player.position.z = Math.max(-9.5, Math.min(9.5, player.position.z));

    // 相机跟随
    camera.position.x = player.position.x;
    camera.position.z = player.position.z + 10;

    renderer.render(scene, camera);
}

// 窗口大小调整处理
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 启动游戏
animate();
