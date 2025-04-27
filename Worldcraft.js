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
        const material = new THREE.MeshBasicMaterial({
            color: (x + y) % 2 === 0 ? 0x00ff00 : 0x008000, // Alternate colors based on position
            wireframe: true
        });
        const block = new THREE.Mesh(geometry, material);

        // Add sine and cosine wave offsets for dynamic positioning
        block.position.set(
            x * blockSize + Math.sin(y * 0.5) * 0.2, // Add a sine wave offset to x
            Math.cos(x * 0.5) * 0.2,                 // Add a cosine wave offset to y
            y * blockSize
        );

        // Add rotation logic for blocks
        block.rotation.set(
            Math.sin(x * 0.1) * Math.PI * 0.1, // Rotate around x-axis based on sine wave
            Math.cos(y * 0.1) * Math.PI * 0.1, // Rotate around y-axis based on cosine wave
            0
        );

        // Add scaling logic for blocks
        const scaleFactor = 1 + Math.sin((x + y) * 0.2) * 0.1; // Scale based on sine wave
        block.scale.set(scaleFactor, scaleFactor, scaleFactor);

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
function movePlayer(playerId, direction) {
    const playerData = players[playerId];
    if (!playerData) return;

    const prevPos = { ...playerData.position }; // Save previous position

    if (direction === 'up' && playerData.position.y > 0) playerData.position.y--;
    if (direction === 'down' && playerData.position.y < gridSize - 1) playerData.position.y++;
    if (direction === 'left' && playerData.position.x > 0) playerData.position.x--;
    if (direction === 'right' && playerData.position.x < gridSize - 1) playerData.position.x++;

    // Check if the new position is occupied by a block
    const targetBlock = grid[playerData.position.x]?.[playerData.position.y];
    if (targetBlock && targetBlock.material.color.getHex() !== 0x00ff00) {
        playerData.position = prevPos; // Revert to previous position if blocked
    }

    playerData.mesh.position.set(
        playerData.position.x * blockSize,
        blockSize / 2,
        playerData.position.y * blockSize
    );
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