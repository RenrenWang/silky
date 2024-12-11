import { useHandlerPlugin } from "./use-handler-plugin";
import { RequestProps, Service } from './typing';
import useLoading from "./use-loading";
import useCache from "./use-cache";
import { useEffect } from "react";
import useDebounceThrottle from "./use-debounce-throttle";
import { useRetryPlugin } from "./use-retry";

function useRequest<D, P extends any[]>(service: Service<D, P>, options?: RequestProps<D, P>) {
  
  const { data, request, loading, prevParamsRef } = useHandlerPlugin<D, P>(service, [  
    useDebounceThrottle,
    useCache,
    useLoading,
    useRetryPlugin
  ], options as RequestProps<D, P>);

  const run = async (...args: P) => {
 
    return await request(args);
  }

  const refresh = async () => {
    return await request(prevParamsRef.current as P);
  }


  useEffect(() => {
    if (options?.auto) {
      // @ts-ignore
      run();
    }
  }, []);

  return {
    run,
    data,
    loading,
    refresh
  };

}

export default useRequest;
