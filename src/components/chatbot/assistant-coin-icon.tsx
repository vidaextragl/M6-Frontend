interface AssistantCoinIconProps {
  className?: string;
}

export function AssistantCoinIcon({ className }: AssistantCoinIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M24 11 32 4l8 7"
        fill="none"
        stroke="#F5B82E"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="32"
        cy="37"
        r="24"
        fill="#111827"
        stroke="#F5B82E"
        strokeWidth="5"
      />
      <circle cx="25" cy="36" r="3" fill="#62E6B7" />
      <circle cx="39" cy="36" r="3" fill="#62E6B7" />
    </svg>
  );
}
