"use client";

export default function RadarSweep() {
  return (
    <div
      className="absolute z-[900] pointer-events-none"
      style={{
        top: "8%",
        left: "55%",
        width: 320,
        height: 320,
        transform: "translate(-50%, -50%)",
      }}
    >
      <svg viewBox="-160 -160 320 320" className="w-full h-full">
        <defs>
          <radialGradient id="sweepGrad" cx="0" cy="0" r="1">
            <stop offset="0%" stopColor="#00D9FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Range rings */}
        {[60, 120, 160].map((r) => (
          <circle
            key={r}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke="#2A2D33"
            strokeWidth="0.5"
          />
        ))}

        {/* Crosshairs */}
        <line x1="-160" y1="0" x2="160" y2="0" stroke="#2A2D33" strokeWidth="0.5" />
        <line x1="0" y1="-160" x2="0" y2="160" stroke="#2A2D33" strokeWidth="0.5" />

        {/* Rotating sweep */}
        <g className="radar-sweep">
          <path
            d="M 0 0 L 160 0 A 160 160 0 0 1 113 113 Z"
            fill="url(#sweepGrad)"
          />
          <line
            x1="0"
            y1="0"
            x2="160"
            y2="0"
            stroke="#00D9FF"
            strokeWidth="0.8"
            strokeOpacity="0.9"
          />
        </g>

        {/* Center */}
        <circle cx="0" cy="0" r="3" fill="#00D9FF" />
      </svg>
    </div>
  );
}
