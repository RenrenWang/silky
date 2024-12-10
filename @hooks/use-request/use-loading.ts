import { useEffect, useRef } from 'react';
import { RequestPluginProps } from './typing';

const useLoading = <D, P extends any[]>({ options, onChangeLoading }: RequestPluginProps<D, P>) => {
  const { loadingDelay } = options || {};
  const end = useRef(false);
  const timerOut = useRef<any>(undefined);

  useEffect(() => {
    return () => {
      if (timerOut.current) {
        clearTimeout(timerOut.current)
      }
    };
  }, []);

  return {
    onBeforeRequest: () => {
      end.current = false;
      if (timerOut.current) {
        clearTimeout(timerOut.current)
      }
      
      if (loadingDelay) {

        timerOut.current = setTimeout(() => {
          if (!end.current) {
            onChangeLoading(true)
          }

        }, loadingDelay)

      } else {
        onChangeLoading(true)
      }
    },
    onFinally: () => {
      end.current = true;
      if (timerOut.current) {
        clearTimeout(timerOut.current)
      }
  
      onChangeLoading(false);
    },
  }
};

export default useLoading;
