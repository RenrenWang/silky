import { useEffect, useState } from "react";

type Service<TData, TParams extends any[]> = (
  ...args: TParams
) => Promise<TData>;

/**
 * 插件类型
 */
type Plugin<TData, TParams extends any[]> = {
  onBefore?: (data: TData, params: TParams) => void;
  onRequest?: (params: TParams) => Service<TData, TParams>;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
};

type RequestProps<TData, TParams extends any[]> = {
  manual?: boolean;
  defaultParams?: TParams;
  onSuccess?: (data: TData) => void;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  plugins?: Array<Plugin<TData, TParams>>;
};

/**
 * @template TData 请求成功时返回的数据类型。
 * @template TParams 服务函数的参数类型。
 * @param {RequestProps<TData, TParams>} props - 请求的属性。
 * @param {Service<TData, TParams>} props.service - 异步请求的服务函数。
 * @param {Options<TData, TParams>} [props.options] - 请求的配置选项。
 * @param {boolean} [props.options.manual=false] - 是否手动触发请求。
 * @param {TParams} [props.options.defaultParams] - 默认的请求参数。
 * @param {(data: TData) => void} [props.options.onSuccess] - 请求成功时的回调函数。
 * @param {(params: TParams, error: Error) => void} [props.options.onError] - 请求失败时的回调函数。
 * @param {(params: TParams, data?: TData, e?: Error) => void} [props.options.onFinally] - 请求结束时的回调函数。
 * @param {Array<Plugin<TData, TParams>>} [props.plugins] - 请求的插件。
 *
 * @returns {Object} 返回一个对象，包含请求的数据、加载状态、请求函数和错误状态。
 * @property {TData} data - 请求返回的数据。
 * @property {boolean} loading - 请求的加载状态。
 * @property {(...args: TParams) => Promise<TData>} run - 手动触发请求的函数。
 * @property {Error} error - 请求的错误状态。
 */
function useRequest<TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  props?: RequestProps<TData, TParams>
) {
  const {
    onSuccess,
    manual = false,
    defaultParams,
    onError,
    onFinally,
  } = props || {};
  const [data, setData] = useState<TData | null>();
  const [loading, setLoading] = useState(false);

  //实现请求
  const request = async (...args: TParams) => {
    let data = null;
    let error = null;
    setLoading(true);
    const newArgs = args || defaultParams;
    
    try {
      data = await service(...newArgs);
      setData(data);
      onSuccess?.(data);
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

  useEffect(() => {
    if (manual) {
      // @ts-ignore
      run?.();
    }
  }, [manual]);

  return { data, loading, runSync, run };
}

export default useRequest;
