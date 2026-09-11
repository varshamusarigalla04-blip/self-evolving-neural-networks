import React from 'react';

// 1. OpenAI GPT Logo
export function GptLogo({ size = 18, color = "#10a37f" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M22.28 9.82a5.98 5.98 0 0 0-.52-4.91 6.05 6.05 0 0 0-6.51-2.9A6.07 6.07 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.05 6.05 0 0 0 .74 7.1 5.98 5.98 0 0 0 .51 4.91 6.05 6.05 0 0 0 6.52 2.9A5.98 5.98 0 0 0 13.26 24a6.06 6.06 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.06 6.06 0 0 0-.75-7.08zm-9.02 12.61a4.48 4.48 0 0 1-2.88-1.04l.14-.08 4.78-2.76a.8.8 0 0 0 .39-.68v-6.74l2.02 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.49 4.5zm-9.66-4.13a4.47 4.47 0 0 1-.54-3.01l.14.08 4.79 2.76a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 19.95a4.5 4.5 0 0 1-6.14-1.65zM2.34 7.9a4.49 4.49 0 0 1 2.37-1.98v5.68a.77.77 0 0 0 .38.68l5.82 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.9zm16.1 3.85-5.84-3.37 2.02-1.17a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.68 8.1v-5.67a.79.79 0 0 0-.4-.68zm2.01-3.02-.14-.08-4.78-2.79a.78.78 0 0 0-.78 0L8.81 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.14-2.02-1.17a.08.08 0 0 1-.04-.05V6.06a4.5 4.5 0 0 1 7.38-3.45l-.14.08-4.79 2.76a.8.8 0 0 0-.39.68zm1.1-2.37 2.6-1.5 2.6 1.5v3l-2.6 1.5-2.6-1.5z"/>
    </svg>
  );
}

// 2. Google Gemini Logo
export function GeminiLogo({ size = 18, color = "#1a73e8" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 0C12 6.627 6.627 12 0 12c6.627 0 12 5.373 12 12 0-6.627 5.373-12 12-12-6.627 0-12-5.373-12-12z" />
    </svg>
  );
}

// 3. Anthropic Claude Logo
export function ClaudeLogo({ size = 18, color = "#d97706" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M13.8 2.5h-3.6v6.8L5.3 4.4 2.8 6.9l4.9 4.9H1v3.6h6.7l-4.9 4.9 2.5 2.5 4.9-4.9v6.8h3.6v-6.8l4.9 4.9 2.5-2.5-4.9-4.9H23v-3.6h-6.7l4.9-4.9-2.5-2.5-4.9 4.9V2.5z" />
    </svg>
  );
}

// 4. Meta Llama Logo
export function LlamaLogo({ size = 18, color = "#8b5cf6" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M12 6.5C8.8 6.5 6.2 8.7 5.1 11.7 4.2 9.5 2.4 8 0 8v3.5c1.8 0 3.3 1.3 3.9 3.1.6 1.8 2.2 3.4 4.5 3.4 3.2 0 5.8-2.2 6.9-5.2.9 2.2 2.7 3.7 5.1 3.7V14.5c-1.8 0-3.3-1.3-3.9-3.1-.6-1.8-2.2-3.4-4.5-3.4zm0 2.5c1.7 0 3 1.1 3.5 2.7-.8 2.1-2.6 3.8-5 3.8-1.7 0-3-1.1-3.5-2.7.8-2.1 2.6-3.8 5-3.8z" />
    </svg>
  );
}

// 5. DeepSeek Logo
export function DeepSeekLogo({ size = 18, color = "#0ea5e9" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M21.5 12c0-4.5-3.5-8.5-8.5-8.5C7.5 3.5 3 7.5 3 12c0 2.2.9 4.2 2.3 5.7L4 21l4.2-1.1c1.4.7 3.1 1.1 4.8 1.1 5 0 8.5-4 8.5-9zm-9 6c-1.4 0-2.8-.4-4-.1l-1.8.5.5-1.7C6.4 15.6 6 14.1 6 12.5 6 8.9 8.7 6 12.5 6S19 8.9 19 12.5 16.3 18 12.5 18zm-.5-8c-.8 0-1.5.7-1.5 1.5S11.2 13 12 13s1.5-.7 1.5-1.5S12.8 10 12 10z" />
    </svg>
  );
}

// 6. Mistral AI Logo
export function MistralLogo({ size = 18, color = "#f43f5e" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M2 3h4v4H2zm16 0h4v4h-4zm-8 4h4v4h-4zM2 11h4v4H2zm8 0h4v4h-4zm8 0h4v4h-4zM2 19h8v2H2zm12 0h8v2h-8z" />
    </svg>
  );
}

// 7. NVIDIA Nemotron Logo (Official NVIDIA Claw Logo in #76b900)
export function NvidiaNemotronLogo({ size = 20, color = "#76b900" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <path d="M8.94 4.5c-3.1 0-5.6 2.5-5.6 5.6 0 1.9.9 3.5 2.3 4.5-.3-.7-.5-1.5-.5-2.3 0-2.4 1.9-4.3 4.3-4.3 1.8 0 3.3 1.1 4 2.6-.5-.3-1.1-.5-1.7-.5-1.8 0-3.3 1.5-3.3 3.3 0 .8.3 1.6.8 2.2-.2 0-.4.1-.6.1-3 0-5.5-2.5-5.5-5.5 0-3.3 2.7-6 6-6 2.4 0 4.5 1.4 5.4 3.5-.8-.8-1.9-1.3-3.1-1.3-.1 0-.2 0-.2-.1v-1.3c2.7.2 4.9 2.1 5.4 4.8.9-1.7 1.4-3.6 1.4-5.6C19.84 4.5 14.94 0 8.94 0 4 0 0 4 0 8.94c0 4.2 2.9 7.7 6.8 8.7-.3-.6-.5-1.4-.5-2.2 0-2.2 1.8-4 4-4 1.1 0 2.1.4 2.8 1.2-.5-.3-1.1-.5-1.7-.5-1.4 0-2.6 1.2-2.6 2.6 0 .9.5 1.7 1.2 2.2-.1 0-.3.1-.4.1-1.9 0-3.5-1.6-3.5-3.5 0-2.2 1.8-4 4-4 1.8 0 3.3 1.2 3.8 2.8-.7-.6-1.6-1-2.6-1-.2 0-.3 0-.4-.1v-.8c2 .2 3.7 1.5 4.3 3.4.5-1.2.8-2.5.8-3.9 0-4.9-4-8.9-8.9-8.9z" />
    </svg>
  );
}

