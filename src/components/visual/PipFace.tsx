import React from 'react';
import type { Expression } from '../../data/characters';

// Pip's digital face, drawn over the face screen of pipFull/pipLunar (same 150 × 236 coordinate space).
// If the artists deliver a new Pip, update SCREEN to the outline of the new face screen.
const SCREEN = 'm38 52 57-7 12 10 2 26-12 12-58 4-7-11 1-23z';

function eyes(expression: Expression) {
  switch (expression) {
    case 'curious':
      return <>
        <rect x="48" y="68" width="13" height="10" rx="2"/>
        <rect x="76.5" y="62" width="17" height="18" rx="3"/>
      </>;
    case 'analyzing':
      return <>
        <rect x="47" y="69" width="15" height="4" rx="1"/>
        <rect x="77" y="69" width="15" height="4" rx="1"/>
        <g className="pip-data"><rect x="46" y="82" width="8" height="2"/><rect x="57" y="82" width="14" height="2"/><rect x="74" y="82" width="6" height="2"/><rect x="83" y="82" width="10" height="2"/></g>
        <rect className="pip-scanline" x="42" y="60" width="58" height="2" opacity=".6"/>
      </>;
    case 'scanning':
      return <g className="pip-reticles" fill="none" strokeWidth="2.4">
        <circle cx="55" cy="72" r="6.5"/><circle cx="85" cy="72" r="6.5"/>
        <path d="M55 63v4m0 10v4m-9-9h4m10 0h4M85 63v4m0 10v4m-9-9h4m10 0h4"/>
      </g>;
    case 'deadpan':
      return <>
        <rect x="47" y="71" width="15" height="3.2" rx="1"/>
        <rect x="77" y="71" width="15" height="3.2" rx="1"/>
      </>;
    case 'processing':
    case 'thinking':
      return <g className="pip-dots">
        <circle cx="60" cy="72" r="3.4"/><circle cx="71" cy="72" r="3.4"/><circle cx="82" cy="72" r="3.4"/>
      </g>;
    case 'saving':
      return <>
        <rect x="48" y="67" width="46" height="9" rx="2" fill="none" strokeWidth="2"/>
        <rect className="pip-progress" x="50.5" y="69.5" width="41" height="4" rx="1"/>
        <path d="M66 58h10l3 3v6H63v-9z" fill="none" strokeWidth="1.6"/>
      </>;
    case 'content':
      return <g fill="none" strokeWidth="3" strokeLinecap="round">
        <path d="M48 75q6.5-8 13 0M78 75q6.5-8 13 0"/>
        <path className="pip-smile" d="M64 84q7 4.5 14 0" strokeWidth="2.2"/>
      </g>;
    case 'surprised':
    case 'awed':
      return <><circle cx="55" cy="72" r="7"/><circle cx="85" cy="72" r="7"/></>;
    case 'excited':
      return <>
        <path d="M55 62l2.6 7 7 2.6-7 2.6-2.6 7-2.6-7-7-2.6 7-2.6zM85 62l2.6 7 7 2.6-7 2.6-2.6 7-2.6-7-7-2.6 7-2.6z"/>
        <path className="pip-smile" d="M63 85q7 5 14 0" fill="none" strokeWidth="2.2" strokeLinecap="round"/>
      </>;
    case 'confused':
      return <>
        <rect x="48" y="69" width="13" height="8" rx="2"/>
        <rect x="78" y="62" width="13" height="16" rx="2"/>
        <path d="M66 84q3-3 6 0t6 0" fill="none" strokeWidth="2" strokeLinecap="round"/>
      </>;
    case 'sad':
      return <g fill="none" strokeWidth="3" strokeLinecap="round">
        <path d="M48 70l13 5M91 70l-13 5"/>
        <path d="M51 78h8M81 78h8" strokeWidth="2.4"/>
        <path d="M64 87q7-4 14 0" strokeWidth="2"/>
      </g>;
    case 'smile':
    case 'grin':
    case 'happy':
    case 'laughing':
      return <g fill="none" strokeWidth="3" strokeLinecap="round"><path d="M48 75q6.5-8 13 0M78 75q6.5-8 13 0"/></g>;
    default:
      return <><rect x="48" y="65" width="13" height="14" rx="2"/><rect x="78" y="65" width="13" height="14" rx="2"/></>;
  }
}

/** `fit`: draw only the eyes, stretched to fill the parent box (the face screen of painted Pip art). */
export default function PipFace({ expression = 'neutral', fit = false }: { expression?: Expression; fit?: boolean }) {
  if (fit) {
    return <svg className="pip-face is-fit" viewBox="33 49 76 48" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <g key={expression} className={`pip-expression face-${expression}`} fill="#afe8d1" stroke="#afe8d1">
        {eyes(expression)}
      </g>
    </svg>;
  }
  return <svg className="pip-face" viewBox="0 0 150 236" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    <path d={SCREEN} fill="#284a54" stroke="#263d45" strokeWidth="3" strokeLinejoin="round"/>
    <g key={expression} className={`pip-expression face-${expression}`} transform="rotate(-6 72 70)" fill="#afe8d1" stroke="#afe8d1">
      {eyes(expression)}
    </g>
  </svg>;
}
