# Interactive 3D Game 🎮

A simple interactive 3D game built with Three.js that runs in the browser.

## Features

- **3D Scene**: Complete 3D environment with lighting and shadows
- **Player Control**: Control a cube character using keyboard inputs
- **Collision Detection**: The player cannot walk through obstacles
- **Physics**: Gravity and jumping mechanics
- **Collectibles**: Collect golden coins to increase your score
- **Camera Follow**: The camera smoothly follows the player

## Controls

| Key | Action |
|-----|--------|
| W / ↑ | Move Forward |
| S / ↓ | Move Backward |
| A / ← | Move Left |
| D / → | Move Right |
| SPACE | Jump |

## How to Run

### Option 1: Using npm
```bash
npm install
npm start
```
Then open http://localhost:3000 in your browser.

### Option 2: Using any HTTP server
You can use any static file server to serve the files:
```bash
# Using Python
python -m http.server 8000

# Using PHP
php -S localhost:8000
```

### Option 3: Open directly
Simply open `index.html` in a modern browser (Chrome, Firefox, Edge recommended).

## Technology

- **Three.js**: 3D graphics library
- **WebGL**: Hardware-accelerated graphics
- **ES Modules**: Modern JavaScript module system

## Game Elements

- 🔴 **Player**: Red cube with eyes that you control
- 🟤 **Obstacles**: Brown boxes that block movement
- 🪙 **Coins**: Golden rotating coins to collect
- 🟢 **Ground**: Green platform with grid overlay

## License

MIT
