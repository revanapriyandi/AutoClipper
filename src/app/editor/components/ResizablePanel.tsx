import React, { useRef, useEffect, useState } from 'react';

interface PanelGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  initialSizes?: number[]; // Percentages
}

export function ResizablePanelGroup({ children, direction = 'horizontal', className = '', initialSizes }: PanelGroupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<number[]>([]);
  const childrenArray = React.Children.toArray(children);
  const [isDragging, setIsDragging] = useState<number | null>(null);

  useEffect(() => {
    if (initialSizes && initialSizes.length === childrenArray.length) {
      setSizes(initialSizes);
    } else {
      const equalSize = 100 / childrenArray.length;
      setSizes(childrenArray.map(() => equalSize));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childrenArray.length]);

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(index);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging === null || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const totalSize = direction === 'horizontal' ? containerRect.width : containerRect.height;

    // Calculate new position as percentage
    const pos = direction === 'horizontal' ? e.clientX - containerRect.left : e.clientY - containerRect.top;
    let newPercentage = (pos / totalSize) * 100;

    // Constrain percentages
    newPercentage = Math.max(10, Math.min(newPercentage, 90));

    const currentTotal = sizes.slice(0, isDragging).reduce((a, b) => a + b, 0);
    const newLeftSize = newPercentage - currentTotal;

    setSizes(prev => {
        const next = [...prev];
        const oldLeftSize = next[isDragging];
        const oldRightSize = next[isDragging + 1];

        const delta = newLeftSize - oldLeftSize;

        if (oldRightSize - delta > 10 && newLeftSize > 10) {
           next[isDragging] = newLeftSize;
           next[isDragging + 1] = oldRightSize - delta;
        }
        return next;
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging !== null) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(null);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} w-full h-full ${className}`}
      onPointerMove={isDragging !== null ? handlePointerMove : undefined}
      onPointerUp={isDragging !== null ? handlePointerUp : undefined}
      onPointerLeave={isDragging !== null ? handlePointerUp : undefined}
    >
      {childrenArray.map((child, index) => {
        const size = sizes[index] || (100 / childrenArray.length);
        const isLast = index === childrenArray.length - 1;

        return (
          <React.Fragment key={index}>
            <div
               style={{
                  [direction === 'horizontal' ? 'width' : 'height']: `${size}%`,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
               }}
            >
              {child}
            </div>
            {!isLast && (
              <div
                className={`flex items-center justify-center bg-[#252525] hover:bg-primary/50 transition-colors z-50
                  ${direction === 'horizontal' ? 'w-1.5 cursor-col-resize h-full' : 'h-1.5 cursor-row-resize w-full'}
                  ${isDragging === index ? 'bg-primary' : ''}
                `}
                onPointerDown={(e) => handlePointerDown(index, e)}
              >
                <div className={`rounded-full bg-white/20 ${direction === 'horizontal' ? 'h-4 w-0.5' : 'w-4 h-0.5'}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
