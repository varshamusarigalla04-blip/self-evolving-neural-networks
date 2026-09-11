# Self-Evolving Neural Networks Using Performance-Driven Architecture Mutation

> **An Agentic AI Prototype for Autonomous Neural Architecture Search and Dynamic Topology Optimization**

---

## 📌 Project Overview

Traditional neural network engineering requires human machine learning engineers to manually experiment with layer counts, neuron widths, and hyperparameter tuning. 

This project demonstrates an **Agentic AI** approach: an autonomous software agent that continuously monitors a neural network's performance, diagnoses architectural bottlenecks (such as high-bias underfitting or high-latency over-parameterization), generates targeted structural mutations (adding or pruning neurons and layers), benchmarks candidate architectures, and autonomously evolves the model topology to maximize performance while minimizing complexity.

> **Notice:** As this is a concept prototype and demonstration for college academic evaluation, all performance metrics are dynamically simulated using algorithmic heuristics (capacity vs. complexity vs. latency). No external datasets or multi-hour training routines are required.

---

## 🚀 How to Run the Prototype

You can run this prototype on any machine with zero build steps or package installations required!

### Option 1: 1-Click Batch Launcher (Windows)
Double-click:
```bat
start_prototype.bat
```

### Option 2: Python HTTP Server (Recommended)
Open a terminal in this directory and execute:
```bash
python run_demo.py
```
This will start a local HTTP server at `http://localhost:8000` and automatically open your default web browser.

### Option 3: Direct Browser Open
Double-click or drag `index.html` directly into Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

---

## 🖥️ System Modules & Sections

### 1. Executive Dashboard
- **Active Topology**: Shows current network layer structure (e.g. `4 → 4 → 4 → 2`).
- **Performance Score (Fitness)**: Composite metric balancing accuracy against latency and bloat penalties.
- **Evolution Status Badge**: Real-time lifecycle state (`IDLE`, `EVALUATING`, `DETECTING`, `MUTATING`, `TESTING`, `COMPARING`, `ACCEPTED`, `REJECTED`, `CONVERGED`).
- **Mutation Telemetry**: Displays Generation count, Total mutations, Accepted count, and Rejected count.
- **Global Controls**: Start/Pause Auto-Evolution, Step Next Mutation, Reset Baseline, Speed selector, and Target Fitness slider.

### 2. Neural Network Architecture Visualizer
- High-definition dynamic HTML5 Canvas rendering of the neural network graph.
- Shows **Input Layer** (cyan), **Hidden Layers** (purple), and **Output Layer** (green).
- Displays animated data signal pulses traveling across synaptic connections to simulate active inference.
- Mutation visual diff mode: newly added neurons glow lime-green, and pruned neurons are flagged in red.
- Hover over any neuron to inspect layer name, index, and neuron count.

### 3. Performance Evaluation Panel
- Displays simulated metrics:
  - **Accuracy (%)**: Representation capability.
  - **Cross-Entropy Loss**: Inversely proportional to accuracy.
  - **Inference Latency (ms)**: Computed based on parameter count and depth.
  - **Total Parameters**: Total weights and biases ($W + B$).
- **Performance Trend Chart**: Real-time canvas chart plotting Accuracy, Loss, and Fitness Score against the target threshold over generations.

### 4. Architecture Mutation Lab
- **Manual Mutation Triggers**:
  - `➕ Add Neuron`: Widens representation width.
  - `➖ Remove Neuron`: Prunes redundant neurons.
  - `➕ Add Hidden Layer`: Deepens network hierarchy.
  - `➖ Remove Hidden Layer`: Reduces latency.
- **Layer Selector**: Allows targeting specific hidden layers for mutations.
- **Topology Comparison Card**: Displays before vs after topology comparison.

### 5. Evolution Workflow Pipeline (7-Step Cycle)
A glowing visual pipeline diagram illustrating the autonomous closed loop:
1. **Evaluate Performance** ➔ Benchmarks current metrics.
2. **Detect Poor Performance** ➔ Diagnoses underfitting, capacity limits, or latency bloat.
3. **Generate Architecture Mutation** ➔ Generates candidate network structure.
4. **Test New Architecture** ➔ Benchmarks candidate performance.
5. **Compare Performance** ➔ Computes $\Delta \text{Fitness} = \text{Score}_{\text{new}} - \text{Score}_{\text{old}}$.
6. **Keep Better Architecture** ➔ Accepts candidate if improved; otherwise reverts to baseline.
7. **Repeat Evolution** ➔ Iterates until the target fitness threshold is satisfied.

### 6. Agent Decision & Reasoning Panel
- Real-time Explainable AI (XAI) feed showing natural language thoughts from the agent explaining *why* mutations were selected and *why* they were accepted or rejected.

### 7. Evolution History Table
- Telemetry log of every generation, detailing:
  - Generation # and timestamp
  - Mutation type and target layer
  - Old vs. New topology strings
  - Score shift ($S_{\text{old}} \to S_{\text{new}}$)
  - Net Delta ($\Delta$)
  - Status (`ACCEPTED` or `REJECTED`)
  - Agent rationale explanation

### 8. College Presentation Presets & Viva Guide
- 3 one-click demonstration scenarios:
  1. **Severe Underfitting**: Network [4 → 2 → 2] with 42% accuracy; watch the agent deepen and widen the network.
  2. **Over-Parameterization Bloat**: Network [4 → 16 → 16 → 14 → 2] with high latency; watch the agent prune neurons.
  3. **Baseline Balanced Model**: Standard optimization from [4 → 4 → 4 → 2].
- Included Viva Defense Q&A guide addressing key academic questions.

---

## 📂 Project Structure

```
Self-evolving neural networks/
├── index.html                  # Main responsive single-page web app
├── run_demo.py                 # Local Python server & browser auto-launcher
├── start_prototype.bat         # 1-click Windows launcher
├── README.md                   # Full documentation & project guide
├── css/
│   └── style.css               # Modern glassmorphism dark theme & animations
└── js/
    ├── state.js                # Reactive store (topology, metrics, history, logs)
    ├── evolutionEngine.js      # Agentic AI logic (diagnostics, mutations, reasoner)
    ├── networkVisualizer.js    # Canvas network graph with pulses & diff highlights
    ├── charts.js               # Zero-dependency real-time trend canvas chart
    └── app.js                  # UI controllers, scenario presets, event bindings
```

---

## 🎓 Academic Viva Q&A Cheat Sheet

1. **Q: How does this qualify as Agentic AI?**
   - *A: Rather than relying on static scripts or human manual tuning, the system has agency: it possesses an internal goal (reaching target fitness), observes its environment (evaluates metrics), reasons about bottlenecks (detects underfitting or latency bloat), takes actions (architecture mutations), and learns from outcomes (accepting or rejecting candidates).*

2. **Q: How does the agent avoid infinite growth of neurons?**
   - *A: Through the composite Fitness Function: $\text{Fitness} = \text{Accuracy} - (\alpha \cdot \text{Loss}) - (\beta \cdot \text{Latency}) - \text{BloatPenalty}$. When a network gets too wide or deep, the latency and parameter penalties exceed any marginal accuracy gain, causing the agent to reject bloat mutations.*

3. **Q: What are the primary mutation operators?**
   - *A: The four atomic operators are: Adding a neuron, Pruning a neuron, Adding a hidden layer, and Removing a hidden layer.*
