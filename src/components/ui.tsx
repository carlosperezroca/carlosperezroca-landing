import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

export function Card({
  className = '',
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-3xl border border-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardContent({
  className = '',
  children,
}: PropsWithChildren<{ className?: string }>) {
  return <div className={className}>{children}</div>;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'secondary';
};

export function Button({
  className = '',
  variant = 'default',
  children,
  type = 'button',
  ...props
}: PropsWithChildren<ButtonProps>) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 font-medium';
  const styles = {
    default: 'bg-white text-black hover:bg-white/90',
    outline: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
    secondary:
      'bg-white/10 text-white hover:bg-white/15 border border-white/10',
  };

  return (
    <button
      type={type}
      className={`${base} ${styles[variant] || styles.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
