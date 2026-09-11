import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  ReferenceLine
} from 'recharts';
import {
  LineChart as LineChartIcon,
  BarChart3,
  TrendingUp,
  TableProperties,
  Table,
  LayoutGrid,
  Award,
  Flame,
  Zap,
  Layers,
  Check,
  RotateCcw,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Activity,
  Info
} from 'lucide-react';

/**
 * Official NVIDIA Nemotron SVG Logo
 * Official NVIDIA stylized green claw icon (#76b900) directly from nvidia.com
 */
const NvidiaLogo = ({ size = 16, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="#76b900" 
    className={`nvidia-official-icon ${className}`}
    style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    aria-label="NVIDIA Nemotron Official Logo"
  >
    <path d="M10.212 8.976V7.62c.127-.01.256-.017.388-.021 3.596-.117 5.957 3.184 5.957 3.184s-2.548 3.647-5.282 3.647a3.227 3.227 0 01-1.063-.175v-4.109c1.4.174 1.681.812 2.523 2.258l1.873-1.627a4.905 4.905 0 00-3.67-1.846 6.594 6.594 0 00-.729.044m0-4.476v2.025c.13-.01.259-.019.388-.024 5.002-.174 8.261 4.226 8.261 4.226s-3.743 4.69-7.643 4.69c-.338 0-.675-.031-1.007-.092v1.25c.278.038.558.057.838.057 3.629 0 6.253-1.91 8.794-4.169.421.347 2.146 1.193 2.501 1.564-2.416 2.083-8.048 3.763-11.24 3.763-.308 0-.603-.02-.894-.048V19.5H24v-15H10.21zm0 9.756v1.068c-3.356-.616-4.287-4.21-4.287-4.21a7.173 7.173 0 014.287-2.138v1.172h-.005a3.182 3.182 0 00-2.502 1.178s.615 2.276 2.507 2.931m-5.961-3.3c1.436-1.935 3.604-3.148 5.961-3.336V6.523C5.81 6.887 2 10.723 2 10.723s2.158 6.427 8.21 7.015v-1.166C5.77 16 4.25 10.958 4.25 10.958h-.002z" />
  </svg>
);

/**
 * Universal Model Brand Icon / Logo Component
 * Renders the authentic original website symbols for all 8 AI models:
 * 1. GPT - OpenAI Spiral Vortex Knot (openai.com)
 * 2. Gemini - Google 4-Point Curvilinear Sparkle (gemini.google.com)
 * 3. Claude - Anthropic Official Sunburst Icon (claude.ai)
 * 4. Llama - Meta Official Infinity Ribbon Loop (llama.meta.com)
 * 5. DeepSeek - Official DeepSeek Jumping Whale (deepseek.com)
 * 6. Mistral - Official Mistral Cascading Pixel Steps (mistral.ai)
 * 7. NVIDIA Nemotron - Official NVIDIA Green (#76b900) Claw Logo (nvidia.com)
 * 8. OX Alpha - Official OX Alpha Mark (oxalpha.io)
 */
const ModelLogo = ({ model, size = 16, className = "" }) => {
  const norm = String(model || '').trim().toLowerCase();

  if (norm.includes('nvidia') || norm.includes('nemotron')) {
    return <NvidiaLogo size={size} className={className} />;
  }
  if (norm.includes('gpt')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#10a37f" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.08zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.54-3.01l.14.08 4.79 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.1 3.85-5.84-3.37 2.02-1.17a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.68zm2.01-3.02-.14-.08-4.78-2.79a.78.78 0 0 0-.78 0L8.81 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.14-2.02-1.17a.08.08 0 0 1-.04-.05V6.06a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.8.8 0 0 0-.39.68zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z" />
      </svg>
    );
  }
  if (norm.includes('gemini')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#38bdf8" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
      </svg>
    );
  }
  if (norm.includes('claude')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 257" fill="#D97757" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="m50.228 170.321 50.357-28.257.843-2.463-.843-1.361h-2.462l-8.426-.518-28.775-.778-24.952-1.037-24.175-1.296-6.092-1.297L0 125.796l.583-3.759 5.12-3.434 7.324.648 16.202 1.101 24.304 1.685 17.629 1.037 26.118 2.722h4.148l.583-1.685-1.426-1.037-1.101-1.037-25.147-17.045-27.22-18.017-14.258-10.37-7.713-5.25-3.888-4.925-1.685-10.758 7-7.713 9.397.649 2.398.648 9.527 7.323 20.35 15.75L94.817 91.9l3.889 3.24 1.555-1.102.195-.777-1.75-2.917-14.453-26.118-15.425-26.572-6.87-11.018-1.814-6.61c-.648-2.723-1.102-4.991-1.102-7.778l7.972-10.823L71.42 0 82.05 1.426l4.472 3.888 6.61 15.101 10.694 23.786 16.591 32.34 4.861 9.592 2.592 8.879.973 2.722h1.685v-1.556l1.36-18.211 2.528-22.36 2.463-28.776.843-8.1 4.018-9.722 7.971-5.25 6.222 2.981 5.12 7.324-.713 4.73-3.046 19.768-5.962 30.98-3.889 20.739h2.268l2.593-2.593 10.499-13.934 17.628-22.036 7.778-8.749 9.073-9.657 5.833-4.601h11.018l8.1 12.055-3.628 12.443-11.342 14.388-9.398 12.184-13.48 18.147-8.426 14.518.778 1.166 2.01-.194 30.46-6.481 16.462-2.982 19.637-3.37 8.88 4.148.971 4.213-3.5 8.62-20.998 5.184-24.628 4.926-36.682 8.685-.454.324.519.648 16.526 1.555 7.065.389h17.304l32.21 2.398 8.426 5.574 5.055 6.805-.843 5.184-12.962 6.611-17.498-4.148-40.83-9.721-14-3.5h-1.944v1.167l11.666 11.406 21.387 19.314 26.767 24.887 1.36 6.157-3.434 4.86-3.63-.518-23.526-17.693-9.073-7.972-20.545-17.304h-1.36v1.814l4.73 6.935 25.017 37.59 1.296 11.536-1.814 3.76-6.481 2.268-7.13-1.297-14.647-20.544-15.1-23.138-12.185-20.739-1.49.843-7.194 77.448-3.37 3.953-7.778 2.981-6.48-4.925-3.436-7.972 3.435-15.749 4.148-20.544 3.37-16.333 3.046-20.285 1.815-6.74-.13-.454-1.49.194-15.295 20.999-23.267 31.433-18.406 19.702-4.407 1.75-7.648-3.954.713-7.064 4.277-6.286 25.47-32.405 15.36-20.092 9.917-11.6-.065-1.686h-.583L44.07 198.125l-12.055 1.555-5.185-4.86.648-7.972 2.463-2.593 20.35-13.999-.064.065Z" />
      </svg>
    );
  }
  if (norm.includes('llama')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#8b5cf6" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M6.897 4c1.915 0 3.516.932 5.43 3.376l.282-.373c.19-.246.383-.484.58-.71l.313-.35C14.588 4.788 15.792 4 17.225 4c1.273 0 2.469.557 3.491 1.516l.218.213c1.73 1.765 2.917 4.71 3.053 8.026l.011.392.002.25c0 1.501-.28 2.759-.818 3.7l-.14.23-.108.153c-.301.42-.664.758-1.086 1.009l-.265.142-.087.04a3.493 3.493 0 01-.302.118 4.117 4.117 0 01-1.33.208c-.524 0-.996-.067-1.438-.215-.614-.204-1.163-.56-1.726-1.116l-.227-.235c-.753-.812-1.534-1.976-2.493-3.586l-1.43-2.41-.544-.895-1.766 3.13-.343.592C7.597 19.156 6.227 20 4.356 20c-1.21 0-2.205-.42-2.936-1.182l-.168-.184c-.484-.573-.837-1.311-1.043-2.189l-.067-.32a8.69 8.69 0 01-.136-1.288L0 14.468c.002-.745.06-1.49.174-2.23l.1-.573c.298-1.53.828-2.958 1.536-4.157l.209-.34c1.177-1.83 2.789-3.053 4.615-3.16L6.897 4zm-.033 2.615l-.201.01c-.83.083-1.606.673-2.252 1.577l-.138.199-.01.018c-.67 1.017-1.185 2.378-1.456 3.845l-.004.022a12.591 12.591 0 00-.207 2.254l.002.188c.004.18.017.36.04.54l.043.291c.092.503.257.908.486 1.208l.117.137c.303.323.698.492 1.17.492 1.1 0 1.796-.676 3.696-3.641l2.175-3.4.454-.701-.139-.198C9.11 7.3 8.084 6.616 6.864 6.616zm10.196-.552l-.176.007c-.635.048-1.223.359-1.82.933l-.196.198c-.439.462-.887 1.064-1.367 1.807l.266.398c.18.274.362.56.55.858l.293.475 1.396 2.335.695 1.114c.583.926 1.03 1.6 1.408 2.082l.213.262c.282.326.529.54.777.673l.102.05c.227.1.457.138.718.138.176.002.35-.023.518-.073.338-.104.61-.32.813-.637l.095-.163.077-.162c.194-.459.29-1.06.29-1.785l-.006-.449c-.08-2.871-.938-5.372-2.2-6.798l-.176-.189c-.67-.683-1.444-1.074-2.27-1.074z" />
      </svg>
    );
  }
  if (norm.includes('deepseek')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#0ea5e9" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path d="M23.748 4.482c-.254-.124-.364.113-.512.234-.051.039-.094.09-.137.136-.372.397-.806.657-1.373.626-.829-.046-1.537.214-2.163.848-.133-.782-.575-1.248-1.247-1.548-.352-.156-.708-.311-.955-.65-.172-.241-.219-.51-.305-.774-.055-.16-.11-.323-.293-.35-.2-.031-.278.136-.356.276-.313.572-.434 1.202-.422 1.84.027 1.436.633 2.58 1.838 3.393.137.093.172.187.129.323-.082.28-.18.552-.266.833-.055.179-.137.217-.329.14a5.526 5.526 0 01-1.736-1.18c-.857-.828-1.631-1.742-2.597-2.458a11.365 11.365 0 00-.689-.471c-.985-.957.13-1.743.388-1.836.27-.098.093-.432-.779-.428-.872.004-1.67.295-2.687.684a3.055 3.055 0 01-.465.137 9.597 9.597 0 00-2.883-.102c-1.885.21-3.39 1.102-4.497 2.623C.082 8.606-.231 10.684.152 12.85c.403 2.284 1.569 4.175 3.36 5.653 1.858 1.533 3.997 2.284 6.438 2.14 1.482-.085 3.133-.284 4.994-1.86.47.234.962.327 1.78.397.63.059 1.236-.03 1.705-.128.735-.156.684-.837.419-.961-2.155-1.004-1.682-.595-2.113-.926 1.096-1.296 2.746-2.642 3.392-7.003.05-.347.007-.565 0-.845-.004-.17.035-.237.23-.256a4.173 4.173 0 001.545-.475c1.396-.763 1.96-2.015 2.093-3.517.02-.23-.004-.467-.247-.588zM11.581 18c-2.089-1.642-3.102-2.183-3.52-2.16-.392.024-.321.471-.235.763.09.288.207.486.371.739.114.167.192.416-.113.603-.673.416-1.842-.14-1.897-.167-1.361-.802-2.5-1.86-3.301-3.307-.774-1.393-1.224-2.887-1.298-4.482-.02-.386.093-.522.477-.592a4.696 4.696 0 011.529-.039c2.132.312 3.946 1.265 5.468 2.774.868.86 1.525 1.887 2.202 2.891.72 1.066 1.494 2.082 2.48 2.914.348.292.625.514.891.677-.802.09-2.14.11-3.054-.614zm1-6.44a.306.306 0 01.415-.287.302.302 0 01.2.288.306.306 0 01-.31.307.303.303 0 01-.304-.308zm3.11 1.596c-.2.081-.399.151-.59.16a1.245 1.245 0 01-.798-.254c-.274-.23-.47-.358-.552-.758a1.73 1.73 0 01.016-.588c.07-.327-.008-.537-.239-.727-.187-.156-.426-.199-.688-.199a.559.559 0 01-.254-.078c-.11-.054-.2-.19-.114-.358.028-.054.16-.186.192-.21.356-.202.767-.136 1.146.016.352.144.618.408 1.001.782.391.451.462.576.685.914.176.265.336.537.445.848.067.195-.019.354-.25.452z" />
      </svg>
    );
  }
  if (norm.includes('mistral')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 233" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
        <path fill="#F7D046" d="M186.18 0h69.82v46.55h-69.82zM0 0h69.82v46.55H0z" />
        <path fill="#F2A73B" d="M139.64 46.55h116.36v46.55H139.64zM0 46.55h116.36v46.55H0z" />
        <path fill="#EE792F" d="M69.82 93.09h186.18v46.55H69.82zM0 93.09h69.82v46.55H0z" />
        <path fill="#EB5829" d="M93.09 139.64h69.82v46.55H93.09zM186.18 139.64h69.82v46.55h-69.82zM0 139.64h69.82v46.55H0z" />
        <path fill="#EA3326" d="M186.18 186.18h69.82v46.55h-69.82zM0 186.18h69.82v46.55H0z" />
      </svg>
    );
  }
  // Default: OX Alpha (from oxalpha.io official brand mark)
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}>
      <ellipse cx="21" cy="24" rx="14" ry="11" fill="none" stroke="#ec4899" strokeWidth="4" />
      <circle cx="21" cy="24" r="4" fill="#ec4899" />
      <path d="m33 17 9 7-9 7" fill="none" stroke="#ec4899" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
    </svg>
  );
};

