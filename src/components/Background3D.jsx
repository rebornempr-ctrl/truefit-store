import { useEffect, useRef } from "react";

export default function Background3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animId;
    let mouse = { x: width / 2, y: height / 2 };

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const onMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    // Floating particles
    const PARTICLE_COUNT = 60;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.85 ? "#c8102e" : "#1a1a1a",
    }));

    // Connecting lines threshold
    const LINE_DIST = 120;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle mouse-following glow
      const grd = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
      grd.addColorStop(0, "rgba(200,16,46,0.04)");
      grd.addColorStop(1, "rgba(200,16,46,0)");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Mouse attraction (very subtle)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          p.vx += (dx / dist) * 0.005;
          p.vy += (dy / dist) * 0.005;
        }

        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fillStyle = p.color === "#c8102e"
          ? `rgba(200,16,46,${p.opacity})`
          : `rgba(26,26,26,${p.opacity * 0.5})`;
        ctx.fill();

        // Draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const ldx = p.x - q.x;
          const ldy = p.y - q.y;
          const ldist = Math.sqrt(ldx * ldx + ldy * ldy);
          if (ldist < LINE_DIST) {
            const alpha = (1 - ldist / LINE_DIST) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(26,26,26,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
