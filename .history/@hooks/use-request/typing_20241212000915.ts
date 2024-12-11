import { CacheType } from "./cache";

export type Service<D, P extends any[]> = (...args: P) => Promise<D>;

export type RequestProps<D, P> = {
  auto?: boolean;
  cacheKey?: string;
  refreshDestroy?: boolean;
  loadingDelay?: number;
  cacheExpiration?: number;
  throttleTime?: number;
  debounceTime?: number;
  retryInterval?: number;
  retry?: boolean;
  maxRetries?: number;
  params?: P;
  cacheType?: CacheType;
  onSuccess?: (data: D) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
};

export type Result<D, P extends any[]> = {
  data: D | null;
  loading: boolean;
  refresh: (...params: P) => Promise<void>;
  run: (...params: P) => Promise<void>;
};

// export type ServiceResult<T> = {
//   code: number | string;
//   success?: boolean;
//   data: T;
//   message?: string;
// };
export type RequestPluginProps<D,P=any> = {
  options: RequestProps<D, P>;
  onChangeLoading: (loading:boolean)=>void;
}

export interface RequestPluginReturn<D=any, P=any>{
    onBeforeRequest?: ({
    prevResult,
    prevParams
  }: {
    prevResult?: D|null;
    prevParams?:P
  }) => {
    params?: P;
    response?: D;
    returnStop?: boolean;
  }|Promise<{
    params?: P;
    response?: D;
    returnStop?: boolean;
  }> | void;
  onSuccess?: (response: D, config: P) => D | Promise<D> | void;
  onError?: (error: any, config: P,request:(params: P) =>  D | Promise<D|undefined> | void) => void;
  onFinally?: () =>void;
  cancel?: () => void;
}

export type  RequestPlugin<D,P extends any[]>=(props:RequestPluginProps<D, P>)=>RequestPluginReturn<D, P>;