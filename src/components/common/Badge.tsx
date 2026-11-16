import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    success: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
    danger: 'bg-rose-950/60 text-rose-400 border-rose-800/60',
    warning: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    info: 'bg-sky-950/60 text-sky-400 border-sky-800/60',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1 font-medium',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
