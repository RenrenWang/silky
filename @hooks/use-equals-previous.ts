import { useRef } from "react";
import { isEqual } from "radash";


function useEqualsPrevious(prevValue:any) {
  const prevValueRef = useRef(prevValue);

  
  const checkEqual = (newValue:any) => {
    return isEqual(prevValueRef.current, newValue);
  };

  const setValue = (newValue:any) => {
    prevValueRef.current = newValue;
  };
  
  return [checkEqual, setValue];
}

export default useEqualsPrevious;
