import { useEffect, useRef } from 'react';

const ConstellationBackground = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: null, y: null, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = 120; // Increased count for better visibility
    const connectionDistance = 140;

    const resize = () => {
      const parent = canvas.parentElement;
      width = canvas.width = parent.clientWidth;
      height = canvas.height = parent.clientHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.color = 'rgba(0, 240, 255, 0.8)';
      }

      update() {
        // Move particles naturally
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off walls
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse Interactivity - Repulsion
        let dx = mouse.current.x - this.x;
        let dy = mouse.current.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.current.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.current.radius) {
          this.x -= directionX;
          this.y -= directionY;
          this.color = 'rgba(168, 85, 247, 0.9)'; // Turn purple when close to mouse
        } else {
          this.color = 'rgba(0, 240, 255, 0.8)';
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add a small glow to the particle
        ctx.shadowBlur = 5;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 1 - (distance / connectionDistance);
            
            // Highlight connections near the mouse
            let mouseDx = mouse.current.x - (particles[i].x + particles[j].x)/2;
            let mouseDy = mouse.current.y - (particles[i].y + particles[j].y)/2;
            let mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
            
            const mouseFactor = mouseDistance < 150 ? (1 - mouseDistance / 150) * 2 : 0;
            
            ctx.strokeStyle = mouseDistance < 150 
              ? `rgba(168, 85, 247, ${opacity * (0.5 + mouseFactor)})` 
              : `rgba(0, 240, 255, ${opacity * 0.2})`;
              
            ctx.lineWidth = mouseDistance < 150 ? 1.5 : 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.x = e.clientX - rect.left;
      mouse.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    let animationFrameId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      drawConnections();
      
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="hero-canvas"
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        filter: 'blur(0.5px)', // Subtle softening for a more "glowing" look
      }}
    />
  );
};

export default ConstellationBackground;
