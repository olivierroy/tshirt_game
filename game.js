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
    friction: 0.8,
    currentLevel: 0,
    totalLevels: 3
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

// Level definitions
const levels = [
    // Level 1
    {
        playerStart: { x: 50, y: 300 },
        platforms: [
            { x: 0, y: 550, width: 800, height: 50, color: '#8B4513' }, // Ground
            { x: 150, y: 450, width: 120, height: 20, color: '#A0522D' },
            { x: 350, y: 380, width: 100, height: 20, color: '#A0522D' },
            { x: 520, y: 320, width: 120, height: 20, color: '#A0522D' },
            { x: 300, y: 250, width: 100, height: 20, color: '#A0522D' },
            { x: 100, y: 180, width: 120, height: 20, color: '#A0522D' },
            { x: 500, y: 150, width: 150, height: 20, color: '#A0522D' },
            { x: 680, y: 100, width: 100, height: 20, color: '#A0522D' }
        ],
        tshirts: [
            { x: 200, y: 410, width: 25, height: 25, collected: false, color: '#FF1744' },
            { x: 400, y: 340, width: 25, height: 25, collected: false, color: '#2196F3' },
            { x: 570, y: 280, width: 25, height: 25, collected: false, color: '#4CAF50' },
            { x: 350, y: 210, width: 25, height: 25, collected: false, color: '#FF9800' },
            { x: 150, y: 140, width: 25, height: 25, collected: false, color: '#9C27B0' },
            { x: 550, y: 110, width: 25, height: 25, collected: false, color: '#FFEB3B' },
            { x: 450, y: 500, width: 25, height: 25, collected: false, color: '#00BCD4' },
            { x: 700, y: 500, width: 25, height: 25, collected: false, color: '#E91E63' },
            { x: 710, y: 60, width: 25, height: 25, collected: false, color: '#FF5722' }
        ],
        goal: { x: 720, y: 80, width: 40, height: 70, reached: false }
    },
    // Level 2 - More challenging with wider gaps
    {
        playerStart: { x: 50, y: 500 },
        platforms: [
            { x: 0, y: 550, width: 200, height: 50, color: '#8B4513' }, // Ground (shorter)
            { x: 600, y: 550, width: 200, height: 50, color: '#8B4513' }, // Ground right
            { x: 250, y: 480, width: 80, height: 20, color: '#A0522D' },
            { x: 450, y: 420, width: 100, height: 20, color: '#A0522D' },
            { x: 100, y: 360, width: 90, height: 20, color: '#A0522D' },
            { x: 600, y: 340, width: 120, height: 20, color: '#A0522D' },
            { x: 300, y: 280, width: 80, height: 20, color: '#A0522D' },
            { x: 500, y: 220, width: 100, height: 20, color: '#A0522D' },
            { x: 150, y: 160, width: 90, height: 20, color: '#A0522D' },
            { x: 350, y: 120, width: 120, height: 20, color: '#A0522D' },
            { x: 650, y: 80, width: 130, height: 20, color: '#A0522D' }
        ],
        tshirts: [
            { x: 100, y: 510, width: 25, height: 25, collected: false, color: '#FF1744' },
            { x: 280, y: 440, width: 25, height: 25, collected: false, color: '#2196F3' },
            { x: 480, y: 380, width: 25, height: 25, collected: false, color: '#4CAF50' },
            { x: 130, y: 320, width: 25, height: 25, collected: false, color: '#FF9800' },
            { x: 640, y: 300, width: 25, height: 25, collected: false, color: '#9C27B0' },
            { x: 320, y: 240, width: 25, height: 25, collected: false, color: '#FFEB3B' },
            { x: 530, y: 180, width: 25, height: 25, collected: false, color: '#00BCD4' },
            { x: 180, y: 120, width: 25, height: 25, collected: false, color: '#E91E63' },
            { x: 380, y: 80, width: 25, height: 25, collected: false, color: '#FF5722' },
            { x: 700, y: 40, width: 25, height: 25, collected: false, color: '#CDDC39' }
        ],
        goal: { x: 690, y: 30, width: 40, height: 70, reached: false }
    },
    // Level 3 - Most challenging with complex platforming
    {
        playerStart: { x: 50, y: 500 },
        platforms: [
            { x: 0, y: 550, width: 150, height: 50, color: '#8B4513' }, // Ground left
            { x: 650, y: 550, width: 150, height: 50, color: '#8B4513' }, // Ground right
            { x: 300, y: 550, width: 100, height: 50, color: '#8B4513' }, // Ground middle
            { x: 80, y: 470, width: 70, height: 20, color: '#A0522D' },
            { x: 220, y: 470, width: 70, height: 20, color: '#A0522D' },
            { x: 550, y: 470, width: 70, height: 20, color: '#A0522D' },
            { x: 400, y: 400, width: 90, height: 20, color: '#A0522D' },
            { x: 150, y: 360, width: 80, height: 20, color: '#A0522D' },
            { x: 600, y: 360, width: 100, height: 20, color: '#A0522D' },
            { x: 350, y: 290, width: 70, height: 20, color: '#A0522D' },
            { x: 50, y: 250, width: 90, height: 20, color: '#A0522D' },
            { x: 500, y: 240, width: 80, height: 20, color: '#A0522D' },
            { x: 250, y: 180, width: 100, height: 20, color: '#A0522D' },
            { x: 600, y: 150, width: 90, height: 20, color: '#A0522D' },
            { x: 100, y: 110, width: 80, height: 20, color: '#A0522D' },
            { x: 400, y: 80, width: 120, height: 20, color: '#A0522D' },
            { x: 680, y: 50, width: 100, height: 20, color: '#A0522D' }
        ],
        tshirts: [
            { x: 100, y: 510, width: 25, height: 25, collected: false, color: '#FF1744' },
            { x: 110, y: 430, width: 25, height: 25, collected: false, color: '#2196F3' },
            { x: 250, y: 430, width: 25, height: 25, collected: false, color: '#4CAF50' },
            { x: 430, y: 360, width: 25, height: 25, collected: false, color: '#FF9800' },
            { x: 180, y: 320, width: 25, height: 25, collected: false, color: '#9C27B0' },
            { x: 640, y: 320, width: 25, height: 25, collected: false, color: '#FFEB3B' },
            { x: 380, y: 250, width: 25, height: 25, collected: false, color: '#00BCD4' },
            { x: 80, y: 210, width: 25, height: 25, collected: false, color: '#E91E63' },
            { x: 530, y: 200, width: 25, height: 25, collected: false, color: '#FF5722' },
            { x: 280, y: 140, width: 25, height: 25, collected: false, color: '#CDDC39' },
            { x: 630, y: 110, width: 25, height: 25, collected: false, color: '#3F51B5' },
            { x: 720, y: 10, width: 25, height: 25, collected: false, color: '#F44336' }
        ],
        goal: { x: 720, y: 5, width: 40, height: 70, reached: false }
    }
];

