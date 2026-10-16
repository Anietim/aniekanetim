/**
 * BACKGROUND MOTION SYSTEM
 * Interactive Fluid Aurora & Celestial Orb Motion Canvas
 * High-performance 60fps render loop with pointer interaction & depth
 */

(function () {
  'use strict';

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, dpr;
  let isMotionActive = true;
  let animationFrameId = null;

  // Respect system reduced-motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    isMotionActive = false;
  }

  // Pointer position tracking with smoothing
  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    radius: 280,
    active: false,
    speed: 0
  };

  // 1. Dynamic Aurora Gradient Orbs Configuration
  const orbs = [
    {
      x: 0.25,
      y: 0.3,
      baseRadius: 380,
      radius: 380,
      vx: 0.0006,
      vy: 0.0004,
      phase: 0,
      color: 'rgba(37, 72, 196, 0.42)', // Electric Royal Blue
      accent: 'rgba(61, 110, 255, 0.28)'
    },
    {
      x: 0.75,
      y: 0.4,
      baseRadius: 460,
      radius: 460,
      vx: -0.0005,
      vy: 0.0007,
      phase: Math.PI / 3,
      color: 'rgba(92, 45, 175, 0.38)', // Deep Royal Indigo/Violet
      accent: 'rgba(139, 92, 246, 0.22)'
    },
    {
      x: 0.5,
      y: 0.75,
      baseRadius: 420,
      radius: 420,
      vx: 0.0004,
      vy: -0.0005,
      phase: Math.PI * 0.8,
      color: 'rgba(14, 116, 144, 0.32)', // Luminous Deep Cyan
      accent: 'rgba(6, 182, 212, 0.18)'
    },
    {
      x: 0.85,
      y: 0.85,
      baseRadius: 350,
      radius: 350,
      vx: -0.0007,
      vy: -0.0004,
      phase: Math.PI * 1.4,
      color: 'rgba(168, 85, 247, 0.25)', // Ethereal Purple
      accent: 'rgba(236, 72, 153, 0.15)'
    }
  ];

  // 2. Ambient Micro-particles (Light Motes)
  const particleCount = 45;
  const particles = [];

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 1.8 + 0.6;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.alpha = Math.random() * 0.45 + 0.1;
      this.baseAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.005;
      this.pulsePhase = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges smoothly
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      // Subtle twinkling pulsation
      this.pulsePhase += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulsePhase) * 0.15;

      // Mouse repulsion/attraction field
      const dx = this.x - pointer.x;
      const dy = this.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180 && dist > 0) {
        const force = (1 - dist / 180) * 0.8;
        this.x += (dx / dist) * force;
        this.y += (dy / dist) * force;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(210, 225, 255, ${Math.max(0, this.alpha)})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(61, 110, 255, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Handle Resize
  function handleResize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    if (particles.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
  }

  // Track Pointer
  window.addEventListener('mousemove', (e) => {
    pointer.targetX = e.clientX;
    pointer.targetY = e.clientY;
    pointer.active = true;
  });

  window.addEventListener('mouseleave', () => {
    pointer.active = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      pointer.targetX = e.touches[0].clientX;
      pointer.targetY = e.touches[0].clientY;
      pointer.active = true;
    }
  }, { passive: true });

  // Main Render Loop
  let lastTime = performance.now();

  function render(currentTime) {
    if (!isMotionActive) {
      return;
    }

    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Smooth pointer lerp
    pointer.x += (pointer.targetX - pointer.x) * 0.06;
    pointer.y += (pointer.targetY - pointer.y) * 0.06;

    // Clear with dark atmospheric overlay
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Organic Aurora Fluid Orbs with Multi-Stop Radial Gradients
    ctx.globalCompositeOperation = 'screen';

    const time = currentTime * 0.001;

    orbs.forEach((orb) => {
      // Oscillate coordinates organically
      orb.phase += 0.008;
      const currentOrbX = (orb.x + Math.sin(time * 0.5 + orb.phase) * 0.08) * width;
      const currentOrbY = (orb.y + Math.cos(time * 0.4 + orb.phase) * 0.08) * height;

      // Pointer interactive distortion
      const dx = pointer.x - currentOrbX;
      const dy = pointer.y - currentOrbY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = currentOrbX;
      let targetY = currentOrbY;

      if (dist < 550 && dist > 0) {
        const pull = (1 - dist / 550) * 80;
        targetX += (dx / dist) * pull;
        targetY += (dy / dist) * pull;
      }

      // Radius breathing pulsation
      const currentRadius = orb.baseRadius + Math.sin(time * 0.7 + orb.phase) * 35;

      const gradient = ctx.createRadialGradient(
        targetX, targetY, 0,
        targetX, targetY, currentRadius
      );

      gradient.addColorStop(0, orb.color);
      gradient.addColorStop(0.5, orb.accent);
      gradient.addColorStop(1, 'rgba(7, 7, 9, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(targetX, targetY, currentRadius, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Subtle Interactive Pointer Glow Aura
    if (pointer.active) {
      const pointerGlow = ctx.createRadialGradient(
        pointer.x, pointer.y, 0,
        pointer.x, pointer.y, pointer.radius
      );
      pointerGlow.addColorStop(0, 'rgba(61, 110, 255, 0.18)');
      pointerGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.08)');
      pointerGlow.addColorStop(1, 'rgba(7, 7, 9, 0)');

      ctx.fillStyle = pointerGlow;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, pointer.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Draw Ambient Floating Particles
    ctx.globalCompositeOperation = 'source-over';
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  // Toggle Motion button support
  const toggleBtn = document.getElementById('motion-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isMotionActive = !isMotionActive;
      if (isMotionActive) {
        lastTime = performance.now();
        render(performance.now());
        toggleBtn.classList.remove('paused');
        toggleBtn.setAttribute('title', 'Pause background motion');
      } else {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        toggleBtn.classList.add('paused');
        toggleBtn.setAttribute('title', 'Resume background motion');
      }
    });
  }

  // Optimize when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    } else if (isMotionActive) {
      lastTime = performance.now();
      render(performance.now());
    }
  });

  window.addEventListener('resize', handleResize);

  // Initialize
  handleResize();
  if (isMotionActive) {
    animationFrameId = requestAnimationFrame(render);
  }
})();
