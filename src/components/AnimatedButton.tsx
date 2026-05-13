'use client';
import React, { type CSSProperties } from 'react';
import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps & {
    children?: React.ReactNode;
    shimmerColor?: string;
    shimmerSize?: string;
    borderRadius?: string;
    shimmerDuration?: string;
    background?: string;
  };

export default function AnimatedButton({
  children,
  className,
  shimmerColor = '#ffffff',
  shimmerSize = '0.05em',
  shimmerDuration = '3s',
  borderRadius = '8px',
  background = 'var(--brand)',
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={
        {
          '--spread': '90deg',
          '--shimmer-color': shimmerColor,
          '--radius': borderRadius,
          '--speed': shimmerDuration,
          '--cut': shimmerSize,
          '--bg': background,
        } as CSSProperties
      }
      className={cn(
        'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden',
        '[border-radius:var(--radius)] border border-white/10',
        'px-6 py-3 whitespace-nowrap text-white text-sm font-semibold uppercase tracking-wider',
        '[background:var(--bg)]',
        'transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px',
        className,
      )}
      {...props}
    >
      {/* Shimmer spark container */}
      <div
        className={cn(
          '-z-30 blur-[2px]',
          '@container-[size] absolute inset-0 overflow-visible',
        )}
      >
        <div className="group-hover:animate-shimmer-slide absolute inset-0 aspect-[1] h-[100cqh] rounded-none [mask:none] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="group-hover:animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
        </div>
      </div>

      {/* Children sit above effects */}
      <span className="relative z-10">{children}</span>

      {/* Inner highlight */}
      <div
        className={cn(
          'absolute inset-0 size-full',
          '[border-radius:var(--radius)] px-4 py-1.5 shadow-[inset_0_-8px_10px_#ffffff1f]',
          'transform-gpu transition-all duration-300 ease-in-out',
          'group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]',
          'group-active:shadow-[inset_0_-10px_10px_#ffffff3f]',
        )}
      />

      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-[var(--cut)] -z-20 [border-radius:var(--radius)] [background:var(--bg)]',
        )}
      />
    </motion.button>
  );
}
