import React from 'react';

/**
 * Simple shared button component with sensible defaults for both light/dark modes.
 * Props:
 *  - children: inner content
 *  - variant: "primary" | "secondary" | "ghost" (default primary)
 *  - className: additional tailwind classes
 *  - rest: any other button props (onClick, disabled, etc.)
 */
export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent';

  const variants = {
    primary:
      'bg-brand-accent text-white hover:bg-blue-600 dark:bg-brand-accent dark:hover:bg-blue-700',
    secondary:
      'bg-gray-100 text-slate-900 hover:bg-gray-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700',
    ghost:
      'bg-transparent text-slate-900 hover:bg-gray-100 dark:text-white dark:hover:bg-slate-800',
  };

  const disabled = 'disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      className={`${base} ${variants[variant] || variants.primary} ${disabled} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