/**
 * 8 AI Models Metadata
 * CRITICAL: "NVIDIA Nemotron" is spelled exactly as required everywhere.
 * CRITICAL: "OX Alpha" is spelled with "ph" as required.
 */
const MODELS_METADATA = [
  {
    id: 'gpt',
    name: 'GPT',
    fullName: 'OpenAI GPT-4o Class',
    color: '#10a37f', // OpenAI Green
    tag: 'Dense MoE',
    baseScore: 92.4,
    benchmarkAccuracy: 93.5,
    benchmarkLatency: 42,
    benchmarkEfficiency: 89.5,
    benchmarkImprovement: '+1.8%',
    generationTag: 'v4o-2024',
    metrics: {
      Reasoning: 94.2,
      Coding: 92.8,
      Language: 95.0,
      Mathematics: 91.5,
      Knowledge: 96.2,
      Speed: 88.0
    }
  },
  {
    id: 'gemini',
    name: 'Gemini',
    fullName: 'Google Gemini 1.5 Pro',
    color: '#38bdf8', // Google Sky Blue
    tag: 'Multimodal MoE',
    baseScore: 91.8,
    benchmarkAccuracy: 92.8,
    benchmarkLatency: 36,
    benchmarkEfficiency: 92.0,
    benchmarkImprovement: '+2.4%',
    generationTag: 'v1.5-Pro',
    metrics: {
      Reasoning: 93.0,
      Coding: 91.5,
      Language: 94.5,
      Mathematics: 92.0,
      Knowledge: 95.5,
      Speed: 91.2
    }
  },
  {
    id: 'claude',
    name: 'Claude',
    fullName: 'Anthropic Claude 3.5 Sonnet',
    color: '#f59e0b', // Anthropic Warm Amber
    tag: 'Constitutional Hybrid',
    baseScore: 93.1,
    benchmarkAccuracy: 94.2,
    benchmarkLatency: 48,
    benchmarkEfficiency: 88.2,
    benchmarkImprovement: '+2.1%',
    generationTag: 'v3.5-Sonnet',
    metrics: {
      Reasoning: 95.5,
      Coding: 95.2,
      Language: 96.0,
      Mathematics: 90.8,
      Knowledge: 94.0,
      Speed: 86.5
    }
  },
  {
    id: 'llama',
    name: 'Llama',
    fullName: 'Meta Llama 3.1 70B',
    color: '#818cf8', // Meta Violet
    tag: 'Open Dense 70B',
    baseScore: 88.6,
    benchmarkAccuracy: 88.6,
    benchmarkLatency: 28,
    benchmarkEfficiency: 94.1,
    benchmarkImprovement: '+1.2%',
    generationTag: '3.1-70B',
    metrics: {
      Reasoning: 88.2,
      Coding: 87.5,
      Language: 90.0,
      Mathematics: 85.5,
      Knowledge: 91.0,
      Speed: 92.0
    }
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    fullName: 'DeepSeek V3 / R1',
    color: '#06b6d4', // DeepSeek Teal
    tag: 'DeepSeek MoE 671B',
    baseScore: 90.5,
    benchmarkAccuracy: 92.0,
    benchmarkLatency: 32,
    benchmarkEfficiency: 95.4,
    benchmarkImprovement: '+3.6%',
    generationTag: 'R1/V3-671B',
    metrics: {
      Reasoning: 94.8,
      Coding: 93.2,
      Language: 89.5,
      Mathematics: 94.0,
      Knowledge: 88.5,
      Speed: 89.0
    }
  },
  {
    id: 'mistral',
    name: 'Mistral',
    fullName: 'Mistral Large 2',
    color: '#f97316', // Mistral Flame Orange
    tag: 'Dense 123B',
    baseScore: 87.9,
    benchmarkAccuracy: 87.9,
    benchmarkLatency: 26,
    benchmarkEfficiency: 91.8,
    benchmarkImprovement: '+1.5%',
    generationTag: 'Large-2',
    metrics: {
      Reasoning: 87.5,
      Coding: 89.0,
      Language: 91.2,
      Mathematics: 84.8,
      Knowledge: 89.5,
      Speed: 93.5
    }
  },
  {
    id: 'nemotron',
    name: 'NVIDIA Nemotron', // CRITICAL: Exact required spelling
    fullName: 'NVIDIA Nemotron 70B',
    color: '#76b900', // NVIDIA Electric Green
    tag: 'NAS Optimized 70B',
    baseScore: 89.7,
    benchmarkAccuracy: 90.8,
    benchmarkLatency: 19,
    benchmarkEfficiency: 96.2,
    benchmarkImprovement: '+2.8%',
    generationTag: '70B-NAS',
    metrics: {
      Reasoning: 90.5,
      Coding: 88.4,
      Language: 89.0,
      Mathematics: 88.0,
      Knowledge: 92.5,
      Speed: 95.0
    }
  },
  {
    id: 'oxalpha',
    name: 'OX Alpha', // CRITICAL: Exact required spelling with "ph"
    fullName: 'OX Alpha (Self-Evolving Architecture)',
    color: '#ec4899', // NeuroEvolve Neon Pink
    tag: 'Self-Evolving Topology',
    baseScore: 89.2,
    benchmarkAccuracy: 94.0,
    benchmarkLatency: 24,
    benchmarkEfficiency: 93.8,
    benchmarkImprovement: '+4.0%',
    generationTag: 'Live Evolutionary',
    metrics: {
      Reasoning: 94.0,
      Coding: 93.5,
      Language: 92.5,
      Mathematics: 93.0,
      Knowledge: 91.5,
      Speed: 94.2
    }
  }
];

