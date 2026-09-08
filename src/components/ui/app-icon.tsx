import type { ReactNode } from 'react';

type AppIconName =
  | 'sun'
  | 'moon'
  | 'bell'
  | 'buy'
  | 'search'
  | 'cashback'
  | 'deposit'
  | 'reward-ticket'
  | 'reward-game'
  | 'reward-gem';

interface AppIconProps {
  name: AppIconName;
}

export function AppIcon({ name }: AppIconProps) {
  const icons: Record<AppIconName, ReactNode> = {
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </>
    ),

    moon: (
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),

    buy: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 6v12M15 8.5h-4.5a2 2 0 0 0 0 4h3a2 2 0 0 1 0 4H9" />
      </>
    ),

    cashback: (
      <>
        <path d="M20 7v5h-5" />
        <path d="M19 12a7 7 0 1 1-2-5" />
        <path d="M12 8v8M9.5 10h3.75a1.75 1.75 0 0 1 0 3.5H10.5" />
      </>
    ),

    deposit: (
      <>
        <path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13" />
        <path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z" />
        <path d="M7 10v5M4.5 12.5h5" />
      </>
    ),

    'reward-ticket': (
      <>
        <path d="M4 6h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4Z" />
        <path d="m9 15 6-6" />
        <circle cx="9" cy="9" r="1" />
        <circle cx="15" cy="15" r="1" />
      </>
    ),

    'reward-game': (
      <>
        <path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6Z" />
        <path d="m13 7-4 6h4l-2 4 5-7h-4Z" />
      </>
    ),

    'reward-gem': (
      <>
        <path d="m3 9 4-5h10l4 5-9 11Z" />
        <path d="m7 4 5 16 5-16M3 9h18" />
      </>
    ),
  };

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}