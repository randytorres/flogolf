import { useState, useEffect, useCallback, useRef } from 'react';

export function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasIntersected(true);
        } else {
          setIsIntersecting(false);
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [options]);

  return { ref: elementRef, isIntersecting, hasIntersected };
}

export function useStaggeredAnimation(itemCount, baseDelay = 100) {
  const [visibleItems, setVisibleItems] = useState(new Set());

  useEffect(() => {
    const timers = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, i]));
      }, i * baseDelay);
      timers.push(timer);
    }

    return () => timers.forEach(clearTimeout);
  }, [itemCount, baseDelay]);

  const isVisible = useCallback((index) => visibleItems.has(index), [visibleItems]);

  return { isVisible };
}

export function useAnimatedValue(value, duration = 500) {
  const [displayValue, setDisplayValue] = useState(value);
  const frameRef = useRef();
  const startValueRef = useRef(value);
  const targetValueRef = useRef(value);

  useEffect(() => {
    if (value === targetValueRef.current) return;

    startValueRef.current = displayValue;
    targetValueRef.current = value;

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const current = startValueRef.current + (value - startValueRef.current) * easeOut;
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration, displayValue]);

  return displayValue;
}

export function usePulse(interval = 2000) {
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsPulsing(prev => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return isPulsing;
}
