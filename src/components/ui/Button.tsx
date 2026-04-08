'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-bolivian-red text-white hover:bg-red-700 focus:ring-bolivian-red shadow-lg hover:shadow-xl',
        secondary:
          'bg-bolivian-yellow text-charcoal hover:bg-yellow-300 focus:ring-bolivian-yellow shadow-md hover:shadow-lg',
        outline:
          'border-2 border-bolivian-red text-bolivian-red hover:bg-bolivian-red hover:text-white focus:ring-bolivian-red',
        ghost:
          'text-foreground hover:bg-bolivian-red/10 focus:ring-bolivian-red',
        white:
          'bg-white text-bolivian-red hover:bg-off-white focus:ring-white shadow-lg',
      },
      size: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends HTMLMotionProps<'button'>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  children,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      className={cn(buttonVariants({ variant, size, className }))}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
