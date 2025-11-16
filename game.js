// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Game state
const game = {
    started: false,
    over: false,
    tshirtCount: 0,
    score: 0,
    keys: {},
    gravity: 0.6,
    friction: 0.8
};

// Player object
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 40,
    baseWidth: 30,
    baseHeight: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 12,
    onGround: false,
    color: '#FF6B6B',
    tshirts: 0,
    maxSize: 2.5
};

// Platforms
const platforms = [
    { x: 0, y: 550, width: 800, height: 50, color: '#8B4513' }, // Ground
    { x: 150, y: 450, width: 120, height: 20, color: '#A0522D' },
    { x: 350, y: 380, width: 100, height: 20, color: '#A0522D' },
    { x: 520, y: 320, width: 120, height: 20, color: '#A0522D' },
    { x: 300, y: 250, width: 100, height: 20, color: '#A0522D' },
    { x: 100, y: 180, width: 120, height: 20, color: '#A0522D' },
    { x: 500, y: 150, width: 150, height: 20, color: '#A0522D' }
];

// T-Shirts
const tshirts = [
    { x: 200, y: 410, width: 25, height: 25, collected: false, color: '#FF1744' },
    { x: 400, y: 340, width: 25, height: 25, collected: false, color: '#2196F3' },
    { x: 570, y: 280, width: 25, height: 25, collected: false, color: '#4CAF50' },
    { x: 350, y: 210, width: 25, height: 25, collected: false, color: '#FF9800' },
    { x: 150, y: 140, width: 25, height: 25, collected: false, color: '#9C27B0' },
    { x: 550, y: 110, width: 25, height: 25, collected: false, color: '#FFEB3B' },
    { x: 450, y: 500, width: 25, height: 25, collected: false, color: '#00BCD4' },
    { x: 700, y: 500, width: 25, height: 25, collected: false, color: '#E91E63' }
];

// Goal flag
const goal = {
    x: 720,
    y: 80,
    width: 40,
    height: 70,
    reached: false
};

// Input handling
document.addEventListener('keydown', (e) => {
    if (!game.started) {
        startGame();
    }
    game.keys[e.key] = true;

    // Jump
    if ((e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }
});

document.addEventListener('keyup', (e) => {
    game.keys[e.key] = false;
});

// Restart button
document.getElementById('restartBtn').addEventListener('click', () => {
    location.reload();
});

function startGame() {
    game.started = true;
    document.getElementById('instructions').style.display = 'none';
}

// Update player size based on t-shirts collected
function updatePlayerSize() {
    const sizeMultiplier = Math.min(1 + (player.tshirts * 0.2), player.maxSize);
    player.width = player.baseWidth * sizeMultiplier;
    player.height = player.baseHeight * sizeMultiplier;

    // Update speed (gets slower when bigger/heavier)
    player.speed = 5 - (player.tshirts * 0.15);
    player.jumpPower = 12 - (player.tshirts * 0.3);

    // Ensure minimum speed and jump power
    player.speed = Math.max(player.speed, 2);
    player.jumpPower = Math.max(player.jumpPower, 8);

    // Update UI
    document.getElementById('playerSize').textContent = sizeMultiplier.toFixed(1) + 'x';
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update game state
function update() {
    if (!game.started || game.over) return;

    // Player movement
    if (game.keys['ArrowLeft'] || game.keys['a']) {
        player.velocityX = -player.speed;
    } else if (game.keys['ArrowRight'] || game.keys['d']) {
        player.velocityX = player.speed;
    } else {
        player.velocityX *= game.friction;
    }

    // Apply gravity
    player.velocityY += game.gravity;

    // Update position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // Reset onGround
    player.onGround = false;

    // Platform collision
    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            // Landing on platform from above
            if (player.velocityY > 0 && player.y + player.height - player.velocityY <= platform.y + 5) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.onGround = true;
            }
            // Hitting platform from below
            else if (player.velocityY < 0 && player.y - player.velocityY >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.velocityY = 0;
            }
            // Side collisions
            else if (player.velocityX > 0) {
                player.x = platform.x - player.width;
                player.velocityX = 0;
            } else if (player.velocityX < 0) {
                player.x = platform.x + platform.width;
                player.velocityX = 0;
            }
        }
    });

    // T-shirt collection
    tshirts.forEach(tshirt => {
        if (!tshirt.collected && checkCollision(player, tshirt)) {
            tshirt.collected = true;
            player.tshirts++;
            game.tshirtCount++;
            game.score += 100;
            updatePlayerSize();

            // Update UI
            document.getElementById('tshirtCount').textContent = game.tshirtCount;
            document.getElementById('score').textContent = game.score;
        }
    });

    // Check if reached goal
    if (!goal.reached && checkCollision(player, goal)) {
        goal.reached = true;
        endGame();
    }

    // Boundary check
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y > canvas.height) {
        // Respawn at start
        player.x = 50;
        player.y = 300;
        player.velocityX = 0;
        player.velocityY = 0;
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    drawClouds();

    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Add grass on ground
        if (platform.y === 550) {
            ctx.fillStyle = '#228B22';
            ctx.fillRect(platform.x, platform.y, platform.width, 5);
        }
    });

    // Draw t-shirts
    tshirts.forEach(tshirt => {
        if (!tshirt.collected) {
            drawTshirt(tshirt.x, tshirt.y, tshirt.width, tshirt.height, tshirt.color);
        }
    });

    // Draw goal flag
    if (!goal.reached) {
        drawFlag(goal.x, goal.y, goal.width, goal.height);
    }

    // Draw player
    drawPlayer();
}

