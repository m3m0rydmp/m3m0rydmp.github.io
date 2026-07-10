import React, { useEffect, useRef } from 'react';
import './PixelBlast.css';

const PixelBlast = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const gap = 40; // Gap between points
    const mouseRadius = 150;
    const mouse = { x: -1000, y: -1000 };
    const ripples = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      particles = [];
      const cols = Math.ceil(canvas.width / gap) + 1;
      const rows = Math.ceil(canvas.height / gap) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gap;
          const y = j * gap;
          particles.push({
            x0: x,
            y0: y,
            x: x,
            y: y,
            vx: 0,
            vy: 0,
            size: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? 'rgba(84, 193, 230, 0.4)' : 'rgba(254, 232, 1, 0.2)'
          });
        }
      }
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        maxR: 400,
        speed: 5
      });
      if (ripples.length > 5) ripples.shift();
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('mousedown', handleClick);

    resize();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += ripples[i].speed;
        if (ripples[i].r > ripples[i].maxR) {
          ripples.splice(i, 1);
        }
      }

      particles.forEach(p => {
        // Mouse interaction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouseRadius) {
          const force = (mouseRadius - dist) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          const pushX = Math.cos(angle) * force * 40;
          const pushY = Math.sin(angle) * force * 40;
          
          p.vx -= pushX * 0.2;
          p.vy -= pushY * 0.2;
        }

        // Ripple interaction
        ripples.forEach(r => {
          const rdx = r.x - p.x;
          const rdy = r.y - p.y;
          const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
          const rDiff = Math.abs(rdist - r.r);

          if (rDiff < 20) {
            const rForce = (20 - rDiff) / 20;
            const rAngle = Math.atan2(rdy, rdx);
            p.vx -= Math.cos(rAngle) * rForce * 15;
            p.vy -= Math.sin(rAngle) * rForce * 15;
          }
        });

        // Return to origin (spring physics)
        const dx0 = p.x0 - p.x;
        const dy0 = p.y0 - p.y;
        p.vx += dx0 * 0.03;
        p.vy += dy0 * 0.03;

        // Friction
        p.vx *= 0.92;
        p.vy *= 0.92;

        p.x += p.vx;
        p.y += p.vy;

        // Drawing
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pixel-blast-canvas" />;
};

export default PixelBlast;
