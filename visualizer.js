// Windows Media Player - Ambient/Energy Bliss Style Visualizer
// Liquid, glowing, organic blobs - peak Frutiger Aero

class AmbientVisualizer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.blobs = [];
        this.time = 0;
        this.isRunning = false;
        this.colorSchemes = [
            // Energy Bliss - warm oranges and yellows
            { primary: '#ff6b35', secondary: '#f7c59f', accent: '#efefef', bg: '#1a0a00' },
            // Ambient Blue - cool blues and cyans
            { primary: '#00d4ff', secondary: '#7b2ff7', accent: '#f0f0f0', bg: '#000a14' },
            // Aurora - greens and purples
            { primary: '#00ff88', secondary: '#ff00ff', accent: '#ffffff', bg: '#0a0014' },
            // Sunset - pinks and oranges
            { primary: '#ff6ec7', secondary: '#ffa500', accent: '#fff5e6', bg: '#140008' },
        ];
        this.currentScheme = 0;
        this.colors = this.colorSchemes[0];

        this.resize();
        this.initBlobs();
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width || 600;
        this.canvas.height = rect.height || 400;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }

    initBlobs() {
        this.blobs = [];
        const numBlobs = 6 + Math.floor(Math.random() * 4);

        for (let i = 0; i < numBlobs; i++) {
            this.blobs.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                baseRadius: 40 + Math.random() * 80,
                radius: 0,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                phase: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                color: Math.random() > 0.5 ? 'primary' : 'secondary'
            });
        }
    }

    cycleColors() {
        this.currentScheme = (this.currentScheme + 1) % this.colorSchemes.length;
        this.colors = this.colorSchemes[this.currentScheme];
    }

    update() {
        this.time += 0.016;

        for (const blob of this.blobs) {
            // Organic movement
            blob.x += blob.vx + Math.sin(this.time * 0.5 + blob.phase) * 0.5;
            blob.y += blob.vy + Math.cos(this.time * 0.4 + blob.phase) * 0.5;

            // Pulsing radius
            blob.radius = blob.baseRadius + Math.sin(this.time * blob.pulseSpeed * 60 + blob.phase) * 20;

            // Bounce off edges with soft transition
            if (blob.x < blob.radius) {
                blob.x = blob.radius;
                blob.vx *= -0.8;
            }
            if (blob.x > this.width - blob.radius) {
                blob.x = this.width - blob.radius;
                blob.vx *= -0.8;
            }
            if (blob.y < blob.radius) {
                blob.y = blob.radius;
                blob.vy *= -0.8;
            }
            if (blob.y > this.height - blob.radius) {
                blob.y = this.height - blob.radius;
                blob.vy *= -0.8;
            }
        }
    }

    drawMetaballs() {
        // Create offscreen canvas for metaball effect
        const offCanvas = document.createElement('canvas');
        offCanvas.width = this.width;
        offCanvas.height = this.height;
        const offCtx = offCanvas.getContext('2d');

        // Draw blob fields
        for (const blob of this.blobs) {
            const gradient = offCtx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.radius * 1.5
            );

            const color = this.colors[blob.color];
            gradient.addColorStop(0, color);
            gradient.addColorStop(0.4, color + 'cc');
            gradient.addColorStop(0.7, color + '66');
            gradient.addColorStop(1, 'transparent');

            offCtx.fillStyle = gradient;
            offCtx.beginPath();
            offCtx.arc(blob.x, blob.y, blob.radius * 1.5, 0, Math.PI * 2);
            offCtx.fill();
        }

        return offCanvas;
    }

    drawGlow() {
        // Draw glowing orbs
        for (const blob of this.blobs) {
            const color = this.colors[blob.color];

            // Outer glow
            const glowGradient = this.ctx.createRadialGradient(
                blob.x, blob.y, blob.radius * 0.3,
                blob.x, blob.y, blob.radius * 2
            );
            glowGradient.addColorStop(0, color + '40');
            glowGradient.addColorStop(0.5, color + '20');
            glowGradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = glowGradient;
            this.ctx.beginPath();
            this.ctx.arc(blob.x, blob.y, blob.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawLiquidBlobs() {
        // Main liquid blob rendering
        for (const blob of this.blobs) {
            const color = this.colors[blob.color];

            // Create organic shape using multiple overlapping circles
            this.ctx.save();

            // Main blob with gradient
            const gradient = this.ctx.createRadialGradient(
                blob.x - blob.radius * 0.3, blob.y - blob.radius * 0.3, 0,
                blob.x, blob.y, blob.radius
            );
            gradient.addColorStop(0, this.colors.accent + 'cc');
            gradient.addColorStop(0.3, color);
            gradient.addColorStop(0.7, color + 'cc');
            gradient.addColorStop(1, color + '00');

            this.ctx.fillStyle = gradient;

            // Draw organic blob shape
            this.ctx.beginPath();
            const points = 8;
            for (let i = 0; i <= points; i++) {
                const angle = (i / points) * Math.PI * 2;
                const wobble = Math.sin(this.time * 2 + angle * 3 + blob.phase) * 10;
                const r = blob.radius + wobble;
                const x = blob.x + Math.cos(angle) * r;
                const y = blob.y + Math.sin(angle) * r;

                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    // Smooth curves between points
                    const prevAngle = ((i - 1) / points) * Math.PI * 2;
                    const prevWobble = Math.sin(this.time * 2 + prevAngle * 3 + blob.phase) * 10;
                    const prevR = blob.radius + prevWobble;
                    const cpX = blob.x + Math.cos((angle + prevAngle) / 2) * (r + prevR) / 2 * 1.1;
                    const cpY = blob.y + Math.sin((angle + prevAngle) / 2) * (r + prevR) / 2 * 1.1;
                    this.ctx.quadraticCurveTo(cpX, cpY, x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.fill();

            // Inner highlight
            const highlightGradient = this.ctx.createRadialGradient(
                blob.x - blob.radius * 0.4, blob.y - blob.radius * 0.4, 0,
                blob.x - blob.radius * 0.2, blob.y - blob.radius * 0.2, blob.radius * 0.6
            );
            highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
            highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
            highlightGradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = highlightGradient;
            this.ctx.beginPath();
            this.ctx.ellipse(
                blob.x - blob.radius * 0.3,
                blob.y - blob.radius * 0.3,
                blob.radius * 0.5,
                blob.radius * 0.35,
                -Math.PI / 4,
                0, Math.PI * 2
            );
            this.ctx.fill();

            this.ctx.restore();
        }
    }

    draw() {
        // Clear with background
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw glow layer
        this.drawGlow();

        // Draw liquid blobs
        this.drawLiquidBlobs();

        // Add subtle noise/grain for that authentic look
        this.addFilmGrain();
    }

    addFilmGrain() {
        const imageData = this.ctx.getImageData(0, 0, this.width, this.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * 10;
            data[i] += noise;
            data[i + 1] += noise;
            data[i + 2] += noise;
        }

        this.ctx.putImageData(imageData, 0, 0);
    }

    animate() {
        if (!this.isRunning) return;

        this.update();
        this.draw();

        requestAnimationFrame(() => this.animate());
    }

    start() {
        this.isRunning = true;
        this.animate();
    }

    stop() {
        this.isRunning = false;
    }
}

// Export for use in projects.js
window.AmbientVisualizer = AmbientVisualizer;
