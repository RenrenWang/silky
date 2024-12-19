import { useEffect, useRef } from "react";

function useDeepCompareEffect(callback, dependencies) {
  const dependenciesRef = useRef();

  // 比较依赖内容
  const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

  if (!isEqual(dependencies, dependenciesRef.current)) {
    dependenciesRef.current = dependencies;
  }

  useEffect(callback, [dependenciesRef.current]);
}


export default useDeepCompareEffect;