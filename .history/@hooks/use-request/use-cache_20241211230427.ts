import createCache from './cache';
import { useEffect, useMemo } from 'react';
import { RequestPluginProps } from './typing';

const useCache = <D,P extends any[]>(props?: RequestPluginProps<D, P>) => {
  const { cacheKey:key,cacheExpiration, refreshDestroy = false, cacheType:type='localStorage' } = props?.options || {};

  const handle = useMemo(() => {
    if (!key) {
      return null;
    }

    return createCache<D>({ key, type });
  }, [key, type]);

  useEffect(() => {
    return () => {
      if (refreshDestroy && handle) {
        handle?.remove();
      }
    };
  }, [handle, refreshDestroy]);

  return {
    onBeforeRequest: () => {
      if (handle) {
        const cachedData = handle.get();

        if (cachedData) {
          return {
            response: cachedData,
            returnStop: true,
          };
        }
      }
    },
    onSuccess: (response: D) => {
      if (handle&&response) {
         handle.set(response,cacheExpiration);
      }
    },
  };
};

export default useCache;