// 8. OX Alpha Logo
export function OxAlphaLogo({ size = 18, color = "#ec4899" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ display: 'inline-block', verticalAlign: 'middle' }}>
      <circle cx="12" cy="12" r="3"/>
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)" fill="none" stroke={color} strokeWidth="1.8"/>
      <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" fill="none" stroke={color} strokeWidth="1.8"/>
    </svg>
  );
}

// List of Canonical AI Models
export const AI_MODELS_LIST = [
  { id: 'gpt', name: 'GPT', color: '#10a37f', LogoComponent: GptLogo },
  { id: 'gemini', name: 'Gemini', color: '#1a73e8', LogoComponent: GeminiLogo },
  { id: 'claude', name: 'Claude', color: '#d97706', LogoComponent: ClaudeLogo },
  { id: 'llama', name: 'Llama', color: '#8b5cf6', LogoComponent: LlamaLogo },
  { id: 'deepseek', name: 'DeepSeek', color: '#0ea5e9', LogoComponent: DeepSeekLogo },
  { id: 'mistral', name: 'Mistral', color: '#f43f5e', LogoComponent: MistralLogo },
  { id: 'nemotron', name: 'NVIDIA Nemotron', color: '#76b900', LogoComponent: NvidiaNemotronLogo, isNvidia: true },
  { id: 'oxalfa', name: 'OX Alpha', color: '#ec4899', LogoComponent: OxAlphaLogo }
];

// Detailed Model Metrics Data mapped directly from active project benchmarks
export const MODEL_METRICS_DATA = [
  {
    id: 'gpt',
    name: 'GPT',
    badge: 'OpenAI Frontier',
    color: '#10a37f',
    LogoComponent: GptLogo,
    accuracy: '92.0',
    performanceScore: '94.5',
    latency: '16.9 ms',
    efficiency: '88.4',
    improvement: '+6.6%',
    currentGeneration: 'Gen 08',
    peakScore: '94.5'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    badge: 'Google Frontier',
    color: '#1a73e8',
    LogoComponent: GeminiLogo,
    accuracy: '91.5',
    performanceScore: '93.2',
    latency: '12.8 ms',
    efficiency: '90.1',
    improvement: '+6.9%',
    currentGeneration: 'Gen 08',
    peakScore: '93.2'
  },
  {
    id: 'claude',
    name: 'Claude',
    badge: 'Anthropic Frontier',
    color: '#d97706',
    LogoComponent: ClaudeLogo,
    accuracy: '92.0',
    performanceScore: '95.1',
    latency: '19.4 ms',
    efficiency: '87.1',
    improvement: '+6.2%',
    currentGeneration: 'Gen 08',
    peakScore: '95.1'
  },
  {
    id: 'llama',
    name: 'Llama',
    badge: 'Meta Open-Weight',
    color: '#8b5cf6',
    LogoComponent: LlamaLogo,
    accuracy: '84.0',
    performanceScore: '86.8',
    latency: '10.6 ms',
    efficiency: '87.2',
    improvement: '+8.5%',
    currentGeneration: 'Gen 08',
    peakScore: '87.0'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    badge: 'Reasoning & Code',
    color: '#0ea5e9',
    LogoComponent: DeepSeekLogo,
    accuracy: '89.7',
    performanceScore: '92.2',
    latency: '15.1 ms',
    efficiency: '88.0',
    improvement: '+8.8%',
    currentGeneration: 'Gen 08',
    peakScore: '93.0'
  },
  {
    id: 'mistral',
    name: 'Mistral',
    badge: 'High-Efficiency',
    color: '#f43f5e',
    LogoComponent: MistralLogo,
    accuracy: '82.4',
    performanceScore: '86.5',
    latency: '9.2 ms',
    efficiency: '86.9',
    improvement: '+9.6%',
    currentGeneration: 'Gen 08',
    peakScore: '86.5'
  },
  {
    id: 'nemotron',
    name: 'NVIDIA Nemotron',
    badge: 'Enterprise Reasoning',
    color: '#76b900',
    LogoComponent: NvidiaNemotronLogo,
    isNvidia: true,
    accuracy: '85.1',
    performanceScore: '88.2',
    latency: '12.0 ms',
    efficiency: '87.0',
    improvement: '+8.4%',
    currentGeneration: 'Gen 08',
    peakScore: '88.2'
  },
  {
    id: 'oxalfa',
    name: 'OX Alpha',
    badge: 'Academic Prototype',
    color: '#ec4899',
    LogoComponent: OxAlphaLogo,
    accuracy: '77.2',
    performanceScore: '80.2',
    latency: '15.8 ms',
    efficiency: '80.8',
    improvement: '+8.4%',
    currentGeneration: 'Gen 08',
    peakScore: '80.2'
  }
];
