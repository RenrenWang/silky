import { useEffect, useRef, useState } from 'react';
import useCache from '../useCache';

type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;

/**
 * 插件类型
 */
// type Plugin<TData, TParams extends any[]> = {
//   onBefore?: (data: TData, params: TParams) => void;
//   onRequest?: (params: TParams) => Service<TData, TParams>;
//   onError?: (params: TParams, error: Error) => void;
//   onFinally?: (params: TParams, data?: TData, e?: Error) => void;
//   onCancel?: () => void;
// };

type RequestProps<TData, TParams extends any[]> = {
  manual?: boolean;
  cacheKey?: string;
  defaultParams?: TParams;
  onSuccess?: (data: TData) => void;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
};



function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  props?: RequestProps<TData, TParams>,
  plugins?:Array<any>
) {
  const { onSuccess, cacheKey, manual = false, defaultParams, onError, onFinally } = props || {};
  const [data, setData] = useState<TData | null>();
  const [loading, setLoading] = useState(false);
  const lastParams = useRef<TParams>();
  const { get, set } = useCache();
  const pluginsActions=plugins?.map((plugin)=>plugin?.())

 
  //实现请求
  const request = async (...args: TParams) => {
    let data = null;
    let error = null;
    setLoading(true);
    const newArgs = args || defaultParams;

    try {
      if (cacheKey && get(cacheKey)) {
        data = get(cacheKey);
        setData(data);
        onSuccess?.(data);
        return Promise.resolve(data);
      }
      
      lastParams.current = newArgs;

      if(pluginsActions){
        pluginsActions.reduce((action)=>{
         action?.onBefore?.(newArgs)
        },null);
      }

      data = await service(...newArgs);
      setData(data);
      onSuccess?.(data);
      if (cacheKey) {
        set(cacheKey, data);
      }
      return Promise.resolve(data);
    } catch (e: any) {
      error = e;
      setData(null);
      onError?.(newArgs, e);
      return Promise.reject(e);
    } finally {
      setLoading(false);
      onFinally?.(newArgs, data as TData, error);
    }
  };

  const run = async (...args: TParams) => {
    return request(...args);
  };

  const runSync = async (...args: TParams) => {
    return await request(...args)
      .then((res) => res)
      .catch((e) => e);
  };

  const refresh = () => {
    return runSync(...((lastParams.current || []) as TParams));
  };

  useEffect(() => {
    if (manual) {
      // @ts-ignore
      run?.();
    }
  }, [manual]);

  return { data, loading, refresh, runSync, run };
}

export default useRequest;
