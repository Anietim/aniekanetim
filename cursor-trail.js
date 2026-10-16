/**
 * CURSOR TRAILING SPLINE EFFECT
 * Creates a glowing, velocity-weighted spline ribbon trail behind the mouse
 * Matches the interactive cursor on FlowDesign / Lissan Haider Webflow site.
 */

(function () {
  'use strict';

  // Check for touch / coarse pointers or reduced motion
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const dot = document.getElementById('cursor-dot');
  const canvas = document.getElementById('cursor-canvas');
  if (!canvas || !dot) return;

  const ctx = canvas.getContext('2d');

  // Trail Configuration
  const config = {
    trailDuration: 1100,      // ms duration trail persists
    trailColor: [61, 110, 255], // Electric Blue [R, G, B]
    minWidth: 2,              // px for fast velocity
    maxWidth: 14,             // px for slow velocity
    smoothing: 0.12,          // width interpolation factor
    vSlow: 0.08,              // px/ms
    vFast: 2.6,               // px/ms
    glowBlur: 14,             // px glow radius
    glowIntensity: 0.45       // glow opacity
  };

  let points = [];
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let dotX = mouseX;
  let dotY = mouseY;
  let runningWidth = config.minWidth;
  let hasMoved = false;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Mouse movement tracking
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!hasMoved) {
      hasMoved = true;
      dot.style.opacity = '1';
      dotX = mouseX;
      dotY = mouseY;
    }
  });

  window.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
  });

  window.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });

  // Track hover on interactive elements to trigger cursor enlargement
  const interactiveSelector = 'a, button, input, select, textarea, .bento-card, .project-card, .filter-btn, .range-slider, .pill-check, .faq-question';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.add('has-cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelector)) {
      document.body.classList.remove('has-cursor-hover');
    }
  });

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function remap(v, inMin, inMax, outMin, outMax) {
    const t = clamp((v - inMin) / (inMax - inMin), 0, 1);
    return outMin + t * (outMax - outMin);
  }

  // Animation Loop
  function loop() {
    const now = performance.now();

    // Smooth dot follower
    dotX += (mouseX - dotX) * 0.22;
    dotY += (mouseY - dotY) * 0.22;
    dot.style.transform = `translate(${dotX}px, ${dotY}px)`;

    // Record trail point if moved sufficiently
    if (hasMoved) {
      if (points.length === 0) {
        points.push({ x: dotX, y: dotY, time: now });
      } else {
        const last = points[points.length - 1];
        const dx = dotX - last.x;
        const dy = dotY - last.y;
        if (dx * dx + dy * dy > 0.5) {
          points.push({ x: dotX, y: dotY, time: now });
        }
      }
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Prune expired points
    points = points.filter(p => now - p.time < config.trailDuration);

    // Draw Smooth Ribbon Trail
    if (points.length >= 3) {
      const [r, g, b] = config.trailColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${config.glowIntensity})`;
      ctx.shadowBlur = config.glowBlur;

      for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];

        const mx1 = (prev.x + curr.x) * 0.5;
        const my1 = (prev.y + curr.y) * 0.5;
        const mx2 = (curr.x + next.x) * 0.5;
        const my2 = (curr.y + next.y) * 0.5;

        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const dt = curr.time - prev.time || 1;
        const velocity = Math.sqrt(dx * dx + dy * dy) / dt;

        const targetWidth = remap(velocity, config.vSlow, config.vFast, config.maxWidth, config.minWidth);
        runningWidth += (targetWidth - runningWidth) * config.smoothing;

        const age = now - curr.time;
        const life = 1 - age / config.trailDuration;
        const alpha = life * life; // Quadratic falloff for smooth fadeout

        if (alpha <= 0.005) continue;

        ctx.beginPath();
        ctx.moveTo(mx1, my1);
        ctx.quadraticCurveTo(curr.x, curr.y, mx2, my2);
        ctx.lineWidth = runningWidth;
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.stroke();
      }

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
})();
