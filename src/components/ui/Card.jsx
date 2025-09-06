import React from 'react'
import { cn } from '../../utils/cn'

/**
 * Card Component
 * Implements the design system card variants as specified in the PRD
 */
const Card = React.forwardRef(({ 
  className, 
  variant = 'default',
  ...props 
}, ref) => {
  const baseStyles = `
    rounded-lg border bg-surface text-foreground
    transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)]
  `

  const variants = {
    default: 'border-muted/20 shadow-card',
    elevated: 'border-muted/20 shadow-modal hover:shadow-card'
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Card.displayName = 'Card'

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))

CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))

CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted', className)}
    {...props}
  />
))

CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn('p-6 pt-0', className)} 
    {...props} 
  />
))

CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))

CardFooter.displayName = 'CardFooter'

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent 
}
