import type { PropsWithChildren } from 'react';

function IconBase({
  className = '',
  children,
  viewBox = '0 0 24 24',
}: PropsWithChildren<{ className?: string; viewBox?: string }>) {
  return (
    <svg
      aria-hidden="true"
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

export function SparklesIcon({
  className = 'w-5 h-5',
}: {
  className?: string;
}) {
  return (
    <IconBase className={className}>
      <path d="M12 3l1.3 3.7L17 8l-3.7 1.3L12 13l-1.3-3.7L7 8l3.7-1.3L12 3z" />
      <path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7L19 14z" />
      <path d="M5 14l.9 2.1L8 17l-2.1.9L5 20l-.9-2.1L2 17l2.1-.9L5 14z" />
    </IconBase>
  );
}

export function CodeIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M8 16l-4-4 4-4" />
      <path d="M16 8l4 4-4 4" />
      <path d="M14 4l-4 16" />
    </IconBase>
  );
}

export function ArrowRightIcon({
  className = 'w-4 h-4',
}: {
  className?: string;
}) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </IconBase>
  );
}

export function MailIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </IconBase>
  );
}

export function GamepadIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M6 12h12" />
      <path d="M8 10v4" />
      <path d="M16 11h.01" />
      <path d="M18 13h.01" />
      <path d="M7.5 8h9a4.5 4.5 0 014.4 5.5l-.6 2.5a2.5 2.5 0 01-4 1.4L14.5 16h-5l-1.8 1.4a2.5 2.5 0 01-4-1.4l-.6-2.5A4.5 4.5 0 017.5 8z" />
    </IconBase>
  );
}
