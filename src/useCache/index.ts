import { useEffect, useRef } from 'react';

// 定义缓存值的类型，可以根据实际需求修改为更具体的类型
type CacheValue = any;

// 定义自定义设置函数的类型
type CustomSetFunction = (key: string, value: CacheValue, expirationTime?: number) => void;

// 定义自定义获取函数的类型
type CustomGetFunction = (key: string) => CacheValue | undefined;

const useCache = (
  defaultExpirationTime: number = 10 * 1000,
  customSetFunction?: CustomSetFunction,
  customGetFunction?: CustomGetFunction,
): {
  set: CustomSetFunction;
  get: CustomGetFunction;
} => {
  const cacheRef: React.MutableRefObject<{ [key: string]: CacheValue }> = useRef({});
  const expirationTimesRef: React.MutableRefObject<{ [key: string]: number }> = useRef({});

  // 如果用户没有传入自定义设置函数，则使用默认的基于内存的设置函数
  const set: CustomSetFunction =
    customSetFunction ||
    ((key: string, value: CacheValue, expirationTime: number = defaultExpirationTime) => {
      cacheRef.current[key] = value;
      expirationTimesRef.current[key] = Date.now() + expirationTime;
    });

  // 如果用户没有传入自定义获取函数，则使用默认的基于内存的获取函数
  const get: CustomGetFunction =
    customGetFunction ||
    ((key: string) => {
      const expirationTime = expirationTimesRef.current[key];
      if (expirationTime && Date.now() > expirationTime) {
        // 缓存已失效，删除缓存项
        delete cacheRef.current[key];
        delete expirationTimesRef.current[key];
        return undefined;
      }
      return cacheRef.current[key];
    });

  useEffect(() => {
    const checkExpirations = () => {
      const currentTime = Date.now();
      const keysToDelete: string[] = [];
      for (const key in expirationTimesRef.current) {
        if (currentTime > expirationTimesRef.current[key]) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach((key) => {
        delete cacheRef.current[key];
        delete expirationTimesRef.current[key];
      });
    };

    const intervalId = setInterval(checkExpirations, 1000); // 每秒检查一次缓存是否失效

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return {
    set,
    get,
  };
};

export default useCache;
