// Particle class for managing individual particles
class Particle {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.size = random(3, 8);
        this.alpha = random(100, 200);
        this.maxSpeed = 2;
        this.originalAlpha = this.alpha;
    }

    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        // Add mouse interaction
        let mouse = createVector(mouseX, mouseY);
        let dir = p5.Vector.sub(mouse, this.pos);
        let distance = dir.mag();

        // Particles are attracted to mouse position
        if (distance < 200) {
            dir.normalize();
            let force = map(distance, 0, 200, 0.5, 0);
            dir.mult(force);
            this.applyForce(dir);
        }

        // Update motion
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);

        // Bounce off edges
        if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
    }

    draw(primaryColor, secondaryColor) {
        // Create gradient effect between primary and secondary colors
        let distance = this.pos.y / height;
        let c1 = color(primaryColor);
        let c2 = color(secondaryColor);
        let particleColor = lerpColor(c1, c2, distance);
        
        // Draw particle
        noStroke();
        particleColor.setAlpha(this.alpha);
        fill(particleColor);
        circle(this.pos.x, this.pos.y, this.size);
    }
}

// Global variables
let particles = [];
let primaryColor, secondaryColor;
let canvas;

// Setup p5.js
function setup() {
    // Create canvas inside the p5-container
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('p5-container');

    // Initialize colors with default theme
    updateColors();

    // Create particles
    const particleCount = Math.floor((width * height) / 10000); // Adjust density based on screen size
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(random(width), random(height)));
    }
}

// Draw loop
function draw() {
    clear(); // Use clear instead of background for transparency
    
    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw(primaryColor, secondaryColor);
    });
}

// Update colors based on team selection
function updateColors() {
    const root = document.documentElement;
    primaryColor = getComputedStyle(root).getPropertyValue('--primary-color').trim();
    secondaryColor = getComputedStyle(root).getPropertyValue('--secondary-color').trim();
}

// Handle window resize
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    
    // Adjust particle count for new window size
    const targetCount = Math.floor((width * height) / 10000);
    if (targetCount > particles.length) {
        // Add more particles
        for (let i = particles.length; i < targetCount; i++) {
            particles.push(new Particle(random(width), random(height)));
        }
    } else if (targetCount < particles.length) {
        // Remove excess particles
        particles.splice(targetCount);
    }
}

// Listen for team changes
document.addEventListener('DOMContentLoaded', () => {
    const teamSelect = document.getElementById('team-select');
    teamSelect.addEventListener('change', () => {
        // Add slight delay to match the theme transition
        setTimeout(updateColors, 150);
    });
});
