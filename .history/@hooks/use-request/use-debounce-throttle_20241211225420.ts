import { useRef } from "react";
import { RequestPluginProps } from "./typing";

 const useDebounceThrottle =<D, P extends any[]>(
    {options:{ throttleTime=0,debounceTime=0 }}: RequestPluginProps<D, P>
) => {
  const lastInvokeTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  return {
    onBeforeRequest: async () => {
      const now = Date.now();

    // 如果启用节流且距离上次调用时间不足 throttleTime，则忽略请求
    if (throttleTime > 0 && now - lastInvokeTimeRef.current < throttleTime) {
      return 
     }

      // 如果启用防抖，延迟请求
      if (debounceTime > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        return new Promise((resolve) => {
          timeoutRef.current = setTimeout(() => {
            lastInvokeTimeRef.current = Date.now();
            resolve({});
          }, debounceTime);
        });
      }
    

      // 更新最后调用时间
      lastInvokeTimeRef.current = now;

      return {};
    },
    onFinally: () => {
      // 清理定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    },
  };
};
export default useDebounceThrottle;