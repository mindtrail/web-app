import { cn } from '@/lib/utils'
import * as React from 'react'

type TypographyProps = {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'p'
    | 'strong'
    | 'small'
    | 'small-semi'
    | 'text-lg'
    | 'text-lg-semi'
} & React.HTMLAttributes<HTMLElement>

export const Typography = React.forwardRef<HTMLHeadingElement, TypographyProps>(
  function Typography({ variant = 'p', className, ...props }, ref) {
    const Component =
      {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        h4: 'h4',
        h5: 'h5',
        p: 'p',
        strong: 'strong',
        small: 'span', // Note: 'small' is a valid HTML element, but might not suit your design system if custom styling is expected
        'small-semi': 'span', // Assuming 'small-semi' should be rendered in a 'span'
        'text-lg': 'span', // Assuming 'text-lg' should be rendered in a 'span'; adjust as needed
        'text-lg-semi': 'span', // Assuming 'text-lg' should be rendered in a 'span'; adjust as needed
      }[variant] || 'p'

    return (
      <Component
        // @ts-ignore
        ref={ref}
        className={cn(
          'text-foreground/70',
          {
            'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl':
              variant === 'h1',
            'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0':
              variant === 'h2',
            'scroll-m-20 text-2xl font-semibold tracking-tight': variant === 'h3',
            'scroll-m-20 text-xl font-semibold tracking-tight': variant === 'h4',
            'scroll-m-20 text-l font-semibold tracking-tight': variant === 'h5',
            'leading-none': variant === 'p',
            'text-sm leading-none': variant === 'small',
            'text-sm font-medium leading-none': variant === 'small-semi',
            'text-lg': variant === 'text-lg',
            'text-lg font-semibold': variant === 'text-lg-semi',
            'font-semibold': variant === 'strong',
          },
          className,
        )}
        {...props}
      />
    )
  },
)
