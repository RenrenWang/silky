import { useEffect, useRef, useState } from 'react';
import { RequestProps, Service } from './typing';
import useCache from './use-cache';
import useLoading from './use-loading';

function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  props?: RequestProps<TData, TParams>,
) {
  const { manual = true, loadingThreshold, cacheKey, cacheType } = props || {};
  const [data, setData] = useState<TData>();
  const lastParams = useRef<TParams>();
  const { get, set } = useCache({ key: cacheKey, type: cacheType });
  const { loading, service: newService } = useLoading(service, loadingThreshold);

  // before request
  const onBefore = async (args: TParams, data?: TData): Promise<{ params?: TParams; data?: TData | null }> => {
    const cacheData = get();

    return { params: args, data: (cacheData as TData) || data };
  };

  // afterRequest
  const onAfter = (args: TParams, data: TData) => {
    set(data);
    setData(data);
    lastParams.current = args;
  };

  //
  const onFinally = () => {};

  // 请求
  const request = async (...args: TParams) => {
    try {
      const { params, data } = await onBefore(args);
      if (data) {
        setData(data);
        return data;
      }

      const res = await newService(...(params || args));
      const newResult = onAfter(params || args, res);

      return Promise.resolve(newResult);
    } catch (e) {
      return Promise.reject(e);
    } finally {
      onFinally?.();
    }
  };

  const run = async (...args: TParams) => {
    return await request(...((args || lastParams.current || []) as TParams));
  };

  const refresh = (...args: TParams) => {
    return run(...((args || lastParams.current || []) as TParams));
  };

  useEffect(() => {
    if (!manual) {
      const params = lastParams.current || [];
      run?.(...(params as TParams));
    }
  }, [manual]);

  return { data, loading, refresh, run };
}

export default useRequest;
