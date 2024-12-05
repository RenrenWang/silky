type CacheData<T> = { data: T; timestamp: number; expirationTimestamp: number } | null;
// 内存缓存使用 Map 结构，并增加过期时间戳字段
const memoryCache = new Map<string, CacheData<any>>();

declare const CacheTypes: readonly ['memory', 'localStorage'];
export type CacheType = (typeof CacheTypes)[number];

const isCacheExpired = <T>(cacheData: CacheData<T>) => {
  const now = Date.now();

  if (cacheData?.expirationTimestamp === 0) {
    return false;
  }

  return cacheData?.expirationTimestamp ? now > cacheData?.expirationTimestamp : true;
};

// 从内存缓存中获取数据
const getFromMemoryCache = <T>(requestKey: string): T | null => {
  const cachedData = memoryCache.get(requestKey);

  if (cachedData) {
    return isCacheExpired(cachedData) ? null : (cachedData.data as T);
  }

  return null;
};

// 将数据存入内存缓存，计算并设置过期时间戳
const setInMemoryCache = <T>(requestKey: string, data: T, cacheExpiration: number = 0): void => {
  const expirationTimestamp = cacheExpiration > 0 ? Date.now() + cacheExpiration : 0;
  memoryCache.set(requestKey, { data, timestamp: Date.now(), expirationTimestamp });
};

const getFromLocalCacheData = <T>(requestKey: string): CacheData<T> => {
  try {
    const cachedData = localStorage.getItem(requestKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (e) {
    console.log('get localStorage error: ', e);
    return null;
  }
  return null;
};

// 从本地存储中获取数据
const getFromLocalStorage = <T>(requestKey: string): T | null => {
  const cachedData = getFromLocalCacheData(requestKey);

  if (cachedData) {
    return isCacheExpired(cachedData) ? null : (cachedData.data as T);
  }

  return null;
};

// 将数据存入本地存储
const setInLocalStorage = <T>(requestKey: string, data: T, cacheExpiration: number = 0): void => {
  try {
    const expirationTimestamp = cacheExpiration > 0 ? Date.now() + cacheExpiration : 0;
    localStorage.setItem(
      requestKey,
      JSON.stringify({ data, expirationTimestamp: expirationTimestamp, timestamp: Date.now() }),
    );
  } catch (e) {
    console.log('set localStorage error', e);
  }
};

// 优化后的检查缓存是否过期函数，直接比较时间戳
const createCache = <T>({ type = 'memory', key }: { key: string; type?: CacheType }) => {
  return {
    get: (): T | null => {
      if (type === 'memory') {
        return getFromMemoryCache(key);
      } else if (type === 'localStorage') {
        return getFromLocalStorage(key);
      }

      return null;
    },
    set: (data: T, cacheExpiration?: number) => {
      if (type === 'memory') {
        setInMemoryCache(key, data, cacheExpiration);
      } else if (type === 'localStorage') {
        setInLocalStorage(key, data, cacheExpiration);
      }
      return null;
    },
    isCacheExpired: () => {
      let cachedData: CacheData<T> = null;

      if (type === 'memory') {
        cachedData = memoryCache.get(key) as CacheData<T>;
      } else if (type === 'localStorage') {
        cachedData = getFromLocalCacheData<T>(key);
      }

      return isCacheExpired(cachedData);
    },
    remove: () => {
      if (type === 'memory') {
        memoryCache.delete(key);
      } else if (type === 'localStorage') {
        localStorage.removeItem(key);
      }
    },
    // clear: () => {
    //   if (type === 'memory') {
    //     memoryCache.clear();
    //   } else if (type === 'localStorage') {
    //     localStorage.clear();
    //   }
    // },
  };
};

export default createCache;
