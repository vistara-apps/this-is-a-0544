import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Button Component
 * Implements the design system button variants as specified in the PRD
 */
const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled,
  loading,
  ...props 
}, ref) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-md font-medium 
    transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:pointer-events-none disabled:opacity-50
  `

  const variants = {
    primary: `
      bg-primary text-white hover:bg-primary/90 
      focus-visible:ring-primary shadow-sm
    `,
    secondary: `
      bg-surface text-foreground border border-muted/20 
      hover:bg-muted/10 focus-visible:ring-primary
    `,
    outline: `
      border border-primary text-primary bg-transparent 
      hover:bg-primary hover:text-white focus-visible:ring-primary
    `,
    destructive: `
      bg-red-500 text-white hover:bg-red-600 
      focus-visible:ring-red-500 shadow-sm
    `,
    ghost: `
      text-foreground hover:bg-muted/10 
      focus-visible:ring-primary
    `
  }

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
    icon: 'h-10 w-10'
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-2 h-4 w-4" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
