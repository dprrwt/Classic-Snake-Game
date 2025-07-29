# Snake Game

A classic Snake game built with Next.js and React, featuring responsive design and touch controls for mobile devices.

## Features

- **Classic Gameplay**: Navigate the snake to eat food and grow longer
- **Responsive Design**: Automatically adjusts to different screen sizes
- **Mobile Support**: Touch controls with swipe gestures and on-screen buttons
- **Score Tracking**: Keep track of your score as you collect food
- **Grid-based Movement**: Traditional Snake game mechanics on a 20x20 grid
- **Collision Detection**: Game ends when hitting walls or the snake itself

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd snake-game
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Play

### Desktop Controls
- Use **Arrow Keys** to control the snake:
  - ↑ Arrow Up: Move up
  - ↓ Arrow Down: Move down  
  - ← Arrow Left: Move left
  - → Arrow Right: Move right

### Mobile Controls
- **Swipe gestures** on the game canvas
- **On-screen buttons** for precise control

### Game Rules
1. Click "Start Game" to begin
2. Guide the snake to the red food squares
3. Each food eaten increases your score by 10 points
4. The snake grows longer with each food consumed
5. Avoid hitting the walls or your own tail
6. Try to achieve the highest score possible!

## Game Configuration

Key game parameters (found in `app/components/SnakeGame.js`):
- `GRID_SIZE`: 20x20 grid
- `GAME_SPEED`: 100ms between moves
- `INITIAL_SNAKE`: Starting position at center (10, 10)
- `INITIAL_FOOD`: First food position at (15, 15)

## Technologies Used

- **Next.js 15.4.4**: React framework for production
- **React 19.1.1**: UI library
- **React Hooks**: State management and effects
- **HTML5 Canvas**: Game rendering
- **Responsive Design**: Adaptive layout for all devices

## Project Structure

```
snake-game/
├── app/
│   ├── components/
│   │   └── SnakeGame.js    # Main game component
│   ├── layout.js           # App layout
│   └── page.js             # Home page
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server

### Customization

You can modify game parameters in `SnakeGame.js`:
- Change `GRID_SIZE` for a larger/smaller playing field
- Adjust `GAME_SPEED` for faster/slower gameplay
- Modify colors and styling in the canvas drawing section

## License

ISC License

## Contributing

Feel free to submit issues and enhancement requests!

## Future Enhancements

- [ ] High score persistence
- [ ] Difficulty levels
- [ ] Sound effects
- [ ] Multiplayer mode
- [ ] Different game themes
- [ ] Power-ups and obstacles

