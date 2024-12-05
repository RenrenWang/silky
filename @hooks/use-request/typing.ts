import { CacheType } from '@/@utils/cache';

export type Service<TData, TParams extends any[]> = (...args: TParams) => Promise<TData>;

/**
 * 插件类型
 */
export type Plugin<TData, TParams extends any[]> = {
  onBefore?: (data: TData, params: TParams) => Promise<{ params?: TParams; data?: TData } | void>;
  onRequest?: (params: TParams) => Service<TData, TParams>;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
  onCancel?: () => void;
};

export type RequestProps<TData, TParams extends any[]> = {
  manual?: boolean;
  cacheKey?: string;
  defaultParams?: TParams;
  refreshDestroy?: boolean;
  loadingThreshold?: number;
  cacheType?: CacheType;
  onSuccess?: (data: TData) => void;
  onError?: (params: TParams, error: Error) => void;
  onFinally?: (params: TParams, data?: TData, e?: Error) => void;
};
