# T-Shirt Collector Game

A Mario-like platformer game where you collect t-shirts, grow bigger, and reach the goal!

## How to Play

1. Open `index.html` in a web browser
2. Use **Arrow Keys** or **WASD** to move left and right
3. Press **Space**, **Up Arrow**, or **W** to jump
4. Collect t-shirts scattered throughout the level
5. Reach the green flag at the end to complete the level

## Game Mechanics

### Character Growth
- Each t-shirt you collect makes your character bigger and heavier
- Your character visually wears all collected t-shirts (layered effect)
- As you grow bigger:
  - Movement speed decreases (heavier = slower)
  - Jump height decreases (heavier = harder to jump)
  - Character size increases up to 2.5x the original size

### Scoring System
- **100 points** per t-shirt collected during gameplay
- **500 point bonus** per t-shirt at level completion
- **Size bonus** based on your final character size
- Final score displayed when you reach the goal

## Features

- Physics-based platformer gameplay with gravity and jumping
- 8 collectible t-shirts in different colors
- Multiple platforms to navigate
- Visual character growth system
- Real-time stats display (t-shirts, score, size)
- Level completion screen with final statistics
- Responsive controls and smooth animations

## Files

- `index.html` - Game structure and UI
- `style.css` - Styling and visual design
- `game.js` - Game logic, physics, and mechanics

## Technical Details

- Built with vanilla JavaScript and HTML5 Canvas
- No external dependencies required
- Runs entirely in the browser
- 800x600 game resolution

Enjoy collecting those t-shirts!
