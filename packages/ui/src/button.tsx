import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from './lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary: Dark Charcoal (Anthropic Near Black)
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-ring-warm hover:shadow-ring-deep',
        // Terracotta Brand accent - only for primary CTAs
        accent: 'bg-terracotta text-ivory hover:bg-terracotta/90 shadow-ring-terracotta',
        // Outline with warm border
        outline: 'border border-border-warm bg-background hover:bg-warm-sand hover:text-charcoal-warm shadow-ring-warm',
        // Warm Sand secondary
        secondary: 'bg-warm-sand text-charcoal-warm hover:bg-warm-sand/80 shadow-ring-warm',
        // Ghost - subtle hover
        ghost: 'hover:bg-warm-sand hover:text-charcoal-warm',
        // Destructive - Error Crimson
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // White Surface button from DESIGN.md
        'white-surface': 'bg-white text-primary hover:bg-warm-sand rounded-xl shadow-whisper',
        // Dark Charcoal inverted
        'dark-charcoal': 'bg-dark-surface text-ivory hover:bg-dark-surface/90 shadow-ring-warm rounded-lg',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-lg',
        sm: 'h-9 px-3 text-xs rounded-md',
        lg: 'h-12 px-8 text-base rounded-xl',
        icon: 'h-10 w-10 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
