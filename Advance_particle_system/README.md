# Particle Physics Canvas Demo
A visually engaging interactive particle system built with JavaScript and HTML5 Canvas. Particles bounce around the screen, respond to gravity, friction, and elasticity, and interact with the mouse. Includes controls to toggle gravity and reset the system.

## Features
Animated Particles: 150 colorful particles with glowing effects.

Physics Simulation: Realistic gravity, friction, and elastic collisions with canvas boundaries.

Mouse Interaction: Click and drag to attract or repel nearby particles.

Responsive Design: Canvas resizes dynamically with the window.

Controls:

Toggle Gravity: Enable or disable gravity.

Reset: Reinitialize all particles.

## Demo
![Gameplay](advance_particle_sysytem.png) 

## Getting Started
1. Clone or Download
```bash
git clone https://github.com/Sasank-5716/HTML_canvas
```
```bash
cd Advance_particle_system
```

2. HTML Setup
Ensure your HTML includes the following elements:

xml
<canvas id="canvas"></canvas>
<button id="gravityBtn">Toggle Gravity</button>
<button id="resetBtn">Reset</button>
<script src="path/to/your/script.js"></script>
3. Script
Place the provided JavaScript code in script.js or directly in a <script> tag after the HTML elements.

## How It Works
Particles: Each particle has a random position, velocity, color, and radius.

Physics: Gravity pulls particles down; friction slows them over time; elasticity makes them bounce off canvas edges.

Mouse: Hold and drag on the canvas to push/pull particles within a certain radius.

Controls:

Toggle Gravity: Click to turn gravity on/off.

Reset: Click to regenerate all particles with new random properties.

## Configuration
You can adjust the simulation by editing the CONFIG object in the JavaScript:

js
const CONFIG = {
    PARTICLE_COUNT: 150,   // Number of particles
    GRAVITY: 0.25,         // Gravity force
    ELASTICITY: 0.85,      // Bounciness on collision
    FRICTION: 0.98,        // Friction (velocity loss)
    MOUSE_RADIUS: 100,     // Mouse interaction radius
    MOUSE_FORCE: 0.02      // Mouse attraction/repulsion force
};
## Customization
Colors: Particles use random HSL colors for a vibrant effect.

Glow: Each particle has a radial gradient for a glowing appearance.

Performance: You can reduce PARTICLE_COUNT for better performance on slower devices.

## Browser Compatibility
Modern browsers supporting HTML5 Canvas and ES6 JavaScript.

## Acknowledgments
Inspired by classic particle and physics simulations in JavaScript.

Enjoy experimenting with the particle system!
For questions or suggestions, open an issue or submit a pull request.

