# 🎮 Platformer Game
A simple 2D platformer game built with HTML5 Canvas and JavaScript. Control a red square 🟥 that jumps across platforms 🟩 to reach the red flag 🚩 and progress through 10 increasingly challenging levels! 🌟

# ✨ Features
🎯 Smooth player movement with left/right controls and jumping

🌍 Gravity and friction physics for natural movement

🏗️ Multiple levels with increasing difficulty and platform complexity

🚩 Start and end flags marking level boundaries

🎥 Camera that follows the player horizontally

⚠️ Game over when the player falls off platforms to the ground

🔢 Level indicator showing the current level number

🔄 Automatic level reset on game over and progression on level completion

# 🎮 Controls
Action	Keys	Emoji
Move Left	Left Arrow / A	⬅️
Move Right	Right Arrow / D	➡️
Jump	Up Arrow / W / Space	⬆️

# 🚀 How to Run
## Download or clone the repository. 📥
Clone
```bash
git clone https://github.com/Sasank-5716/HTML_canvas
```
```bash
cd Mario_clone
```

## Run the game
Run mario_platformer.html file

⚙️ Customization
Adjust gameplay constants in game.js like:

GRAVITY 🌌

PLAYER_SPEED 🏃‍♂️

JUMP_POWER 🦘

Modify generateLevel() to change platform layout and difficulty.

Extend the game with new features like enemies 👾, collectibles 💎, or sound effects 🎵.

🐞 Known Issues & Fixes
The final platform is raised slightly above ground level to prevent unintended game overs. 🛠️

Collision detection includes a small tolerance to improve landing accuracy. 🎯
