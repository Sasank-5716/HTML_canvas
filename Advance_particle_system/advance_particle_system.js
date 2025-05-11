const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Configuration
const CONFIG = {
    PARTICLE_COUNT: 150,
    GRAVITY: 0.25,
    ELASTICITY: 0.85,
    FRICTION: 0.98,
    MOUSE_RADIUS: 100,
    MOUSE_FORCE: 0.02
};