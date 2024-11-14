import { useEffect, useState } from "react";

type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;


type Options<TData, TParams extends any[]> = {
  manual?: boolean;
  defaultParams?: TParams;
  onSuccess?: (data: TData) => void;
  onError?: (params: TParams,error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
}

/**
 * 插件类型
 */
type Plugin<TData, TParams extends any[]> = {
  onBefore?: (data:TData,params: TParams) => void;
  onRequest?: (params: TParams) => Service<TData, TParams>;
  onError?: (params: TParams,error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
}

type RequestProps<TData, TParams extends any[]> = {
  service: Service<TData, TParams>;
  options?: Options<TData, TParams>;
  plugins?: Array<Plugin<TData, TParams>>
}


function useRequest<TData, TParams extends any[]>(props: RequestProps<TData, TParams>) { 
  const { service,  options={} } = props;
  const { manual=false, defaultParams } = options;
  const [data, setData] = useState<TData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>();
 

  //实现请求 
  const run = async (...args: TParams) => {
    let data = null;
    let error = null;
    setLoading(true);
    const newArgs =args||defaultParams;

    try {
      data = await service(...newArgs);

      setData(data)
      options?.onSuccess?.(data)

      return data;
    } catch (e: any) { 
      error = e
      setError(error)
      options?.onError?.(newArgs,error)
    } finally {
      setLoading(false);
      options?.onFinally?.(newArgs, data as TData, error)
    }
  }

  useEffect(() => {
    if (manual) {
      // @ts-ignore
      run?.([])
    }
   }, [manual])
  
  return { data, loading,run, error  }
}
 
export  default useRequest;