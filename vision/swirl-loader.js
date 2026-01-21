(function(global) {
    class SwirlLoader {
        constructor(container, options = {}) {
            this.container = typeof container === 'string' ? document.querySelector(container) : container;
            if (!this.container) {
                console.error("SwirlLoader: Container not found");
                return;
            }

            // Default Configuration
            this.config = {
                text: options.text || "Loading",
                fontSize: options.fontSize || 100,
                fontFamily: options.fontFamily || "Verdana, sans-serif",
                textColor: options.textColor || "#00ffcc",
                bgColor: options.bgColor || "#050505",
                
                particleCount: options.particleCount || 1000,
                charSet: options.charSet || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                particleSize: options.particleSize || 12,
                
                holdDuration: options.holdDuration || 1500,
                chaosSpeed: options.chaosSpeed || 3,
                ease: options.ease || 0.08,
                
                attractionRadius: options.attractionRadius || 100,
                mouseForce: options.mouseForce || 5
            };

            // Internal State
            this.width = 0;
            this.height = 0;
            this.particles = [];
            this.textPoints = [];
            this.animationState = 'chaos'; // chaos, assembling, holding, dispersing
            this.stateStartTime = Date.now();
            this.animationFrameId = null;
            this.isRunning = false;
            this.mouse = { x: null, y: null };

            // Setup
            this.initCanvas();
            this.bindEvents();
        }

        initCanvas() {
            // Create canvas
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Apply styles
            this.canvas.style.display = 'block';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            
            // Ensure container is relative so canvas can fill it
            if (getComputedStyle(this.container).position === 'static') {
                this.container.style.position = 'relative';
            }
            
            // Clear container and append canvas
            this.container.innerHTML = '';
            this.container.style.backgroundColor = this.config.bgColor;
            this.container.appendChild(this.canvas);
            
            // Initial resize
            this.resize();
        }

        bindEvents() {
            this.resizeHandler = this.resize.bind(this);
            window.addEventListener('resize', this.resizeHandler);

            this.mouseMoveHandler = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            };
            this.canvas.addEventListener('mousemove', this.mouseMoveHandler);

            this.mouseLeaveHandler = () => {
                this.mouse.x = null;
                this.mouse.y = null;
            };
            this.canvas.addEventListener('mouseleave', this.mouseLeaveHandler);
        }

        resize() {
            if (!this.container) return;
            this.width = this.container.clientWidth;
            this.height = this.container.clientHeight;
            
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            
            // Recalculate text points if running
            if (this.isRunning) {
                this.calculateTextPoints();
            }
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            
            // Initialize particles if empty
            if (this.particles.length === 0) {
                this.initParticles();
            }
            
            this.stateStartTime = Date.now();
            this.animationState = 'chaos';
            this.calculateTextPoints();
            
            this.animate();
        }

        stop() {
            this.isRunning = false;
            cancelAnimationFrame(this.animationFrameId);
        }

        destroy() {
            this.stop();
            window.removeEventListener('resize', this.resizeHandler);
            if (this.canvas) {
                this.canvas.removeEventListener('mousemove', this.mouseMoveHandler);
                this.canvas.removeEventListener('mouseleave', this.mouseLeaveHandler);
                this.canvas.remove();
            }
            this.container = null;
        }

        updateConfig(newOptions) {
            Object.assign(this.config, newOptions);
            
            if (newOptions.particleCount) {
                this.initParticles();
            }
            if (newOptions.text || newOptions.fontSize || newOptions.fontFamily) {
                this.calculateTextPoints();
            }
            if (newOptions.bgColor && this.container) {
                this.container.style.backgroundColor = this.config.bgColor;
            }
            
            // Force reset storage
            this.stateStartTime = Date.now();
            this.animationState = 'chaos';
        }

        initParticles() {
            this.particles = [];
            for (let i = 0; i < this.config.particleCount; i++) {
                this.particles.push(new Particle(this.width, this.height, this.config));
            }
        }

        calculateTextPoints() {
            if (!this.width || !this.height) return;

            const offCanvas = document.createElement('canvas');
            offCanvas.width = this.width;
            offCanvas.height = this.height;
            const offCtx = offCanvas.getContext('2d');

            offCtx.font = `bold ${this.config.fontSize}px ${this.config.fontFamily}`;
            offCtx.textAlign = 'center';
            offCtx.textBaseline = 'middle';
            offCtx.fillStyle = '#fff';
            offCtx.fillText(this.config.text, this.width / 2, this.height / 2);

            const density = 5; 
            const imageData = offCtx.getImageData(0, 0, this.width, this.height).data;
            
            this.textPoints = [];
            for (let y = 0; y < this.height; y += density) {
                for (let x = 0; x < this.width; x += density) {
                    const index = (y * this.width + x) * 4;
                    if (imageData[index + 3] > 128) {
                        this.textPoints.push({x, y});
                    }
                }
            }
        }

        assignParticlesToTargets() {
            const availableParticles = [...this.particles].sort(() => Math.random() - 0.5);
            this.particles.forEach(p => p.active = false);

            for (let i = 0; i < this.textPoints.length; i++) {
                if (i < availableParticles.length) {
                    const p = availableParticles[i];
                    p.tx = this.textPoints[i].x;
                    p.ty = this.textPoints[i].y;
                    p.active = true;
                } else {
                    break;
                }
            }
        }

        explodeParticles() {
            this.particles.forEach(p => {
                 const dx = p.x - this.width/2;
                 const dy = p.y - this.height/2;
                 const dist = Math.sqrt(dx*dx + dy*dy) + 0.1;
                 
                 p.vx = (dx / dist) * (Math.random() * 10 + 5);
                 p.vy = (dy / dist) * (Math.random() * 10 + 5);
                 p.active = false;
            });
        }

        animate() {
            if (!this.isRunning) return;

            this.ctx.clearRect(0, 0, this.width, this.height);
            
            const now = Date.now();
            const elapsed = now - this.stateStartTime;

            switch (this.animationState) {
                case 'chaos':
                    if (elapsed > 1500) {
                        this.animationState = 'assembling';
                        this.stateStartTime = now;
                        this.assignParticlesToTargets();
                    }
                    break;
                    
                case 'assembling':
                    if (elapsed > 2000) { 
                        this.animationState = 'holding';
                        this.stateStartTime = now;
                    }
                    break;

                case 'holding':
                    if (elapsed > this.config.holdDuration) {
                        this.animationState = 'dispersing';
                        this.stateStartTime = now;
                        this.explodeParticles();
                    }
                    break;

                case 'dispersing':
                    if (elapsed > 1000) {
                        this.animationState = 'chaos';
                        this.stateStartTime = now;
                    }
                    break;
            }

            this.particles.forEach(p => {
                p.update(this.mouse, this.width, this.height, this.animationState, this.config);
                p.draw(this.ctx, this.config);
            });

            this.animationFrameId = requestAnimationFrame(() => this.animate());
        }
    }

    class Particle {
        constructor(width, height, config) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.chaosSpeed;
            this.vy = (Math.random() - 0.5) * config.chaosSpeed;
            this.char = config.charSet[Math.floor(Math.random() * config.charSet.length)];
            this.tx = null;
            this.ty = null;
            this.active = false;
        }

        update(mouse, width, height, animationState, config) {
            if (animationState === 'chaos' || animationState === 'dispersing') {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
                
                this.vx += (Math.random() - 0.5) * 0.2;
                this.vy += (Math.random() - 0.5) * 0.2;
                
                const speed = Math.sqrt(this.vx*this.vx + this.vy*this.vy);
                if (speed > config.chaosSpeed) {
                    this.vx = (this.vx / speed) * config.chaosSpeed;
                    this.vy = (this.vy / speed) * config.chaosSpeed;
                }
            } 
            else if ((animationState === 'assembling' || animationState === 'holding') && this.active) {
                const dx = this.tx - this.x;
                const dy = this.ty - this.y;
                
                this.x += dx * config.ease;
                this.y += dy * config.ease;
                
                if (animationState === 'holding') {
                    this.x += (Math.random() - 0.5) * 0.5;
                    this.y += (Math.random() - 0.5) * 0.5;
                }
            }
            else {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                
                if (dist < config.attractionRadius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (config.attractionRadius - dist) / config.attractionRadius;
                    const pushX = Math.cos(angle) * force * config.mouseForce;
                    const pushY = Math.sin(angle) * force * config.mouseForce;
                    
                    this.x += pushX;
                    this.y += pushY;
                }
            }
        }

        draw(ctx, config) {
            ctx.fillStyle = this.active ? config.textColor : `rgba(255, 255, 255, 0.3)`;
            ctx.font = `${config.particleSize}px monospace`;
            ctx.fillText(this.char, this.x, this.y);
        }
    }

    global.SwirlLoader = SwirlLoader;

})(window);
