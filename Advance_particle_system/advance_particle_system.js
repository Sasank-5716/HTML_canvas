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

// State
let particles = [];
let mouse = { x: null, y: null, pressed: false };

// Canvas setup
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();

// Particle class
class Particle {
    constructor() {
        this.radius = Math.random() * 4 + 2;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;
        this.baseColor = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }
    update() {
        // Mouse interaction
        if (mouse.pressed) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CONFIG.MOUSE_RADIUS) {
                const angle = Math.atan2(dy, dx);
                const force = (CONFIG.MOUSE_RADIUS - distance) * CONFIG.MOUSE_FORCE;
                this.vx += Math.cos(angle) * force;
                this.vy += Math.sin(angle) * force;
            }
        }
        // Physics
        this.vy += CONFIG.GRAVITY;
        this.vx *= CONFIG.FRICTION;
        this.vy *= CONFIG.FRICTION;
        
        // Movement
        this.x += this.vx;
        this.y += this.vy;

        // Collision with walls
        this.handleBoundaries();
    }

    handleBoundaries() {
        if (this.x < this.radius) {
            this.x = this.radius;
            this.vx *= -CONFIG.ELASTICITY;
        }
        if (this.x > canvas.width - this.radius) {
            this.x = canvas.width - this.radius;
            this.vx *= -CONFIG.ELASTICITY;
        }
        if (this.y < this.radius) {
            this.y = this.radius;
            this.vy *= -CONFIG.ELASTICITY;
        }
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.vy *= -CONFIG.ELASTICITY;
        }
    }
    draw() {
        // Velocity-based color
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0, 
            this.x, this.y, this.radius * 2
        );
        gradient.addColorStop(0, this.baseColor);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}