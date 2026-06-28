import { useEffect, useRef, useState } from 'react';

export const usePullToRefresh = (onRefresh: () => void, threshold = 80) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef(0);
  const [isPulling, setIsPulling] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (event: TouchEvent) => {
      if (el.scrollTop <= 0) {
        startY.current = event.touches[0].clientY;
      }
    };

    const onTouchMove = (event: TouchEvent) => {
      if (el.scrollTop > 0) return;
      const delta = event.touches[0].clientY - startY.current;
      if (delta > threshold) {
        setIsPulling(true);
      }
    };

    const onTouchEnd = () => {
      if (isPulling) {
        onRefresh();
      }
      setIsPulling(false);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [isPulling, onRefresh, threshold]);

  return { containerRef, isPulling };
};
