import * as THREE from 'three';

// Game state
const gameState = {
    score: 0,
    coinsCollected: 0,
    totalCoins: 5,
    isJumping: false,
    velocityY: 0,
    gravity: -0.015,
    jumpForce: 0.3,
    moveSpeed: 0.15,
    groundLevel: 0.5
};

// Input state
const keys = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
};

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 10, 15);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById('game-container').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 50;
directionalLight.shadow.camera.left = -20;
directionalLight.shadow.camera.right = 20;
directionalLight.shadow.camera.top = 20;
directionalLight.shadow.camera.bottom = -20;
scene.add(directionalLight);

// Ground
const groundGeometry = new THREE.BoxGeometry(30, 0.5, 30);
const groundMaterial = new THREE.MeshStandardMaterial({ 
    color: 0x228b22,
    roughness: 0.8
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -0.25;
ground.receiveShadow = true;
scene.add(ground);

// Create a grid pattern on ground
const gridHelper = new THREE.GridHelper(30, 30, 0x000000, 0x000000);
gridHelper.position.y = 0.01;
gridHelper.material.opacity = 0.2;
gridHelper.material.transparent = true;
scene.add(gridHelper);

// Player (a cube character)
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xff4444,
    roughness: 0.3,
    metalness: 0.2
});
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0.5, 0);
player.castShadow = true;
player.receiveShadow = true;
scene.add(player);

// Add eyes to player
const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const pupilGeometry = new THREE.SphereGeometry(0.05, 16, 16);
const pupilMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.position.set(-0.2, 0.2, 0.5);
player.add(leftEye);

const leftPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
leftPupil.position.set(0, 0, 0.06);
leftEye.add(leftPupil);

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.position.set(0.2, 0.2, 0.5);
player.add(rightEye);

const rightPupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
rightPupil.position.set(0, 0, 0.06);
rightEye.add(rightPupil);

// Obstacles (static boxes that block movement)
const obstacles = [];
const obstaclePositions = [
    { x: 5, z: 0 },
    { x: -5, z: 3 },
    { x: 3, z: -5 },
    { x: -3, z: -3 },
    { x: 0, z: 6 },
    { x: 7, z: 7 },
    { x: -7, z: -7 }
];

obstaclePositions.forEach((pos) => {
    const obstacleGeometry = new THREE.BoxGeometry(2, 2, 2);
    const obstacleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b4513,
        roughness: 0.9
    });
    const obstacle = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
    obstacle.position.set(pos.x, 1, pos.z);
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;
    scene.add(obstacle);
    obstacles.push(obstacle);
});

// Collectible coins
const coins = [];
const coinPositions = [
    { x: 3, z: 3 },
    { x: -4, z: 1 },
    { x: 6, z: -4 },
    { x: -6, z: -5 },
    { x: 0, z: -8 }
];

coinPositions.forEach((pos) => {
    const coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
    const coinMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        roughness: 0.2,
        metalness: 0.8
    });
    const coin = new THREE.Mesh(coinGeometry, coinMaterial);
    coin.position.set(pos.x, 1, pos.z);
    coin.rotation.x = Math.PI / 2;
    coin.castShadow = true;
    scene.add(coin);
    coins.push(coin);
});

// Collision detection helper
function checkCollision(obj1, obj2, threshold = 1.5) {
    const dx = obj1.position.x - obj2.position.x;
    const dz = obj1.position.z - obj2.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance < threshold;
}

// Check if movement would cause collision with obstacles
function wouldCollide(newX, newZ) {
    for (const obstacle of obstacles) {
        const dx = newX - obstacle.position.x;
        const dz = newZ - obstacle.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance < 1.8) {
            return true;
        }
    }
    return false;
}

// Check boundaries
function clampPosition(pos) {
    const boundary = 14;
    return Math.max(-boundary, Math.min(boundary, pos));
}

// Update UI
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('coins').textContent = gameState.coinsCollected;
}

// Input handling
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = true;
            break;
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = true;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = true;
            break;
        case 'KeyD':
        case 'ArrowRight':
            keys.right = true;
            break;
        case 'Space':
            if (!gameState.isJumping) {
                gameState.isJumping = true;
                gameState.velocityY = gameState.jumpForce;
            }
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
            keys.forward = false;
            break;
        case 'KeyS':
        case 'ArrowDown':
            keys.backward = false;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            keys.left = false;
            break;
        case 'KeyD':
        case 'ArrowRight':
            keys.right = false;
            break;
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Calculate new position based on input
    let newX = player.position.x;
    let newZ = player.position.z;
    
    if (keys.forward) newZ -= gameState.moveSpeed;
    if (keys.backward) newZ += gameState.moveSpeed;
    if (keys.left) newX -= gameState.moveSpeed;
    if (keys.right) newX += gameState.moveSpeed;
    
    // Apply movement if no collision
    if (!wouldCollide(newX, player.position.z)) {
        player.position.x = clampPosition(newX);
    }
    if (!wouldCollide(player.position.x, newZ)) {
        player.position.z = clampPosition(newZ);
    }
    
    // Apply gravity and jumping
    if (gameState.isJumping || player.position.y > gameState.groundLevel) {
        gameState.velocityY += gameState.gravity;
        player.position.y += gameState.velocityY;
        
        if (player.position.y <= gameState.groundLevel) {
            player.position.y = gameState.groundLevel;
            gameState.isJumping = false;
            gameState.velocityY = 0;
        }
    }
    
    // Rotate coins
    coins.forEach((coin) => {
        if (coin.visible) {
            coin.rotation.z += 0.05;
        }
    });
    
    // Check coin collection
    for (let i = coins.length - 1; i >= 0; i--) {
        const coin = coins[i];
        if (coin.visible && checkCollision(player, coin, 1.0)) {
            coin.visible = false;
            gameState.coinsCollected++;
            gameState.score += 100;
            updateUI();
            
            // Visual feedback - small bounce
            if (gameState.velocityY <= 0 && player.position.y <= gameState.groundLevel + 0.1) {
                gameState.velocityY = 0.1;
                gameState.isJumping = true;
            }
        }
    }
    
    // Simple player rotation based on movement direction
    if (keys.forward && !keys.backward) {
        player.rotation.y = 0;
    } else if (keys.backward && !keys.forward) {
        player.rotation.y = Math.PI;
    } else if (keys.left && !keys.right) {
        player.rotation.y = Math.PI / 2;
    } else if (keys.right && !keys.left) {
        player.rotation.y = -Math.PI / 2;
    }
    
    // Camera follows player smoothly
    const targetCameraX = player.position.x;
    const targetCameraZ = player.position.z + 15;
    camera.position.x += (targetCameraX - camera.position.x) * 0.05;
    camera.position.z += (targetCameraZ - camera.position.z) * 0.05;
    camera.lookAt(player.position.x, player.position.y + 2, player.position.z);
    
    renderer.render(scene, camera);
}

// Start the game
updateUI();
animate();

console.log('🎮 Interactive 3D Game loaded!');
console.log('Use WASD or Arrow keys to move, SPACE to jump');
console.log('Collect all coins to increase your score!');
