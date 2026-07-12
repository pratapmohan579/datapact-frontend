export function DataPactLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="none"
      className={className}
    >
      {/* Hexagon Shield Outline (Blue) */}
      <path
        d="M 8 4 L 16 4 L 22 12 L 16 20 L 8 20 L 2 12 Z"
        stroke="#2563EB"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      
      {/* Nodes (Purple) */}
      <circle cx="8" cy="4" r="1.5" fill="#7C3AED" />
      <circle cx="16" cy="4" r="1.5" fill="#7C3AED" />
      <circle cx="22" cy="12" r="1.5" fill="#7C3AED" />
      <circle cx="16" cy="20" r="1.5" fill="#7C3AED" />
      <circle cx="8" cy="20" r="1.5" fill="#7C3AED" />
      <circle cx="2" cy="12" r="1.5" fill="#7C3AED" />

      {/* Center Spark/Star (Cyan) */}
      <path
        d="M12 7 L13 11 L17 12 L13 13 L12 17 L11 13 L7 12 L11 11 Z"
        fill="#06B6D4"
      />
    </svg>
  );
}
