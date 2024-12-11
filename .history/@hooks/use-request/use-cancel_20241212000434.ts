import { useRef } from "react";

const useCancelRequestPlugin =() => {
  const abortControllerRef = useRef<AbortController | null>(null);

  return {
    onBeforeRequest: async ({prevParams}:any) => {
      // 每次请求前创建新的 AbortController 实例
      abortControllerRef.current = new AbortController();
      return {
        params: [
          ...(prevParams || []),
          { signal: abortControllerRef.current.signal }, // 将信号传递给请求
        ],
      };
    },
    onFinally: () => {
      // 请求完成后清理控制器
      if (abortControllerRef.current) {
        abortControllerRef.current = null;
      }
    },
    cancel: () => {
      // 调用控制器的 abort 方法
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        console.log("Request canceled.");
      }
    },
  };
};

export default useCancelRequestPlugin;
