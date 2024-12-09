import { useEffect, useRef, useState } from 'react';
import { RequestPluginProps } from './typing';

const useLoading = <D, P>({ options, onChangeLoading }: RequestPluginProps<D, P>) => {
  const { loadingDelay } = options || {};
  const startTime = useRef<number>();
  const requestAnimationFrameRef = useRef<any>();
  const checkLoading = () => {

    if (startTime?.current) {
      const elapsedTime = Date.now() - startTime?.current;

      if (loadingDelay && elapsedTime > loadingDelay) {
        onChangeLoading(true);
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

  return {
    onBeforeRequest: () => {
      startTime.current = Date.now();
      if (loadingDelay) {
        checkLoading();
      }else{
        onChangeLoading(true)
      }
    },
    onFinally: () => {
      onChangeLoading(false);
      clear();
    },
  }
};

export default useLoading;
