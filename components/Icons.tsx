type IconProps = { className?: string };

const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true, focusable: false } as const;

export function ArrowRight({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
}

export function ArrowLeft({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
}

export function ArrowDown({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M12 5v14M6 13l6 6 6-6" /></svg>;
}

export function Check({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;
}

export function Plus({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M12 5v14M5 12h14" /></svg>;
}

export function Minus({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M5 12h14" /></svg>;
}

export function Expand({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>;
}

export function Collapse({ className }: IconProps) {
  return <svg {...base} className={className}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" /></svg>;
}

export function Telegram({ className }: IconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" className={className}>
      <path d="M21.4 4.1 2.9 11.2c-1.2.5-1.2 1.2-.2 1.5l4.7 1.5 1.8 5.6c.2.6.1.8.7.8.5 0 .7-.2 1-.5l2.3-2.2 4.8 3.5c.9.5 1.5.2 1.7-.8L22.9 5.6c.3-1.3-.5-1.9-1.5-1.5ZM8.6 13.7l10.1-6.4c.5-.3.9-.1.5.2l-8.2 7.4-.3 3.5-2.1-4.7Z" />
    </svg>
  );
}
