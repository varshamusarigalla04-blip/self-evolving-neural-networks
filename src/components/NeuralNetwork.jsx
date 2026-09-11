import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Network, RotateCcw, Pause, Play, X } from 'lucide-react';

/**
 * NeuralNetwork Component
 * Large, interactive, and animated neural-network visualization.
 * Features:
 * - Visually distinct circular neurons and connecting lines.
 * - Dynamic neuron identifiers: Input (I1..), Hidden 1 (H1..), Hidden 2 (H5..), Output (O1..).
 * - Neuron Data-Flow Labeling: Small, unobtrusive badges (e.g. x1 → h1, h1 → h5, h5 → o1).
 * - Sequential data-flow animation traveling from Input → Hidden 1 → Hidden 2 → Output.
 */
export default function NeuralNetwork({ 
  layers = [3, 4, 3, 2], 
  layerNames = ['Input Layer', 'Hidden Layer 1', 'Hidden Layer 2', 'Output Layer'] 
}) {
  const ANIMATION_DURATION_MS = 10000; // Exactly 10 seconds

  const [isAnimRunning, setIsAnimRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(10);
  const [flowStep, setFlowStep] = useState(1); // 1: I->H1, 2: H1->H2, 3: H2->Out, etc.
  const [flowProgress, setFlowProgress] = useState(0); // 0 to 1 along the path
  const [speed, setSpeed] = useState('normal'); // slow, normal, fast
  const [selectedNeuron, setSelectedNeuron] = useState(null);

  const timerTimeoutRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const speedMs = speed === 'slow' ? 2400 : speed === 'fast' ? 900 : 1600;

  // Function to start or restart the exact 10-second animation
  const startAnimation = () => {
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    setIsAnimRunning(true);
    setTimeLeft(10);
    setFlowStep(1);
    setFlowProgress(0);

    const startTime = Date.now();

    timerIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, Math.ceil((ANIMATION_DURATION_MS - elapsed) / 1000));
      setTimeLeft(remaining);
    }, 200);

    timerTimeoutRef.current = setTimeout(() => {
      setIsAnimRunning(false);
      setTimeLeft(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }, ANIMATION_DURATION_MS);
  };

  // Optional pause before 10s expires
  const stopAnimation = () => {
    if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setIsAnimRunning(false);
    setTimeLeft(0);
  };

  // Run the 10-second animation on mount and whenever the network architecture mutates
  const layersKey = layers.join('-');
  useEffect(() => {
    startAnimation();
    return () => {
      if (timerTimeoutRef.current) clearTimeout(timerTimeoutRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [layersKey]);

  // Animation loop driving data-flow signal progression only while isAnimRunning is true
  useEffect(() => {
    if (!isAnimRunning) return;

    let startTime = performance.now();
    let frameId;

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(1, elapsed / speedMs);
      setFlowProgress(progress);

      if (progress >= 1) {
        startTime = performance.now();
        setFlowStep((prev) => {
          const maxSteps = layers.length - 1; // e.g. 3 transitions for 4 layers
          return prev >= maxSteps ? 1 : prev + 1;
        });
      }

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isAnimRunning, speedMs, layers.length]);

  // Layout calculation for SVG nodes
  const svgWidth = 920;
  const svgHeight = 440;
  const paddingX = 90;
  const paddingY = 60;

  // Calculate neuron nodes with exact identifiers
  const { nodes, connections, activeFlowPaths } = useMemo(() => {
    const calculatedNodes = [];
    const calculatedConnections = [];
    const layerCount = layers.length;
    const xStep = (svgWidth - paddingX * 2) / (layerCount - 1);

    // Track global hidden neuron indexing (H1, H2, H3, H4, then H5, H6, H7...)
    let hiddenCounter = 1;

    layers.forEach((count, lIdx) => {
      const x = paddingX + lIdx * xStep;
      const yAvailable = svgHeight - paddingY * 2;
      const yStep = count > 1 ? yAvailable / (count - 1) : 0;
      const startY = count > 1 ? paddingY : svgHeight / 2;

      for (let nIdx = 0; nIdx < count; nIdx++) {
        const y = count > 1 ? startY + nIdx * yStep : startY;
        let id = '';
        let flowVar = '';

        if (lIdx === 0) {
          id = `I${nIdx + 1}`;
          flowVar = `x${nIdx + 1}`;
        } else if (lIdx === layerCount - 1) {
          id = `O${nIdx + 1}`;
          flowVar = `o${nIdx + 1}`;
        } else {
          id = `H${hiddenCounter}`;
          flowVar = `h${hiddenCounter}`;
          hiddenCounter++;
        }

        calculatedNodes.push({
          id,
          flowVar,
          layerIndex: lIdx,
          neuronIndex: nIdx,
          x,
          y,
          layerType: lIdx === 0 ? 'input' : lIdx === layerCount - 1 ? 'output' : 'hidden'
        });
      }
    });

    // Build connections between adjacent layers
    for (let lIdx = 0; lIdx < layerCount - 1; lIdx++) {
      const fromNodes = calculatedNodes.filter((n) => n.layerIndex === lIdx);
      const toNodes = calculatedNodes.filter((n) => n.layerIndex === lIdx + 1);

      fromNodes.forEach((from) => {
        toNodes.forEach((to) => {
          calculatedConnections.push({
            id: `${from.id}->${to.id}`,
            from,
            to,
            stepIndex: lIdx + 1, // Matches flowStep
            label: `${from.flowVar} → ${to.flowVar}`
          });
        });
      });
    }

    // Select primary paths for prominent data-flow visualization & labeling
    // We pick clear representative connections to keep it readable and not cluttered
    const representativePaths = [];
    for (let lIdx = 0; lIdx < layerCount - 1; lIdx++) {
      const fromNodes = calculatedNodes.filter((n) => n.layerIndex === lIdx);
      const toNodes = calculatedNodes.filter((n) => n.layerIndex === lIdx + 1);

      fromNodes.forEach((from, fIdx) => {
        // Connect each from node to corresponding or adjacent to nodes
        const targetTo = toNodes[fIdx % toNodes.length];
        representativePaths.push({
          from,
          to: targetTo,
          stepIndex: lIdx + 1,
          label: `${from.flowVar} → ${targetTo.flowVar}`
        });
      });
    }

    return { 
      nodes: calculatedNodes, 
      connections: calculatedConnections,
      activeFlowPaths: representativePaths 
    };
  }, [layers]);

  // Current active step details
  const currentStepName = useMemo(() => {
    if (flowStep === 1) return 'Input Layer → Hidden Layer 1';
    if (flowStep === 2) return 'Hidden Layer 1 → Hidden Layer 2';
    if (flowStep === 3) return layers.length > 4 ? 'Hidden Layer 2 → Hidden Layer 3' : 'Hidden Layer 2 → Output Layer';
    return 'Hidden Layer → Output Layer';
  }, [flowStep, layers.length]);

  return (
    <section id="neural-network" className="dashboard-section card network-section-card">
      {/* Header & Controls */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-cyan">
            <Network size={20} strokeWidth={2} color="#00f0ff" />
          </div>
          <div>
            <h2 className="section-heading">NEURAL NETWORK ARCHITECTURE</h2>
            <p className="section-subheading">
              Topology: {layers.join(' → ')} ({nodes.length} Neurons • {connections.length} Synapses)
            </p>
          </div>
        </div>

        {/* Animation & Signal Controls */}
        <div className="network-controls-group">
          {/* Status Indicator Required by User */}
          <div 
            className={`anim-status-indicator ${isAnimRunning ? 'status-running' : 'status-paused'}`}
            title={isAnimRunning ? `Animation active (${timeLeft}s remaining)` : 'Animation paused after 10 seconds'}
            role="status"
          >
            <span className="anim-status-dot" />
            <span className="anim-status-text">
              {isAnimRunning ? 'Animation: Running' : 'Animation: Paused'}
            </span>
            {isAnimRunning && (
              <span className="anim-timer-chip font-mono">{timeLeft}s</span>
            )}
          </div>

          {/* Replay Animation Button */}
          <button 
            className="btn btn-primary btn-sm replay-anim-btn"
            onClick={startAnimation}
            title="Start the 10-second animation again"
          >
            <RotateCcw size={13} strokeWidth={2.2} />
            <span>Replay Animation</span>
          </button>

          {/* Manual Pause Button (when running) */}
          {isAnimRunning && (
            <button 
              className="btn btn-secondary btn-sm"
              onClick={stopAnimation}
              title="Pause animation immediately"
            >
              <Pause size={13} strokeWidth={2} />
              <span>Pause</span>
            </button>
          )}

          <div className="step-indicator-badge">
            <span className={`step-pulsing-circle ${!isAnimRunning ? 'circle-paused' : ''}`} />
            <span className="step-text font-mono">
              {isAnimRunning ? `Flow: ${currentStepName}` : 'State: Architecture Stable'}
            </span>
          </div>

          <div className="speed-toggle-box">
            <span className="speed-lbl">Speed:</span>
            {['slow', 'normal', 'fast'].map((s) => (
              <button
                key={s}
                className={`speed-pill ${speed === s ? 'active-speed' : ''}`}
                onClick={() => setSpeed(s)}
              >
                {s[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layer Headers Ribbon */}
      <div className="layer-ribbon-grid" style={{ gridTemplateColumns: `repeat(${layers.length}, 1fr)` }}>
        {layers.map((count, idx) => {
          const isLayerActive = isAnimRunning && (
            (flowStep === idx && flowProgress < 0.5) || 
            (flowStep === idx + 1 && flowProgress >= 0.5) ||
            (flowStep === layers.length - 1 && idx === layers.length - 1)
          );
          return (
            <div key={idx} className={`layer-ribbon-item ${isLayerActive ? 'ribbon-active' : ''}`}>
              <span className="ribbon-title">{layerNames[idx] || `Layer ${idx}`}</span>
              <span className="ribbon-count font-mono">{count} Neurons</span>
            </div>
          );
        })}
      </div>

      {/* Large SVG Neural Network Visualization Canvas */}
      <div className={`svg-network-container ${isAnimRunning ? 'anim-running' : 'anim-paused'}`}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="network-svg-canvas"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glow filters for active neurons & signal pulses */}
            <filter id="neon-glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="neon-glow-purple" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Linear gradients for connections */}
            <linearGradient id="conn-active-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.95"/>
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8"/>
            </linearGradient>
          </defs>

          {/* 1. Base Synaptic Connections */}
          <g className="connections-layer">
            {connections.map((conn) => {
              const isActiveStep = isAnimRunning && flowStep === conn.stepIndex;
              return (
                <line
                  key={conn.id}
                  x1={conn.from.x}
                  y1={conn.from.y}
                  x2={conn.to.x}
                  y2={conn.to.y}
                  className={`conn-line ${isActiveStep ? 'conn-active-step' : ''}`}
                  stroke={isActiveStep ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 255, 255, 0.1)'}
                  strokeWidth={isActiveStep ? 2 : 1.1}
                />
              );
            })}
          </g>

          {/* 2. Active Animated Signal Packets & Data-Flow Labels (Only visible when animation is running) */}
          {isAnimRunning && (
            <g className="active-signals-layer">
              {activeFlowPaths
                .filter((p) => p.stepIndex === flowStep)
                .map((path, pIdx) => {
                  // Interpolated position along connection line
                  const curX = path.from.x + (path.to.x - path.from.x) * flowProgress;
                  const curY = path.from.y + (path.to.y - path.from.y) * flowProgress;

                  // Label position slightly offset so it does not collide or cover
                  const labelOffsetY = pIdx % 2 === 0 ? -16 : 14;
                  const labelX = curX;
                  const labelY = curY + labelOffsetY;

                  return (
                    <g key={`flow-${path.from.id}-${path.to.id}-${pIdx}`} className="signal-group">
                      {/* Highlighted connection line */}
                      <line
                        x1={path.from.x}
                        y1={path.from.y}
                        x2={curX}
                        y2={curY}
                        stroke="url(#conn-active-grad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        filter="url(#neon-glow-cyan)"
                      />

                      {/* Moving signal packet dot */}
                      <circle
                        cx={curX}
                        cy={curY}
                        r="5.5"
                        fill="#00f0ff"
                        filter="url(#neon-glow-cyan)"
                      />
                      <circle
                        cx={curX}
                        cy={curY}
                        r="2.5"
                        fill="#ffffff"
                      />

                      {/* DATA-FLOW LABEL: e.g. x1 → h1, h1 → h5, h5 → o1 */}
                      <g className="flow-label-badge" transform={`translate(${labelX}, ${labelY})`}>
                        <rect
                          x="-28"
                          y="-10"
                          width="56"
                          height="18"
                          rx="5"
                          fill="rgba(8, 14, 28, 0.92)"
                          stroke="#00f0ff"
                          strokeWidth="0.8"
                          className="flow-label-bg"
                        />
                        <text
                          x="0"
                          y="3"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="600"
                          fontFamily="JetBrains Mono, monospace"
                          fill="#38bdf8"
                          className="flow-label-text"
                        >
                          {path.label}
                        </text>
                      </g>
                    </g>
                  );
                })}
            </g>
          )}

          {/* 3. Circular Neurons with Labels */}
          <g className="nodes-layer">
            {nodes.map((node) => {
              // Highlight condition: only when animation is actively running
              const isEmitting = isAnimRunning && flowStep === node.layerIndex + 1;
              const isReceiving = isAnimRunning && flowStep === node.layerIndex && flowProgress > 0.8;
              const isHighlighted = isAnimRunning && (isEmitting || isReceiving);

              let nodeColor = '#38bdf8'; // Default hidden cyan-blue
              if (node.layerType === 'input') nodeColor = '#00f0ff'; // Bright cyan for input
              if (node.layerType === 'output') nodeColor = '#10b981'; // Emerald for output
              if (node.layerType === 'hidden' && node.layerIndex === 2) nodeColor = '#a855f7'; // Purple for hidden 2

              const isSelected = selectedNeuron?.id === node.id;
              // Staggered subtle animation delay for organic, non-mechanical pulsing
              const animDelay = `${((node.layerIndex * 0.35 + node.neuronIndex * 0.18) % 2).toFixed(2)}s`;

              return (
                <g 
                  key={node.id} 
                  className={`neuron-svg-node ${isAnimRunning ? 'neuron-animating' : 'neuron-static'} ${isHighlighted ? 'neuron-highlighted' : ''}`}
                  onClick={() => setSelectedNeuron(node)}
                  style={{ 
                    transformOrigin: `${node.x}px ${node.y}px`,
                    animationDelay: isAnimRunning ? animDelay : '0s',
                    cursor: 'pointer' 
                  }}
                >
                  {/* Outer glow ring for active signals only during running animation */}
                  {isHighlighted && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="26"
                      fill="none"
                      stroke={nodeColor}
                      strokeWidth="2"
                      opacity="0.6"
                      filter="url(#neon-glow-cyan)"
                      className="pulse-ring"
                    />
                  )}

                  {/* Outer node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? "22" : "20"}
                    fill="#0a1020"
                    stroke={isSelected ? '#ffffff' : nodeColor}
                    strokeWidth={isSelected ? "2.5" : "2"}
                    filter={isHighlighted ? "url(#neon-glow-cyan)" : undefined}
                    className="neuron-circle"
                  />

                  {/* Inner subtle core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="8"
                    fill={nodeColor}
                    opacity={isHighlighted ? 0.95 : 0.4}
                    className="neuron-core"
                  />

                  {/* NEURON NAMING LABEL: I1, I2, H1, H2, H5, O1... */}
                  <text
                    x={node.x}
                    y={node.y + 4.5}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fontFamily="JetBrains Mono, monospace"
                    fill="#ffffff"
                    pointerEvents="none"
                    className="neuron-id-text"
                  >
                    {node.id}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Interactive Legend & Selected Node Inspector */}
      <div className="network-footer-bar">
        <div className="network-legend">
          <div className="legend-item">
            <span className="legend-dot dot-cyan" />
            <span>Input Nodes (I1–I{layers[0]})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-blue" />
            <span>Hidden 1 (H1–H{layers[1]})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-purple" />
            <span>Hidden 2 (H{layers[1] + 1}–H{layers[1] + (layers[2] || 0)})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot dot-emerald" />
            <span>Output (O1–O{layers[layers.length - 1]})</span>
          </div>
          <div className="legend-item">
            <span className="legend-tag font-mono">x1 → h1</span>
            <span>Data-Flow Pulse Label</span>
          </div>
        </div>

        {selectedNeuron && (
          <div className="selected-neuron-pill">
            <span>Selected: <strong>{selectedNeuron.id}</strong> ({selectedNeuron.layerType.toUpperCase()})</span>
            <button className="pill-close" onClick={() => setSelectedNeuron(null)}>
              <X size={11} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
