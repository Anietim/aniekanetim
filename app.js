/**
 * Aniekan Etim — Asynchronous Portfolio Script Engine
 * Responsible for pulling database records and rendering grid nodes natively.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Target the projects grid wrapper element
    const projectsGrid = document.getElementById('projects-grid');
    
    // Core async runtime engine to pull database models
    async function loadPortfolioDatabase() {
        try {
            // Fetch the structural local data layer
            const response = await fetch('./data/database.json');
            
            // Check for valid response stream status
            if (!response.ok) {
                throw new Error(`HTTP network error! Configuration status: ${response.status}`);
            }
            
            const projectsData = await response.json();
            
            // Flush the loading state container clean
            projectsGrid.innerHTML = '';
            
            // Check if items array contains entries
            if (!projectsData || projectsData.length === 0) {
                projectsGrid.innerHTML = `<div class="error-state">No successful project entries found inside database.</div>`;
                return;
            }
            
            // Generate clean markup vectors iteratively
            projectsData.forEach(project => {
                const projectCard = document.createElement('article');
                projectCard.className = 'project-card';
                
                // Construct comma-separated visual design framework tags
                const tagsHTML = (project.tags || [])
                    .map(tag => `<span class="project-tag">${tag}</span>`)
                    .join('');
                
                // Map object properties straight into strict semantic nodes
                projectCard.innerHTML = `
                    <div class="card-body">
                        <span class="card-role">${project.role}</span>
                        <h3 class="card-title">${project.title}</h3>
                        <p class="card-description">${project.description}</p>
                        <div class="card-tags-wrapper">
                            ${tagsHTML}
                        </div>
                        <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="card-action-link">
                            Explore Project Interface <span>↗</span>
                        </a>
                    </div>
                `;
                
                // Append the constructed node into the viewport render pipeline
                projectsGrid.appendChild(projectCard);
            });
            
        } catch (error) {
            console.error('Portfolio System Engine Failure:', error);
            projectsGrid.innerHTML = `
                <div class="error-state">
                    <p>Failed to mount dynamic project grid database references.</p>
                    <small>Verify localhost path mapping or local database file schema context.</small>
                </div>
            `;
        }
    }

    // Initialize execution pipeline
    loadPortfolioDatabase();
});

/* ==========================================================================
   High-Fidelity Interactive Vector Particle Background Engine
   ========================================================================== */

(() => {
    const canvas = document.getElementById('hero-particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    const numberOfParticles = 45; // Lean density matrix preventing viewport noise
    
    // Dynamic mouse vector node mapping
    const mouseVector = {
        x: null,
        y: null,
        radius: 130 // Interactive pull threshold metric
    };

    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouseVector.x = event.clientX - rect.left;
        mouseVector.y = event.clientY - rect.top;
    });

    document.documentElement.addEventListener('mouseleave', () => {
        mouseVector.x = null;
        mouseVector.y = null;
    });

    // Handle high-precision display pixel scales and viewport resets
    function resizeCanvasMatrix() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        initializeParticleArray();
    }

    class ParticleNode {
        constructor(width, height) {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4; // Controlled structural layout speeds
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 1.5 + 1; // Subtle geometric micro dots
        }

        update(width, height) {
            this.x += this.vx;
            this.y += this.vy;

            // Strict boundary constraint collision checks
            if (this.x < 0 || this.x > width) this.vx = -this.vx;
            if (this.y < 0 || this.y > height) this.vy = -this.vy;

            // Interactive mouse coordinate tracking magnetics
            if (mouseVector.x !== null && mouseVector.y !== null) {
                let dx = this.x - mouseVector.x;
                let dy = this.y - mouseVector.y;
                let distance = Math.hypot(dx, dy);

                if (distance < mouseVector.radius) {
                    // Smooth visual pull scaling calculation rules
                    let force = (mouseVector.radius - distance) / mouseVector.radius;
                    this.x += (dx / distance) * force * 0.8;
                    this.y += (dy / distance) * force * 0.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(167, 139, 250, 0.4)'; // Premium light violet hue tracking
            ctx.fill();
        }
    }

    function initializeParticleArray() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new ParticleNode(canvas.width, canvas.height));
        }
    }

    function renderConnectionWebs() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.hypot(dx, dy);

                // Connect adjacent spatial vectors if within line-link thresholds
                if (distance < 100) {
                    let opacity = (100 - distance) / 100 * 0.06; // Highly muted aesthetic paths
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // High performance frame rendering loop sequence execution
    function runtimeFrameTick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particlesArray.forEach(particle => {
            particle.update(canvas.width, canvas.height);
            particle.draw();
        });

        renderConnectionWebs();
        requestAnimationFrame(runtimeFrameTick);
    }

    // Set layout handlers and fire setup pipeline execution
    window.addEventListener('resize', resizeCanvasMatrix);
    resizeCanvasMatrix();
    requestAnimationFrame(runtimeFrameTick);
})();