// 1. Dataset for Main Multi-Line Graph (10 Evaluation / Iterations)
const ITERATION_EVAL_DATA = [
  { eval: 'Eval 1', GPT: 91.2, Gemini: 90.5, Claude: 92.1, Llama: 86.2, DeepSeek: 87.4, Mistral: 85.0, 'NVIDIA Nemotron': 88.1, 'OX Alpha': 82.0 },
  { eval: 'Eval 2', GPT: 92.0, Gemini: 91.2, Claude: 92.8, Llama: 86.8, DeepSeek: 89.1, Mistral: 85.6, 'NVIDIA Nemotron': 88.6, 'OX Alpha': 84.5 },
  { eval: 'Eval 3', GPT: 91.8, Gemini: 92.0, Claude: 93.4, Llama: 87.5, DeepSeek: 88.5, Mistral: 86.2, 'NVIDIA Nemotron': 89.2, 'OX Alpha': 87.2 },
  { eval: 'Eval 4', GPT: 92.5, Gemini: 91.7, Claude: 93.0, Llama: 87.2, DeepSeek: 91.0, Mistral: 86.8, 'NVIDIA Nemotron': 89.8, 'OX Alpha': 89.0 },
  { eval: 'Eval 5', GPT: 93.1, Gemini: 92.6, Claude: 93.8, Llama: 88.0, DeepSeek: 90.4, Mistral: 87.4, 'NVIDIA Nemotron': 89.5, 'OX Alpha': 91.4 },
  { eval: 'Eval 6', GPT: 92.8, Gemini: 93.2, Claude: 94.2, Llama: 88.4, DeepSeek: 92.6, Mistral: 87.1, 'NVIDIA Nemotron': 90.4, 'OX Alpha': 92.8 },
  { eval: 'Eval 7', GPT: 93.4, Gemini: 92.9, Claude: 94.0, Llama: 88.9, DeepSeek: 91.8, Mistral: 87.8, 'NVIDIA Nemotron': 90.9, 'OX Alpha': 94.1 },
  { eval: 'Eval 8', GPT: 93.0, Gemini: 93.5, Claude: 94.6, Llama: 88.6, DeepSeek: 93.2, Mistral: 88.2, 'NVIDIA Nemotron': 91.3, 'OX Alpha': 94.9 },
  { eval: 'Eval 9', GPT: 93.6, Gemini: 93.8, Claude: 94.8, Llama: 89.1, DeepSeek: 92.8, Mistral: 88.5, 'NVIDIA Nemotron': 91.8, 'OX Alpha': 95.4 },
  { eval: 'Eval 10', GPT: 93.5, Gemini: 94.1, Claude: 95.0, Llama: 89.4, DeepSeek: 93.5, Mistral: 88.8, 'NVIDIA Nemotron': 92.2, 'OX Alpha': 96.0 }
];

