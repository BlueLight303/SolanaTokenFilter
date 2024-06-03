import { useCallback, useEffect, useRef } from "react";

const useDelay = () => {
  const timeoutRef = useRef(null);

  const delay = useCallback((ms) => {
    return new Promise((resolve) => {
      timeoutRef.current = setTimeout(resolve, ms);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return delay;
};

export default useDelay;
