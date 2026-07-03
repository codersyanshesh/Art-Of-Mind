"use client";

import React, { useRef, useEffect } from "react";

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Particle class simulating 3D depth
    class Particle {
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      speed: number;

      constructor() {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * width; // 3D depth
        this.size = Math.random() * 1.5 + 0.5;
        this.speed = Math.random() * 0.8 + 0.2;
        
        // Soft electric violet or cyan colors
        const colors = [
          "rgba(124, 58, 237, 0.3)", // electric violet
          "rgba(6, 182, 212, 0.3)",  // cyan
          "rgba(255, 255, 255, 0.5)", // white star
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.z -= this.speed;
        
        // Reset when particle goes past viewer
        if (this.z <= 0) {
          this.z = width;
          this.x = Math.random() * width - width / 2;
          this.y = Math.random() * height - height / 2;
        }
      }

      draw(context: CanvasRenderingContext2D) {
        // Project 3D coordinates onto 2D screen
        const fov = 300; // perspective field of view
        const scale = fov / (fov + this.z);
        const x2d = this.x * scale + width / 2;
        const y2d = this.y * scale + height / 2;
        const currentSize = this.size * scale * 2;

        if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height) {
          context.beginPath();
          context.arc(x2d, y2d, currentSize, 0, Math.PI * 2);
          context.fillStyle = this.color;
          context.shadowBlur = currentSize * 2;
          context.shadowColor = this.color;
          context.fill();
        }
      }
    }

    const particles: Particle[] = Array.from({ length: 120 }, () => new Particle());

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.fillStyle = "rgba(2, 6, 23, 0.15)"; // slight trails
      ctx.fillRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.update();
        particle.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}