// 3. Dataset for Third Graph (Performance Across 8 Generations)
const GENERATIONS_DATA = [
  { gen: 'Gen 1', fullGen: 'Generation 1', GPT: 90.8, Gemini: 90.2, Claude: 91.5, Llama: 85.5, DeepSeek: 86.0, Mistral: 84.5, 'NVIDIA Nemotron': 87.0, 'OX Alpha': 74.0 },
  { gen: 'Gen 2', fullGen: 'Generation 2', GPT: 91.5, Gemini: 91.0, Claude: 92.2, Llama: 86.2, DeepSeek: 87.8, Mistral: 85.2, 'NVIDIA Nemotron': 88.2, 'OX Alpha': 79.5 },
  { gen: 'Gen 3', fullGen: 'Generation 3', GPT: 92.0, Gemini: 91.8, Claude: 92.9, Llama: 86.9, DeepSeek: 89.2, Mistral: 86.0, 'NVIDIA Nemotron': 88.8, 'OX Alpha': 84.2 },
  { gen: 'Gen 4', fullGen: 'Generation 4', GPT: 92.4, Gemini: 92.2, Claude: 93.4, Llama: 87.4, DeepSeek: 90.5, Mistral: 86.7, 'NVIDIA Nemotron': 89.5, 'OX Alpha': 88.0 },
  { gen: 'Gen 5', fullGen: 'Generation 5', GPT: 92.8, Gemini: 92.8, Claude: 93.9, Llama: 88.1, DeepSeek: 91.4, Mistral: 87.2, 'NVIDIA Nemotron': 90.1, 'OX Alpha': 91.2 },
  { gen: 'Gen 6', fullGen: 'Generation 6', GPT: 93.1, Gemini: 93.4, Claude: 94.3, Llama: 88.6, DeepSeek: 92.2, Mistral: 87.9, 'NVIDIA Nemotron': 90.8, 'OX Alpha': 93.5 },
  { gen: 'Gen 7', fullGen: 'Generation 7', GPT: 93.4, Gemini: 93.9, Claude: 94.7, Llama: 89.0, DeepSeek: 93.0, Mistral: 88.3, 'NVIDIA Nemotron': 91.4, 'OX Alpha': 94.8 },
  { gen: 'Gen 8', fullGen: 'Generation 8', GPT: 93.6, Gemini: 94.2, Claude: 95.0, Llama: 89.4, DeepSeek: 93.6, Mistral: 88.7, 'NVIDIA Nemotron': 92.0, 'OX Alpha': 95.6 },
];

