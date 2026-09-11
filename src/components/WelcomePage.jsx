import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles, BrainCircuit } from 'lucide-react';

/**
 * WelcomePage Component
 * Professional, research-grade welcome portal for the Agentic AI Project.
 * Features a subtle animated neural network background and glassmorphic card.
 * Uses Lucide React icons.
 */
export default function WelcomePage({ onEnterDashboard }) {
  const canvasRef = useRef(null);

  // Subtle animated background particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize subtle floating nodes
    const nodeCount = Math.min(32, Math.floor(window.innerWidth / 40));
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1.5,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.fillStyle = 'rgba(0, 240, 255, 0.45)';
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="welcome-container">
      {/* Background animated canvas */}
      <canvas ref={canvasRef} className="welcome-canvas" />

      {/* Main Glassmorphic Portal Card */}
      <div className="welcome-card">
        {/* Official Project Logo Image */}
        <div className="welcome-logo-wrapper">
          <img 
            src="/logo.png" 
            alt="Self-Evolving Neural Networks Logo" 
            className="welcome-hero-logo" 
          />
        </div>

        {/* Research Badge */}
        <div className="welcome-badge">
          <Sparkles size={13} color="#00f0ff" />
          <span>Autonomous Agentic AI • Research Prototype</span>
        </div>

        {/* Project Title & Subtitle */}
        <h1 className="welcome-title">Self-Evolving Neural Networks</h1>
        <h2 className="welcome-subtitle">Performance-Driven Architecture Mutation</h2>

        {/* Description */}
        <p className="welcome-description">
          An autonomous system that continuously evaluates neural-network accuracy, 
          computational complexity, and latency. Based on real-time performance feedback, 
          the agentic supervisor dynamically decides whether and how the architecture should 
          evolve through surgical topological mutations—adding neurons, pruning dormant synapses, 
          or expanding hidden layers.
        </p>

        {/* Feature Highlights */}
        <div className="welcome-tags">
          <span className="welcome-tag">Autonomous Evolution Loop</span>
          <span className="welcome-tag">Dynamic Topology Morphing</span>
          <span className="welcome-tag">Pareto Metric Evaluation</span>
          <span className="welcome-tag">Real-Time Data-Flow Visualizer</span>
        </div>

        {/* Premium Enter Button */}
        <div className="welcome-action-wrap">
          <button 
            id="btn-enter-dashboard" 
            className="btn-enter-dashboard"
            onClick={onEnterDashboard}
          >
            <span>Enter Dashboard</span>
            <ArrowRight size={17} strokeWidth={2.5} className="btn-arrow" />
          </button>
        </div>

        <div className="welcome-footer-meta">
          <span>React.js + Vite Architecture</span>
          <span className="meta-separator">•</span>
          <span>Performance-Driven NAS Engine</span>
        </div>
      </div>
    </div>
  );
}
