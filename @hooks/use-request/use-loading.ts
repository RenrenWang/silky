import { useEffect, useRef, useState } from 'react';
import { Service } from './typing';

const useLoading = <TData, TParams>(service: Service<TData, TParams>, loadingThreshold: number = 0) => {
  const [loading, setLoading] = useState(false);
  const startTime = useRef<number>();
  const requestAnimationFrameRef = useRef<any>();

  const checkLoading = () => {
    if (startTime?.current) {
      const elapsedTime = Date.now() - startTime?.current;

      if (elapsedTime > loadingThreshold) {
        setLoading(true);
        cancelAnimationFrame(requestAnimationFrameRef.current);
      } else {
        requestAnimationFrameRef.current = requestAnimationFrame(checkLoading);
      }
    }
  };

  const clear = () => {
    if (requestAnimationFrameRef.current) {
      cancelAnimationFrame(requestAnimationFrameRef.current);
    }
  };

  useEffect(() => {
    return () => {
      clear();
    };
  }, []);

  const run = async (...args: TParams) => {
    try {
      clear();

      if (loadingThreshold) {
        startTime.current = Date.now();
      } else {
        setLoading(true);
      }

      checkLoading();

      const result = await service(...args);

      return Promise.resolve(result);
    } catch (e) {
      console.log('run service error: ', e);
      return Promise.reject(e);
    } finally {
      clear();

      setLoading(false);
    }
  };

  return { loading, service: run };
};

export default useLoading;