// Current level data (will be loaded from levels array)
let platforms = [];
let tshirts = [];
let goal = {};

// Load a level
function loadLevel(levelIndex) {
    const level = levels[levelIndex];

    // Deep copy level data to avoid modifying the original
    platforms = JSON.parse(JSON.stringify(level.platforms));
    tshirts = JSON.parse(JSON.stringify(level.tshirts));
    goal = JSON.parse(JSON.stringify(level.goal));

    // Reset player position
    player.x = level.playerStart.x;
    player.y = level.playerStart.y;
    player.velocityX = 0;
    player.velocityY = 0;
    player.onGround = false;

    // Update UI to show current level
    updateLevelUI();
}

function updateLevelUI() {
    const levelDisplay = document.getElementById('currentLevel');
    if (levelDisplay) {
        levelDisplay.textContent = game.currentLevel + 1;
    }
}

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

// Next level button
document.getElementById('nextLevelBtn').addEventListener('click', () => {
    nextLevel();
});

function startGame() {
    game.started = true;
    document.getElementById('instructions').style.display = 'none';
}

function nextLevel() {
    game.currentLevel++;
    loadLevel(game.currentLevel);
    game.over = false;
    goal.reached = false;
    document.getElementById('gameOver').classList.add('hidden');
}

// Update player size based on t-shirts collected
function updatePlayerSize() {
    // Character no longer grows - just update the UI to show t-shirt count
    // Speed and jump power remain constant

    // Update UI
    document.getElementById('playerSize').textContent = player.tshirts + ' 👕';
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
    const headSize = player.width * 0.6;
    const headY = player.y;
    const bodyY = player.y + headSize;
    const bodyWidth = player.width * 0.5;
    const bodyHeight = player.height * 0.4;
    const legHeight = player.height * 0.35;

    // Legs
    ctx.fillStyle = '#4169E1'; // Blue pants
    const legWidth = bodyWidth * 0.4;
    // Left leg
    ctx.fillRect(
        centerX - bodyWidth * 0.35,
        bodyY + bodyHeight,
        legWidth,
        legHeight
    );
    // Right leg
    ctx.fillRect(
        centerX + bodyWidth * 0.05,
        bodyY + bodyHeight,
        legWidth,
        legHeight
    );

    // Shoes
    ctx.fillStyle = '#654321';
    ctx.fillRect(
        centerX - bodyWidth * 0.35,
        bodyY + bodyHeight + legHeight - player.height * 0.08,
        legWidth,
        player.height * 0.08
    );
    ctx.fillRect(
        centerX + bodyWidth * 0.05,
        bodyY + bodyHeight + legHeight - player.height * 0.08,
        legWidth,
        player.height * 0.08
    );

    // Body (torso) - will be covered by t-shirts
    ctx.fillStyle = '#FFE4C4'; // Skin tone
    ctx.fillRect(
        centerX - bodyWidth / 2,
        bodyY,
        bodyWidth,
        bodyHeight
    );

    // Draw collected t-shirts on torso (layered/stacked effect)
    const collectedTshirts = tshirts.filter(t => t.collected);
    if (collectedTshirts.length > 0) {
        // Draw the most recent t-shirt on top
        const topTshirt = collectedTshirts[collectedTshirts.length - 1];
        ctx.fillStyle = topTshirt.color;

        // T-shirt body
        ctx.fillRect(
            centerX - bodyWidth / 2,
            bodyY,
            bodyWidth,
            bodyHeight
        );

        // T-shirt sleeves
        ctx.fillRect(
            centerX - bodyWidth * 0.75,
            bodyY,
            bodyWidth * 0.25,
            bodyHeight * 0.4
        );
        ctx.fillRect(
            centerX + bodyWidth * 0.5,
            bodyY,
            bodyWidth * 0.25,
            bodyHeight * 0.4
        );

        // Show stacked t-shirts effect with stripes
        collectedTshirts.forEach((tshirt, index) => {
            if (index < collectedTshirts.length - 1) {
                const stripeY = bodyY + bodyHeight - (index + 1) * (bodyHeight * 0.15);
                ctx.fillStyle = tshirt.color;
                ctx.fillRect(
                    centerX - bodyWidth / 2,
                    stripeY,
                    bodyWidth,
                    bodyHeight * 0.1
                );
            }
        });
    }

    // Arms
    ctx.fillStyle = '#FFE4C4'; // Skin tone
    const armWidth = player.width * 0.15;
    const armHeight = bodyHeight * 0.8;
    // Left arm
    ctx.fillRect(
        centerX - bodyWidth / 2 - armWidth,
        bodyY + bodyHeight * 0.1,
        armWidth,
        armHeight
    );
    // Right arm
    ctx.fillRect(
        centerX + bodyWidth / 2,
        bodyY + bodyHeight * 0.1,
        armWidth,
        armHeight
    );

    // Head
    ctx.fillStyle = '#FFE4C4'; // Skin tone
    ctx.fillRect(
        centerX - headSize / 2,
        headY,
        headSize,
        headSize
    );

    // Hair
    ctx.fillStyle = '#8B4513'; // Brown hair
    ctx.fillRect(
        centerX - headSize / 2,
        headY,
        headSize,
        headSize * 0.3
    );

    // Eyes
    ctx.fillStyle = '#000';
    const eyeSize = headSize * 0.15;
    ctx.fillRect(
        centerX - headSize * 0.25,
        headY + headSize * 0.4,
        eyeSize,
        eyeSize
    );
    ctx.fillRect(
        centerX + headSize * 0.1,
        headY + headSize * 0.4,
        eyeSize,
        eyeSize
    );

    // Smile
    ctx.strokeStyle = '#000';
    ctx.lineWidth = Math.max(1, player.width * 0.05);
    ctx.beginPath();
    ctx.arc(
        centerX,
        headY + headSize * 0.6,
        headSize * 0.25,
        0,
        Math.PI
    );
    ctx.stroke();

    // Outline for character
    ctx.strokeStyle = '#000';
    ctx.lineWidth = Math.max(1, player.width * 0.05);

    // Head outline
    ctx.strokeRect(centerX - headSize / 2, headY, headSize, headSize);

    // Body outline (if wearing t-shirt)
    if (collectedTshirts.length > 0) {
        ctx.strokeRect(centerX - bodyWidth / 2, bodyY, bodyWidth, bodyHeight);
    }
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
    const tshirtBonus = game.tshirtCount * 1000;
    game.score += tshirtBonus;

    // Check if there are more levels
    const hasMoreLevels = game.currentLevel < game.totalLevels - 1;

    // Update game over screen
    const gameOverTitle = document.getElementById('gameOverTitle');
    const restartBtn = document.getElementById('restartBtn');
    const nextLevelBtn = document.getElementById('nextLevelBtn');

    if (hasMoreLevels) {
        gameOverTitle.textContent = 'Level Complete!';
        restartBtn.style.display = 'none';
        nextLevelBtn.style.display = 'inline-block';
    } else {
        gameOverTitle.textContent = 'Game Complete!';
        restartBtn.style.display = 'inline-block';
        nextLevelBtn.style.display = 'none';
    }

    // Show game over screen
    document.getElementById('finalTshirts').textContent = game.tshirtCount;
    document.getElementById('finalSize').textContent = game.tshirtCount + ' 👕';
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('gameOver').classList.remove('hidden');
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Initialize game - load first level
loadLevel(0);

// Start the game loop
gameLoop();
