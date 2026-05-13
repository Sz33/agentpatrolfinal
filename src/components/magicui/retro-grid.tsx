'use client';
import { cn } from '@/lib/utils';

interface RetroGridProps {
  className?: string;
  angle?: number;
  cellSize?: number;
  opacity?: number;
  lightLineColor?: string;
  darkLineColor?: string;
}

export function RetroGrid({
  className,
  angle = 65,
  cellSize = 60,
  opacity = 0.5,
  lightLineColor = 'gray',
  darkLineColor = 'gray',
}: RetroGridProps) {
  const gridStyles = {
    '--grid-angle': `${angle}deg`,
    '--cell-size': `${cellSize}px`,
    '--opacity': opacity,
    '--light-line': lightLineColor,
    '--dark-line': darkLineColor,
  } as React.CSSProperties;

  return (
    <div
      className={cn(
        'pointer-events-none absolute size-full overflow-hidden [perspective:200px]',
        className,
      )}
      style={gridStyles}
    >
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className="animate-grid [background-image:linear-gradient(to_right,var(--grid-line-color)_1px,transparent_0),linear-gradient(to_bottom,var(--grid-line-color)_1px,transparent_0)] [background-size:var(--cell-size)_var(--cell-size)] [border:none] [height:300vh] [margin-left:-200%] [width:600%] [transform-origin:100%_0_0]"
          style={
            { '--grid-line-color': lightLineColor } as React.CSSProperties
          }
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black" />
    </div>
  );
}
