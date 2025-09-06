import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Input Component
 * Implements the design system input variants as specified in the PRD
 */
const Input = React.forwardRef(({ 
  className, 
  type = 'text',
  variant = 'default',
  error,
  icon: Icon,
  ...props 
}, ref) => {
  const baseStyles = `
    flex h-10 w-full rounded-md border border-muted/20 bg-surface px-3 py-2 
    text-sm ring-offset-bg file:border-0 file:bg-transparent file:text-sm file:font-medium 
    placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 
    focus-visible:ring-primary focus-visible:ring-offset-2 
    disabled:cursor-not-allowed disabled:opacity-50
    transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]
  `

  const variants = {
    default: '',
    withIcon: Icon ? 'pl-10' : ''
  }

  const errorStyles = error ? 'border-red-500 focus-visible:ring-red-500' : ''

  if (Icon) {
    return (
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type={type}
          className={cn(
            baseStyles,
            variants[variant],
            errorStyles,
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }

  return (
    <input
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        errorStyles,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = 'Input'

export { Input }
