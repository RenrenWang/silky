import { useState, useEffect, useMemo } from "react";
import useDeepCompareEffect from "./use-deep-compare-effect";

/**
 * 自定义 Hook 用于批量预加载图片
 * @param {string[]} imageUrls 图片 URL 数组
 * @returns {object} 包含加载状态、成功的图片数组、失败的图片数组
 */
function useImagesPreloader(imageUrls:Array<string> = []) {
  const [loadedImages, setLoadedImages] = useState<Array<string>>([]);
  const [failedImages, setFailedImages] = useState<Array<string>>([]);
  const [isAllLoaded, setIsAllLoaded] = useState(false);
 
  const currentImageUrls=useMemo(()=>imageUrls,[imageUrls]);

  useDeepCompareEffect(() => {
    if (imageUrls.length === 0) return;

    let loaded:Array<string> = [];
    let failed:Array<string> = [];

    const promises = imageUrls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;

          img.onload = () => {
            loaded.push(url);
            resolve(true);
          };

          img.onerror = () => {
            failed.push(url);
            reject();
          };
        })
    );

    Promise.allSettled(promises).then(() => {
      setLoadedImages(loaded);
      setFailedImages(failed);
      setIsAllLoaded(true);
    });

  }, [currentImageUrls]);

  return { loadedImages, failedImages, isAllLoaded };
}

export default useImagesPreloader