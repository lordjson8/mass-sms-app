'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const buttonVariants = {
  default: 'bg-blue-600 hover:bg-blue-700 text-white',
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-900',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  ghost: 'hover:bg-gray-100 text-gray-900',
  link: 'text-blue-600 hover:underline',
};

const sizeVariants = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof sizeVariants;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
  { className, variant = 'default', size = 'md', isLoading, disabled, ...props },
  ref
) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        sizeVariants[size],
        className
      )}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        props.children
      )}
    </button>
  );
});

Button.displayName = 'Button';

export { Button };
