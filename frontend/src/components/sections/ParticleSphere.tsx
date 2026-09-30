import { Box } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  z: number;
  size: number;
  colorIndex: number;
};

type Pulse = {
  x: number;
  y: number;
  time: number;
};

const COUNT = 1700;
const PULSE_MS = 900;

const createParticles = (): Particle[] => {
  const particles: Particle[] = [];
  let i = 0;
  while (i < COUNT) {
    const theta = 2 * Math.PI * Math.random();
    const phi = Math.acos(2 * Math.random() - 1);
    const radius = 0.22 + Math.random() ** 0.42 * 0.78;
    let colorIndex = 0;
    const roll = Math.random();
    if (roll > 0.88) colorIndex = 2;
    else if (roll > 0.55) colorIndex = 1;

    particles.push({
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta) * 0.92,
      z: radius * Math.cos(phi),
      size: roll > 0.93 ? 2.2 + Math.random() * 1.8 : 0.65 + Math.random() * 1.15,
      colorIndex,
    });
    i += 1;
  }
  return particles;
};

const makeSprite = (rgb: string): HTMLCanvasElement => {
  const size = 32;
  const sprite = document.createElement('canvas');
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext('2d');
  if (!ctx) return sprite;
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gradient.addColorStop(0, `rgba(${rgb}, 1)`);
  gradient.addColorStop(0.28, `rgba(${rgb}, 0.7)`);
  gradient.addColorStop(0.6, `rgba(${rgb}, 0.18)`);
  gradient.addColorStop(1, `rgba(${rgb}, 0)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return sprite;
};

export const ParticleSphere: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement ?? null;
    const context = canvas?.getContext('2d') ?? null;
    if (!canvas || !parent || !context) return () => undefined;

    const particles = createParticles();
    const sprites = [
      makeSprite('78, 150, 255'),
      makeSprite('150, 198, 255'),
      makeSprite('210, 230, 255'),
    ];
    const mouse = { x: 0.5, y: 0.5, active: false };
    const smooth = { x: 0.5, y: 0.5 };
    const pulses: Pulse[] = [];
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = motionQuery.matches;
    let width = 1;
    let height = 1;

    const resize = (): void => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMotion = (event: MediaQueryListEvent): void => {
      reduced = event.matches;
    };

    const onMove = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (event.clientX - rect.left) / rect.width;
      mouse.y = (event.clientY - rect.top) / rect.height;
      mouse.active = true;
    };

    const onLeave = (): void => {
      mouse.active = false;
      mouse.x = 0.5;
      mouse.y = 0.5;
    };

    const onDown = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      pulses.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        time: performance.now(),
      });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    motionQuery.addEventListener('change', onMotion);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);

    const started = performance.now();
    let frame = 0;

    const draw = (now: number): void => {
      const targetX = mouse.active ? mouse.x : 0.5;
      const targetY = mouse.active ? mouse.y : 0.5;
      smooth.x += (targetX - smooth.x) * 0.06;
      smooth.y += (targetY - smooth.y) * 0.06;

      const elapsed = reduced ? 1400 : now - started;
      const yaw = elapsed * 0.00012 + (smooth.x - 0.5) * 0.95;
      const pitch = (smooth.y - 0.5) * 0.5;
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);

      context.clearRect(0, 0, width, height);

      const cx = width * (width < 768 ? 0.62 : 0.52);
      const cy = height * 0.48;
      const radius = Math.min(width, height) * (width < 768 ? 0.42 : 0.46);

      const glow = context.createRadialGradient(cx, cy, radius * 0.05, cx, cy, radius * 1.15);
      glow.addColorStop(0, 'rgba(36, 104, 255, 0.22)');
      glow.addColorStop(0.42, 'rgba(18, 64, 190, 0.08)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      context.globalCompositeOperation = 'source-over';
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
      context.globalCompositeOperation = 'lighter';

      const livePulses = pulses.filter((pulse) => now - pulse.time < PULSE_MS);
      const pointerX = mouse.x * width;
      const pointerY = mouse.y * height;

      particles.forEach((particle) => {
        const rotatedX = particle.x * cosY - particle.z * sinY;
        const rotatedZ = particle.x * sinY + particle.z * cosY;
        const y = particle.y * cosX - rotatedZ * sinX;
        const z = particle.y * sinX + rotatedZ * cosX;
        const perspective = 1.65 / (1.65 + z);
        let sx = cx + rotatedX * radius * perspective;
        let sy = cy + y * radius * perspective;
        let boost = 0;

        if (mouse.active) {
          const dx = sx - pointerX;
          const dy = sy - pointerY;
          const dist = Math.hypot(dx, dy) || 1;
          const reach = 130;
          if (dist < reach) {
            const force = (1 - dist / reach) * 26;
            sx += (dx / dist) * force;
            sy += (dy / dist) * force;
            boost = 1 - dist / reach;
          }
        }

        livePulses.forEach((pulse) => {
          const age = (now - pulse.time) / PULSE_MS;
          const ring = age * Math.min(width, height) * 0.62;
          const dist = Math.abs(Math.hypot(sx - pulse.x, sy - pulse.y) - ring);
          if (dist < 40) boost = Math.max(boost, (1 - dist / 40) * (1 - age));
        });

        const depth = (z + 1) / 2;
        const sprite = sprites[particle.colorIndex];
        const scale = particle.size * perspective * (0.65 + depth * 0.7) * (1 + boost * 1.5);
        context.globalAlpha = Math.min(1, (0.28 + depth * 0.72) * (0.8 + boost));
        context.drawImage(sprite, sx - scale * 4, sy - scale * 4, scale * 8, scale * 8);
      });

      context.globalAlpha = 1;
      context.globalCompositeOperation = 'source-over';

      let head = 0;
      while (head < pulses.length && now - pulses[head].time > PULSE_MS) head += 1;
      if (head > 0) pulses.splice(0, head);

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      motionQuery.removeEventListener('change', onMotion);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
    };
  }, []);

  return (
    <Box position="absolute" inset={0}>
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'crosshair' }}
      />
    </Box>
  );
};