export default function ModelComparison({
  metrics,
  deltas,
  currentScore,
  newScore,
  evolutionHistory
}) {
  // Model Selection Filter State
  const [selectedModels, setSelectedModels] = useState({
    'GPT': true,
    'Gemini': true,
    'Claude': true,
    'Llama': true,
    'DeepSeek': true,
    'Mistral': true,
    'NVIDIA Nemotron': true, // Exact spelling
    'OX Alpha': true         // Exact spelling
  });

  // Focused/Inspected Model (visually connects Filter, Metrics & Graphs)
  const [focusedModel, setFocusedModel] = useState('NVIDIA Nemotron');

  // Metrics Table View Switcher: 'table' | 'cards'
  const [metricsViewMode, setMetricsViewMode] = useState('table');

  // Second Graph: Metric Selection Dropdown
  const [selectedMetric, setSelectedMetric] = useState('Reasoning');
  const metricOptions = ['Reasoning', 'Coding', 'Language', 'Mathematics', 'Knowledge', 'Speed'];

  // Toggle individual model
  const toggleModel = (name) => {
    setSelectedModels(prev => {
      const nextVal = !prev[name];
      if (nextVal) {
        setFocusedModel(name);
      }
      return {
        ...prev,
        [name]: nextVal
      };
    });
  };

  // Select all models
  const selectAll = () => {
    const updated = {};
    MODELS_METADATA.forEach(m => { updated[m.name] = true; });
    setSelectedModels(updated);
  };

  // Deselect all models
  const deselectAll = () => {
    const updated = {};
    MODELS_METADATA.forEach(m => { updated[m.name] = false; });
    setSelectedModels(updated);
  };

  // Active models list
  const activeModels = useMemo(() => {
    return MODELS_METADATA.filter(m => selectedModels[m.name]);
  }, [selectedModels]);

  // Derive consolidated model metrics table linking real project data for OX Alpha
  const modelMetricsData = useMemo(() => {
    return MODELS_METADATA.map(m => {
      const isOxAlpha = m.name === 'OX Alpha';

      // If OX Alpha, bind directly to live React telemetry/project state
      const accuracy = isOxAlpha && metrics?.accuracy ? Number(metrics.accuracy) : m.benchmarkAccuracy;
      const performanceScore = isOxAlpha && currentScore ? Number(currentScore) : m.baseScore;
      const latency = isOxAlpha && metrics?.neuronCount
        ? Math.round(20 + metrics.neuronCount * 0.7)
        : m.benchmarkLatency;
      const efficiency = isOxAlpha && metrics?.loss
        ? +((1 - metrics.loss) * 100).toFixed(1)
        : m.benchmarkEfficiency;
      const improvement = isOxAlpha && (deltas?.accuracy || deltas?.performanceScore)
        ? (deltas.accuracy || deltas.performanceScore)
        : m.benchmarkImprovement;
      const generation = isOxAlpha && evolutionHistory?.length
        ? `Gen ${evolutionHistory.length}`
        : m.generationTag;

      return {
        ...m,
        accuracy,
        performanceScore,
        latency,
        efficiency,
        improvement,
        generation,
        isLiveProjectData: isOxAlpha,
        isSelected: !!selectedModels[m.name],
        isFocused: focusedModel === m.name
      };
    });
  }, [selectedModels, focusedModel, metrics, currentScore, deltas, evolutionHistory]);

  // Dynamic Summary Statistics calculated from active models
  const stats = useMemo(() => {
    if (activeModels.length === 0) {
      return {
        bestScore: '0.0%',
        bestModel: 'None Selected',
        avgScore: '0.0%',
        highestVarModel: 'None',
        highestVarValue: '±0.0%',
        modelCount: 0
      };
    }

    // 1. Highest performance score in iterations dataset
    let maxVal = -Infinity;
    let bestModelName = '';
    ITERATION_EVAL_DATA.forEach(row => {
      activeModels.forEach(m => {
        if (row[m.name] > maxVal) {
          maxVal = row[m.name];
          bestModelName = m.name;
        }
      });
    });

    // 2. Average score across iterations
    let totalScore = 0;
    let totalPoints = 0;
    ITERATION_EVAL_DATA.forEach(row => {
      activeModels.forEach(m => {
        totalScore += row[m.name];
        totalPoints++;
      });
    });
    const avgScore = (totalScore / totalPoints).toFixed(1);

    // 3. Highest variation (max - min across generations)
    let maxDelta = -1;
    let maxVarModel = '';
    activeModels.forEach(m => {
      const genScores = GENERATIONS_DATA.map(row => row[m.name]);
      const min = Math.min(...genScores);
      const max = Math.max(...genScores);
      const delta = max - min;
      if (delta > maxDelta) {
        maxDelta = delta;
        maxVarModel = m.name;
      }
    });

    return {
      bestScore: `${maxVal.toFixed(1)}%`,
      bestModel: bestModelName,
      avgScore: `${avgScore}%`,
      highestVarModel: maxVarModel,
      highestVarValue: `±${(maxDelta / 2).toFixed(1)}% (Δ ${maxDelta.toFixed(1)}%)`,
      modelCount: activeModels.length
    };
  }, [activeModels]);

  // Metric-wise data for Second Graph
  const metricWiseData = useMemo(() => {
    return activeModels.map(m => ({
      model: m.name,
      score: m.metrics[selectedMetric],
      color: m.color,
      fullName: m.fullName,
      tag: m.tag
    }));
  }, [activeModels, selectedMetric]);

  // Glassmorphic Custom Tooltip for Multi-Line Graphs
  const CustomMultiLineTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const sorted = [...payload].sort((a, b) => b.value - a.value);
      return (
        <div 
          className="ml-chart-glass-tooltip chart-glass-tooltip"
          style={{
            background: 'rgba(8, 14, 28, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85)',
            pointerEvents: 'none'
          }}
        >
          <div className="tooltip-header-row">
            <span className="tooltip-point-name font-mono">{label}</span>
            <span className="tooltip-sub-badge">Evaluation Point</span>
          </div>
          <div className="tooltip-entries-grid">
            {sorted.map((item, idx) => (
              <div
                key={idx}
                className={`tooltip-entry-line ${focusedModel === item.name ? 'tooltip-entry-focused' : ''}`}
              >
                <ModelLogo model={item.name} size={13} />
                <span className="entry-model-label">{item.name}:</span>
                <span className="entry-score-val font-mono" style={{ color: item.color }}>
                  {Number(item.value).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Metric-wise Bar Graph
  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const modelData = item.payload;
      return (
        <div 
          className="ml-chart-glass-tooltip chart-glass-tooltip"
          style={{
            background: 'rgba(8, 14, 28, 0.96)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.85)',
            pointerEvents: 'none'
          }}
        >
          <div className="tooltip-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ModelLogo model={modelData.model} size={15} />
              <span className="tooltip-point-name font-mono font-bold" style={{ color: '#fff' }}>{modelData.model}</span>
            </div>
            <span className="tooltip-sub-badge font-mono" style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>{selectedMetric} Dimension</span>
          </div>
          <div className="tooltip-bar-body" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div className="tooltip-entry-line" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="entry-color-dot" style={{ backgroundColor: modelData.color, width: '8px', height: '8px', borderRadius: '50%' }} />
              <span className="entry-model-label" style={{ color: 'var(--text-secondary)' }}>Benchmark Score:</span>
              <span className="entry-score-val font-mono font-bold" style={{ color: modelData.color }}>
                {Number(modelData.score).toFixed(1)}%
              </span>
            </div>
            <div className="tooltip-details-sub font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Topology: <span style={{ color: '#e2e8f0' }}>{modelData.tag}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom X-Axis Tick for Bar Chart: authentic official logo centered directly above each model's name
  const CustomBarAxisTick = ({ x, y, payload }) => {
    const modelName = payload?.value;
    const isFocused = focusedModel === modelName;
    return (
      <g transform={`translate(${x},${y + 4})`}>
        <foreignObject x={-55} y={0} width={110} height={44} requiredExtensions="http://www.w3.org/1999/xhtml">
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="bar-chart-custom-tick"
            onClick={() => setFocusedModel(modelName)}
            title={`Select ${modelName}`}
          >
            <ModelLogo model={modelName} size={15} />
            <span
              style={{
                color: isFocused ? '#00f0ff' : '#cbd5e1',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono, monospace',
                whiteSpace: 'nowrap',
                textAlign: 'center',
                fontWeight: isFocused ? 700 : 500,
                textShadow: isFocused ? '0 0 8px rgba(0, 240, 255, 0.4)' : 'none'
              }}
            >
              {modelName}
            </span>
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <section id="ai-model-comparison" className="dashboard-section card comparison-analytics-section">
      {/* 1. Main Header */}
      <div className="section-header-row">
        <div className="section-title-wrap">
          <div className="section-icon-badge icon-purple">
            <LineChartIcon size={20} strokeWidth={2} color="#a855f7" />
          </div>
          <div>
            <div className="title-row-with-badge">
              <h2 className="section-heading">AI MODEL PERFORMANCE &amp; VARIATION ANALYSIS</h2>
              <span className="prototype-status-pill">
                <span className="pill-dot-pulse" />
                Evaluation Matrix &amp; Comparative Trajectories
              </span>
            </div>
            <p className="section-subheading">
              Comparative performance variation across 8 leading AI architectures across multiple evaluation metrics
            </p>
          </div>
        </div>
      </div>

      {/* 2. Four Premium Summary Cards */}
      <div className="analytics-summary-grid">
        <div className="analytics-stat-card card-emerald">
          <div className="stat-card-header">
            <span className="stat-card-label">BEST DEMO PERFORMANCE</span>
            <span className="stat-badge-chip font-mono">Top Peak</span>
          </div>
          <div className="stat-card-main-val font-mono">
            {stats.bestScore}
          </div>
          <div className="stat-card-footer">
            <span className="stat-footer-model" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ModelLogo model={stats.bestModel} size={14} />
              {stats.bestModel}
            </span>
            <span className="stat-demo-flag font-mono">PROTOTYPE STAT</span>
          </div>
        </div>

        <div className="analytics-stat-card card-cyan">
          <div className="stat-card-header">
            <span className="stat-card-label">AVERAGE PERFORMANCE</span>
            <span className="stat-badge-chip font-mono">Cohort Mean</span>
          </div>
          <div className="stat-card-main-val font-mono">
            {stats.avgScore}
          </div>
          <div className="stat-card-footer">
            <span>Across Active Models</span>
            <span className="stat-demo-flag font-mono">PROTOTYPE STAT</span>
          </div>
        </div>

        <div className="analytics-stat-card card-purple">
          <div className="stat-card-header">
            <span className="stat-card-label">HIGHEST VARIATION</span>
            <span className="stat-badge-chip font-mono">Max Dynamic</span>
          </div>
          <div className="stat-card-main-val font-mono">
            {stats.highestVarValue}
          </div>
          <div className="stat-card-footer">
            <span className="stat-footer-model" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ModelLogo model={stats.highestVarModel} size={14} />
              {stats.highestVarModel}
            </span>
            <span className="stat-demo-flag font-mono">PROTOTYPE STAT</span>
          </div>
        </div>

        <div className="analytics-stat-card card-amber">
          <div className="stat-card-header">
            <span className="stat-card-label">MODELS COMPARED</span>
            <span className="stat-badge-chip font-mono">{stats.modelCount} / 8 Active</span>
          </div>
          <div className="stat-card-main-val font-mono">
            {stats.modelCount}
          </div>
          <div className="stat-card-footer">
            <span>Selected Architecture Cohort</span>
            <span className="stat-demo-flag font-mono">PROTOTYPE STAT</span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Model Filter Toolbar (Visually Connected with Model Metrics) */}
      <div className="model-filters-card">
        <div className="filters-header-row">
          <div className="filters-title-group">
            <SlidersHorizontal size={15} strokeWidth={2} color="#00f0ff" className="filter-icon-lucide" />
            <span className="filter-heading">AI Model Filter:</span>
            <span className="filter-instruction">
              (Click to toggle curves in graphs and highlight metrics in the table below)
            </span>
          </div>
          <div className="filters-actions-group">
            <button className="btn-filter-action" onClick={selectAll} title="Enable all 8 models">
              <Check size={12} strokeWidth={2.5} /> Show All
            </button>
            <button className="btn-filter-action" onClick={deselectAll} title="Clear all model lines">
              <RotateCcw size={12} strokeWidth={2} /> Hide All
            </button>
          </div>
        </div>

        <div className="model-toggles-container">
          {MODELS_METADATA.map((m) => {
            const isChecked = selectedModels[m.name];
            const isFocused = focusedModel === m.name;
            return (
              <button
                key={m.name}
                type="button"
                className={`model-toggle-pill ${isChecked ? 'toggle-active' : 'toggle-inactive'} ${isFocused ? 'toggle-focused' : ''}`}
                onClick={() => toggleModel(m.name)}
                onMouseEnter={() => setFocusedModel(m.name)}
                style={{
                  '--model-color': m.color,
                  borderColor: isFocused ? m.color : isChecked ? `${m.color}88` : 'rgba(255, 255, 255, 0.1)'
                }}
                title={`Toggle ${m.name} (${isChecked ? 'Visible' : 'Hidden'})`}
              >
                <span className="toggle-checkbox">
                  {isChecked ? <CheckSquare size={13} strokeWidth={2.2} /> : <Square size={13} strokeWidth={1.8} />}
                </span>
                <ModelLogo model={m.name} size={15} />
                <span className="toggle-name font-mono">{m.name}</span>
                {isFocused && <span className="focused-indicator-dot" style={{ backgroundColor: m.color }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. AI MODEL METRICS SECTION (Clean, Compact Dashboard Card/Table Connected with Filter) */}
      <div className="model-metrics-section-card">
        <div className="metrics-section-top-bar">
          <div className="metrics-section-title-wrap">
            <div className="section-icon-badge icon-cyan">
              <TableProperties size={20} strokeWidth={2} color="#00f0ff" />
            </div>
            <div>
              <h3 className="section-heading">AI MODEL METRICS</h3>
              <p className="metrics-section-sub">
                Comprehensive evaluation matrix across Accuracy, Performance Score, Latency, Efficiency, Improvement %, and Generation
              </p>
            </div>
          </div>

          <div className="metrics-toolbar-right">
            {/* Live Focus Inspector Chip */}
            <div className="focused-model-inspector-chip" style={{ borderColor: `${MODELS_METADATA.find(m => m.name === focusedModel)?.color}66` }}>
              <span className="inspector-label font-mono">Inspecting:</span>
              <ModelLogo model={focusedModel} size={15} />
              <strong className="inspector-name font-mono">{focusedModel}</strong>
            </div>

            {/* View Switcher: Table vs Cards */}
            <div className="metrics-view-toggle">
              <button
                className={`view-toggle-btn ${metricsViewMode === 'table' ? 'active-view' : ''}`}
                onClick={() => setMetricsViewMode('table')}
                title="Compact Table View"
              >
                <Table size={13} strokeWidth={2} />
                <span>Compact Table</span>
              </button>
              <button
                className={`view-toggle-btn ${metricsViewMode === 'cards' ? 'active-view' : ''}`}
                onClick={() => setMetricsViewMode('cards')}
                title="Dashboard Cards View"
              >
                <LayoutGrid size={13} strokeWidth={2} />
                <span>Cards View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabular View */}
        {metricsViewMode === 'table' ? (
          <div className="metrics-table-responsive-wrapper">
            <table className="ai-model-metrics-table">
              <thead>
                <tr>
                  <th style={{ width: '220px' }}>Model</th>
                  <th>Accuracy</th>
                  <th>Performance Score</th>
                  <th>Latency</th>
                  <th>Efficiency</th>
                  <th>Improvement %</th>
                  <th>Current Generation</th>
                  <th style={{ textAlign: 'center', width: '110px' }}>Filter Status</th>
                </tr>
              </thead>
              <tbody>
                {modelMetricsData.map((item) => {
                  return (
                    <tr
                      key={item.name}
                      className={`metrics-table-row ${item.isSelected ? 'row-active' : 'row-dimmed'} ${item.isFocused ? 'row-focused' : ''}`}
                      onClick={() => {
                        setFocusedModel(item.name);
                        if (!item.isSelected) toggleModel(item.name);
                      }}
                      style={{
                        '--row-accent': item.color
                      }}
                    >
                      {/* Model Name & Logo */}
                      <td className="model-brand-cell">
                        <div className="model-brand-wrap">
                          <span className="row-color-indicator" style={{ backgroundColor: item.color }} />
                          <ModelLogo model={item.name} size={18} />
                          <div>
                            <span className="model-name-text font-mono font-bold">{item.name}</span>
                            <span className="model-tag-sub font-mono">{item.tag}</span>
                          </div>
                          {item.isLiveProjectData && (
                            <span className="live-telemetry-badge font-mono" title="Live data linked from running project">
                              LIVE
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Accuracy */}
                      <td>
                        <div className="metric-val-with-bar">
                          <span className="metric-num-val font-mono font-bold" style={{ color: item.isSelected ? '#ffffff' : '#64748b' }}>
                            {item.accuracy.toFixed(1)}%
                          </span>
                          <div className="mini-metric-track">
                            <div
                              className="mini-metric-bar"
                              style={{ width: `${item.accuracy}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Performance Score */}
                      <td>
                        <span className="metric-score-badge font-mono" style={{ borderColor: `${item.color}55`, color: item.color }}>
                          {item.performanceScore.toFixed(1)}%
                        </span>
                      </td>

                      {/* Latency */}
                      <td>
                        <span className="metric-latency-val font-mono">
                          {item.latency} ms
                        </span>
                      </td>

                      {/* Efficiency */}
                      <td>
                        <span className="metric-efficiency-val font-mono">
                          {typeof item.efficiency === 'number' ? item.efficiency.toFixed(1) : item.efficiency}%
                        </span>
                      </td>

                      {/* Improvement % */}
                      <td>
                        <span className="metric-improvement-badge font-mono">
                          ▲ {item.improvement}
                        </span>
                      </td>

                      {/* Current Generation */}
                      <td>
                        <span className="metric-generation-tag font-mono">
                          {item.generation}
                        </span>
                      </td>

                      {/* Filter Status & Toggle Action */}
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className={`btn-row-toggle font-mono ${item.isSelected ? 'status-visible' : 'status-hidden'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleModel(item.name);
                          }}
                          title={`Toggle ${item.name}`}
                        >
                          {item.isSelected ? '● Visible' : '○ Hidden'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Cards Grid View */
          <div className="metrics-cards-grid">
            {modelMetricsData.map((item) => (
              <div
                key={item.name}
                className={`model-metric-compact-card ${item.isSelected ? 'card-active' : 'card-dimmed'} ${item.isFocused ? 'card-focused' : ''}`}
                onClick={() => {
                  setFocusedModel(item.name);
                  if (!item.isSelected) toggleModel(item.name);
                }}
                style={{
                  '--card-accent': item.color,
                  borderColor: item.isFocused ? item.color : item.isSelected ? `${item.color}66` : 'rgba(255, 255, 255, 0.08)'
                }}
              >
                <div className="compact-card-header">
                  <div className="card-brand-group">
                    <ModelLogo model={item.name} size={20} />
                    <div>
                      <h4 className="compact-model-name font-mono">{item.name}</h4>
                      <span className="compact-model-tag font-mono">{item.tag}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`btn-pill-toggle font-mono ${item.isSelected ? 'pill-visible' : 'pill-hidden'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModel(item.name);
                    }}
                  >
                    {item.isSelected ? 'Visible' : 'Hidden'}
                  </button>
                </div>

                <div className="compact-metrics-grid">
                  <div className="metric-mini-tile">
                    <span className="tile-label">Accuracy</span>
                    <span className="tile-val font-mono font-bold" style={{ color: item.color }}>
                      {item.accuracy.toFixed(1)}%
                    </span>
                  </div>
                  <div className="metric-mini-tile">
                    <span className="tile-label">Score</span>
                    <span className="tile-val font-mono">{item.performanceScore.toFixed(1)}%</span>
                  </div>
                  <div className="metric-mini-tile">
                    <span className="tile-label">Latency</span>
                    <span className="tile-val font-mono">{item.latency}ms</span>
                  </div>
                  <div className="metric-mini-tile">
                    <span className="tile-label">Efficiency</span>
                    <span className="tile-val font-mono">{typeof item.efficiency === 'number' ? item.efficiency.toFixed(1) : item.efficiency}%</span>
                  </div>
                </div>

                <div className="compact-card-footer">
                  <span className="card-improvement font-mono">Improvement: <strong>{item.improvement}</strong></span>
                  <span className="card-gen-pill font-mono">{item.generation}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="metrics-sync-notice font-mono">
          <span className="notice-live-dot" />
          <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <strong>Data Linkage:</strong> Metrics for{' '}
            <span className="inline-model-badge">
              <ModelLogo model="OX Alpha" size={14} />
              <strong>OX Alpha</strong>
            </span>{' '}
            reflect real live project telemetry from the ongoing evolution cycle. Benchmark models (including{' '}
            <span className="inline-model-badge">
              <ModelLogo model="NVIDIA Nemotron" size={14} />
              <strong>NVIDIA Nemotron</strong>
            </span>
            ) display standardized empirical baseline dimensions.
          </span>
        </div>
      </div>

      {/* 5. MAIN GRAPH: Large Multi-Line Performance Variation Graph */}
      <div className="chart-large-card main-variation-card">
        <div className="chart-card-header-row">
          <div>
            <h3 className="chart-card-title">Multi-Line Performance Variation Graph</h3>
            <p className="chart-card-subtitle">
              Continuous performance curves across 10 sequential evaluation checkpoints (Eval 1 → Eval 10)
            </p>
          </div>
          <div className="chart-header-badge font-mono">
            X: Evaluation / Iterations • Y: Performance Score (%)
          </div>
        </div>

        <div className="chart-canvas-wrapper">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart
              data={ITERATION_EVAL_DATA}
              margin={{ top: 25, right: 35, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="eval"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                label={{
                  value: 'Evaluation / Iterations',
                  position: 'insideBottom',
                  offset: -12,
                  fill: '#94a3b8',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <YAxis
                domain={[80, 100]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                unit="%"
                label={{
                  value: 'Performance Score',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fill: '#94a3b8',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <Tooltip content={<CustomMultiLineTooltip />} cursor={{ stroke: 'rgba(0, 240, 255, 0.25)', strokeDasharray: '3 3' }} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', marginRight: '16px', verticalAlign: 'middle' }}>
                    <ModelLogo model={value} size={14} />
                    <span>{value}</span>
                  </span>
                )}
              />
              <ReferenceLine y={90} stroke="rgba(0, 240, 255, 0.25)" strokeDasharray="4 4" label={{ value: 'Target Baseline (90%)', fill: '#00f0ff', fontSize: 10, position: 'insideTopRight' }} />

              {/* Render dynamic smooth line for each active model */}
              {MODELS_METADATA.map((m) => {
                if (!selectedModels[m.name]) return null;
                const isFocused = focusedModel === m.name;
                return (
                  <Line
                    key={m.name}
                    type="monotone"
                    dataKey={m.name}
                    name={m.name}
                    stroke={m.color}
                    strokeWidth={isFocused ? 3.8 : m.name === 'OX Alpha' ? 3.2 : 2.2}
                    strokeOpacity={isFocused ? 1 : 0.85}
                    dot={{ r: isFocused ? 4.5 : 3.5, fill: m.color, stroke: '#080d1a', strokeWidth: 1.5 }}
                    activeDot={{ r: 6.5, fill: '#ffffff', stroke: m.color, strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1100}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6. METRIC-WISE MODEL VARIATION SECTION */}
      <div className="metric-variation-section-container">
        <div className="section-header-row align-items-center">
          <div className="section-title-wrap">
            <div className="section-icon-badge icon-cyan">
              <TrendingUp size={20} strokeWidth={2} color="#00f0ff" />
            </div>
            <div>
              <h3 className="section-heading">METRIC-WISE MODEL VARIATION</h3>
              <p className="section-subheading">
                Cross-model benchmark comparison dynamically grouped across core cognitive capabilities
              </p>
            </div>
          </div>

          {/* User Requested Dropdown: "Select Metric" */}
          <div className="metric-dropdown-control-box">
            <label htmlFor="metric-dropdown-select" className="dropdown-label font-mono">
              Select Metric:
            </label>
            <div className="select-wrapper">
              <select
                id="metric-dropdown-select"
                className="metric-select-dropdown font-mono"
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
              >
                {metricOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Top Reference & Metric Legend Bar - Clearly visible above the graph */}
        <div className="metric-chart-top-toolbar">
          <div className="metric-toolbar-left font-mono">
            <span className="metric-pill-dot" />
            <span className="metric-toolbar-focus">Benchmark Dimension:</span>
            <span className="metric-toolbar-val font-bold text-cyan">{selectedMetric}</span>
          </div>

          <div className="sota-reference-pill font-mono" title="Benchmark reference baseline across frontier models (92%)">
            <span className="sota-line-sample" aria-hidden="true" />
            <span className="sota-text">State of Art Reference (92%)</span>
          </div>
        </div>

        {/* Direct Graph Area - No duplicate card, no second white container, no empty white background box */}
        <div className="metric-variation-direct-graph">
          <ResponsiveContainer width="100%" height={370}>
            <BarChart
              data={metricWiseData}
              margin={{ top: 20, right: 25, left: 10, bottom: 48 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="model"
                stroke="#94a3b8"
                interval={0}
                tick={<CustomBarAxisTick />}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                label={{
                  value: 'AI Models',
                  position: 'insideBottom',
                  offset: -8,
                  fill: '#94a3b8',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <YAxis
                domain={[80, 100]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                unit="%"
                label={{
                  value: `${selectedMetric} Score (%)`,
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fill: '#94a3b8',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={false} />
              <ReferenceLine y={92} stroke="rgba(168, 85, 247, 0.45)" strokeDasharray="3 3" />
              <Bar
                dataKey="score"
                name={`${selectedMetric} Score`}
                radius={[6, 6, 0, 0]}
                animationDuration={900}
              >
                {metricWiseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    fillOpacity={entry.model === focusedModel ? 1 : 0.82}
                    stroke={entry.color}
                    strokeWidth={entry.model === focusedModel ? 2.5 : 1.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Metric Quick Description Bar */}
        <div className="metric-context-bar">
          <span className="metric-context-tag font-mono">Focus: {selectedMetric}</span>
          <span className="metric-context-text">
            Comparing currently active models on simulated <strong>{selectedMetric}</strong> performance benchmarks.
            Higher scores indicate superior reasoning complexity, latency containment, and generalization accuracy.
          </span>
        </div>
      </div>

      {/* 7. THIRD GRAPH: Performance Variation Across Generations */}
      <div className="chart-large-card generation-variation-card">
        <div className="chart-card-header-row">
          <div>
            <h3 className="chart-card-title">Performance Variation Across Generations</h3>
            <p className="chart-card-subtitle">
              Longitudinal tracking over 8 evolutionary cycles demonstrating adaptive architecture mutation
            </p>
          </div>
          <div className="chart-header-badge font-mono">
            X: Generation (1 → 8) • Y: Performance Score (%)
          </div>
        </div>

        <div className="chart-canvas-wrapper">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart
              data={GENERATIONS_DATA}
              margin={{ top: 25, right: 35, left: 10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" vertical={false} />
              <XAxis
                dataKey="fullGen"
                stroke="#94a3b8"
                tick={{ fill: '#cbd5e1', fontSize: 12, fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                label={{
                  value: 'Evolutionary Generations',
                  position: 'insideBottom',
                  offset: -12,
                  fill: '#94a3b8',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <YAxis
                domain={[70, 100]}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}
                tickLine={{ stroke: 'rgba(255, 255, 255, 0.15)' }}
                unit="%"
                label={{
                  value: 'Performance Score',
                  angle: -90,
                  position: 'insideLeft',
                  offset: 0,
                  fill: '#94a3b8',
                  fontSize: 12,
                  fontFamily: 'Inter, sans-serif'
                }}
              />
              <Tooltip content={<CustomMultiLineTooltip />} cursor={{ stroke: 'rgba(0, 240, 255, 0.25)', strokeDasharray: '3 3' }} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                formatter={(value) => (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace', marginRight: '16px', verticalAlign: 'middle' }}>
                    <ModelLogo model={value} size={14} />
                    <span>{value}</span>
                  </span>
                )}
              />
              <ReferenceLine y={90} stroke="rgba(16, 185, 129, 0.25)" strokeDasharray="4 4" label={{ value: 'Target Goal (90%)', fill: '#10b981', fontSize: 10, position: 'insideTopRight' }} />

              {/* All 8 models as separate lines */}
              {MODELS_METADATA.map((m) => {
                if (!selectedModels[m.name]) return null;
                const isFocused = focusedModel === m.name;
                return (
                  <Line
                    key={`gen-${m.name}`}
                    type="monotone"
                    dataKey={m.name}
                    name={m.name}
                    stroke={m.color}
                    strokeWidth={isFocused ? 4.0 : m.name === 'OX Alpha' ? 3.5 : 2.0}
                    strokeOpacity={isFocused ? 1 : 0.85}
                    dot={{ r: isFocused ? 4.5 : 3.5, fill: m.color, stroke: '#080d1a', strokeWidth: 1.5 }}
                    activeDot={{ r: 6.5, fill: '#ffffff', stroke: m.color, strokeWidth: 2 }}
                    isAnimationActive={true}
                    animationDuration={1200}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 8. Bottom Academic / Prototype Disclaimer Notice */}
      <div className="academic-disclaimer-banner">
        <div className="disclaimer-icon-lucide">
          <Info size={18} strokeWidth={2} color="#a855f7" />
        </div>
        <div className="disclaimer-content">
          <div className="disclaimer-title font-mono">
            Prototype Visualization — Simulated Data Notice
          </div>
          <div className="disclaimer-text">
            Performance values are illustrative and may vary depending on model version, task, benchmark and evaluation method.
            All benchmark metrics displayed across{' '}
            <span className="inline-model-badge"><ModelLogo model="GPT" size={13} /> <strong>GPT</strong></span>,{' '}
            <span className="inline-model-badge"><ModelLogo model="Gemini" size={13} /> <strong>Gemini</strong></span>,{' '}
            <span className="inline-model-badge"><ModelLogo model="Claude" size={13} /> <strong>Claude</strong></span>,{' '}
            <span className="inline-model-badge"><ModelLogo model="Llama" size={13} /> <strong>Llama</strong></span>,{' '}
            <span className="inline-model-badge"><ModelLogo model="DeepSeek" size={13} /> <strong>DeepSeek</strong></span>,{' '}
            <span className="inline-model-badge"><ModelLogo model="Mistral" size={13} /> <strong>Mistral</strong></span>,{' '}
            <span className="inline-model-badge"><ModelLogo model="NVIDIA Nemotron" size={13} /> <strong>NVIDIA Nemotron</strong></span>, and{' '}
            <span className="inline-model-badge"><ModelLogo model="OX Alpha" size={13} /> <strong>OX Alpha</strong></span>{' '}
            represent simulated educational demonstration scores designed to illustrate architectural variation and evolutionary adaptation within this research system.
          </div>
        </div>
      </div>
    </section>
  );
}