function drawClouds() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';

    // Simple cloud shapes
    drawCloud(100, 50, 60);
    drawCloud(300, 80, 50);
    drawCloud(500, 40, 70);
    drawCloud(650, 70, 55);
}

function drawCloud(x, y, size) {
    ctx.beginPath();
    ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
    ctx.arc(x + size * 0.4, y, size * 0.4, 0, Math.PI * 2);
    ctx.arc(x - size * 0.4, y, size * 0.4, 0, Math.PI * 2);
    ctx.fill();
}

function drawTshirt(x, y, width, height, color) {
    ctx.fillStyle = color;

    // T-shirt body
    ctx.fillRect(x + width * 0.2, y + height * 0.3, width * 0.6, height * 0.7);

    // Sleeves
    ctx.fillRect(x, y + height * 0.3, width * 0.3, height * 0.3);
    ctx.fillRect(x + width * 0.7, y + height * 0.3, width * 0.3, height * 0.3);

    // Collar
    ctx.fillRect(x + width * 0.35, y + height * 0.2, width * 0.3, height * 0.2);

    // Outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + width * 0.2, y + height * 0.3, width * 0.6, height * 0.7);
}

function drawPlayer() {
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;

    // Draw collected t-shirts on player (layered effect)
    const collectedTshirts = tshirts.filter(t => t.collected);
    collectedTshirts.forEach((tshirt, index) => {
        const offset = index * 2;
        ctx.fillStyle = tshirt.color;
        ctx.globalAlpha = 0.6;
        ctx.fillRect(
            player.x - offset,
            player.y - offset,
            player.width + offset * 2,
            player.height + offset * 2
        );
    });
    ctx.globalAlpha = 1;

    // Player body
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Face
    ctx.fillStyle = '#FFE4C4';
    const faceSize = player.width * 0.6;
    ctx.fillRect(
        player.x + (player.width - faceSize) / 2,
        player.y + player.height * 0.15,
        faceSize,
        faceSize
    );

    // Eyes
    ctx.fillStyle = '#000';
    const eyeSize = player.width * 0.1;
    ctx.fillRect(
        player.x + player.width * 0.3,
        player.y + player.height * 0.3,
        eyeSize,
        eyeSize
    );
    ctx.fillRect(
        player.x + player.width * 0.6,
        player.y + player.height * 0.3,
        eyeSize,
        eyeSize
    );

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(
        centerX,
        player.y + player.height * 0.45,
        player.width * 0.2,
        0,
        Math.PI
    );
    ctx.stroke();

    // Outline
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);
}

function drawFlag(x, y, width, height) {
    // Pole
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, width * 0.1, height);

    // Flag
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.moveTo(x + width * 0.1, y);
    ctx.lineTo(x + width, y + height * 0.2);
    ctx.lineTo(x + width * 0.1, y + height * 0.4);
    ctx.closePath();
    ctx.fill();

    // Flag pattern
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 16px Arial';
    ctx.fillText('!', x + width * 0.4, y + height * 0.25);
}

function endGame() {
    game.over = true;

    // Calculate final score
    const tshirtBonus = game.tshirtCount * 500;
    const sizeBonus = Math.floor((player.width / player.baseWidth) * 1000);
    game.score += tshirtBonus + sizeBonus;

    // Show game over screen
    document.getElementById('finalTshirts').textContent = game.tshirtCount;
    document.getElementById('finalSize').textContent = (player.width / player.baseWidth).toFixed(1) + 'x';
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
