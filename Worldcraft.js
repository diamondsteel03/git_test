import * as THREE from 'three';

// Initialize the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Grid size and block size
const gridSize = 10;
const blockSize = 1;

// Create a grid of blocks
const grid = [];
for (let x = 0; x < gridSize; x++) {
    grid[x] = [];
    for (let y = 0; y < gridSize; y++) {
        const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        const block = new THREE.Mesh(geometry, material);
        block.position.set(x * blockSize, 0, y * blockSize);
        scene.add(block);
        grid[x][y] = block;
    }
}

// Player representation
const playerGeometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

// Player position
let playerPos = { x: 0, y: 0 };
player.position.set(playerPos.x * blockSize, blockSize / 2, playerPos.y * blockSize);

// Camera position
camera.position.set(gridSize / 2, gridSize, gridSize * 1.5);
camera.lookAt(gridSize / 2, 0, gridSize / 2);

// Function to move the player
function movePlayer(direction) {
    if (direction === 'up' && playerPos.y > 0) playerPos.y--;
    if (direction === 'down' && playerPos.y < gridSize - 1) playerPos.y++;
    if (direction === 'left' && playerPos.x > 0) playerPos.x--;
    if (direction === 'right' && playerPos.x < gridSize - 1) playerPos.x++;
    player.position.set(playerPos.x * blockSize, blockSize / 2, playerPos.y * blockSize);
}

// Function to place a block
function placeBlock() {
    const geometry = new THREE.BoxGeometry(blockSize, blockSize, blockSize);
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const block = new THREE.Mesh(geometry, material);
    block.position.set(playerPos.x * blockSize, blockSize / 2, playerPos.y * blockSize);
    scene.add(block);
}

// Game controls
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer('up');
            break;
        case 'ArrowDown':
            movePlayer('down');
            break;
        case 'ArrowLeft':
            movePlayer('left');
            break;
        case 'ArrowRight':
            movePlayer('right');
            break;
        case ' ':
            placeBlock();
            break;
        default:
            console.log('Use arrow keys to move, space to place a block.');
    }
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();