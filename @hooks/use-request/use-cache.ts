import createCache, { CacheType } from '@/@utils/cache';
import { useEffect, useMemo } from 'react';

const useCache = <TData>(props?: { type?: CacheType; key?: string; refreshDestroy?: boolean }) => {
  const { key, refreshDestroy = true, type } = props || {};

  const handle = useMemo(() => {
    if (!key) {
      return null;
    }

    return createCache<TData>({ key, type });
  }, [key, type]);

  useEffect(() => {
    return () => {
      if (refreshDestroy && handle) {
        handle?.remove();
      }
    };
  }, [handle, refreshDestroy]);

  return {
    get: () => {
      if (handle) {
        const cachedData = handle.get();

        if (cachedData) {
          return cachedData as TData;
        }
      }

      return null;
    },
    set: (data: TData) => {
      if (handle) {
        handle.set(data);
      }
    },
  };
};

export default useCache;
