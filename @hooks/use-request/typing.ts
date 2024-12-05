import { CacheType } from '@utils/cache';




export type Service<TData, TParams> = (args: TParams) => Promise<TData>;

/**
 * 插件类型
 */
export type Plugin<TData, TParams> = {
  onBefore?: (data: TData, params: TParams) => Promise<{ params?: TParams; data?: TData } | void>;
  onRequest?: (params: TParams) => Service<TData, TParams>;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
};

export type RequestProps<TData, TParams> = {
  manual?: boolean;
  cacheKey?: string;
  defaultParams?: TParams;
  refreshDestroy?: boolean;
  loadingThreshold?: number;
  cacheExpiration?: number;
  cacheType?: CacheType;
  onSuccess?: (data: TData) => void;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
};



export type Result<TData, TParams> ={
 data: TData | null;
 loading:boolean,
 refresh: (params?:TParams)=>Promise<void>,
 run: (params?:TParams)=>Promise<void>
}