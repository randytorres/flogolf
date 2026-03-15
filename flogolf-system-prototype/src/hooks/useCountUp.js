import { useState, useEffect, useRef } from 'react';

export function useCountUp(end, duration = 1500, startOnMount = true) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const frameRef = useRef();
  const startTimeRef = useRef();

  const start = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setCount(0);
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        setIsAnimating(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (startOnMount) {
      start();
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [end, duration, startOnMount]);

  return { count, isAnimating, start };
}

export function useCountUpCurrency(end, duration = 1500, prefix = '$', startOnMount = true) {
  const { count, isAnimating, start } = useCountUp(end, duration, startOnMount);
  
  const formatted = `${prefix}${count.toLocaleString()}`;
  
  return { count, formatted, isAnimating, start };
}
