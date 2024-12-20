import Decimal from "decimal.js";
import { useCallback, useEffect, useRef, useState } from "react";

type UseNumberInputProps = {
  initialValue?: string | number;
  decimalPlaces?: number;
  allowNegative?: boolean;
  allowZero?: boolean;
  min?: number;
  max?: number;
  onChange?: (value: string) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

type UseNumberInputReturn = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
};

function useNumberInput({
  initialValue = "",
  decimalPlaces = 2,
  allowNegative = true,
  allowZero = true,
  min = -Infinity,
  max = Infinity,
  onChange,
  onFocus,
  onBlur
}: UseNumberInputProps): UseNumberInputReturn {
  const validateInput = useCallback(
    (
      rawValue: string,
      options: {
        decimalPlaces: number;
        allowNegative: boolean;
        min: number;
        max: number;
      }
    ): string => {
      const { decimalPlaces, allowNegative, min, max } = options;
      let newValue = rawValue.replace(/[^0-9.-]/g, "");

      // Handle negative sign
      if (!allowNegative) {
        newValue = newValue.replace(/-/g, "");
      } else if (allowNegative && newValue === "-") {
        return newValue;
      }

      // Handle multiple dots
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Handle decimal places
      if (parts[1]?.length > decimalPlaces) {
        newValue = parts[0] + "." + parts[1].slice(0, decimalPlaces);
      }

      // Handle range using Decimal.js
      try {
        new Decimal(newValue).toFixed(decimalPlaces);
        // if (numericValue.lt(min)) newValue = new Decimal(min).toFixed(decimalPlaces);
        // if (numericValue.gt(max)) newValue = new Decimal(max).toFixed(decimalPlaces);
      } catch {
        newValue = ""; // Invalid number input
      }

      return newValue;
    },
    []
  );

  const findMinPositiveNumberByPrecision = (precision: number) => {
    if (typeof precision !== "number" || precision < 0 || precision > 18) {
      throw new Error("Precision must be a number between 0 and 18.");
    }

    return new Decimal(1).div(new Decimal(10).pow(precision));
  };

  const formatValue = useCallback(
    (
      val: string | number,
      options: {
        decimalPlaces: number;
        allowZero: boolean;
        min: number;
        max: number;
      }
    ): string => {
      const { decimalPlaces, allowZero, min, max } = options;

      if (!val && val !== 0) return "";

      try {
        const numericValue = new Decimal(val);
        const clampedValue = Decimal.max(min, Decimal.min(max, numericValue));
        let formatted = clampedValue.toFixed(decimalPlaces);

        if (!allowZero && clampedValue.isZero() && min) {
          formatted = new Decimal(
            min > 0 ? min : findMinPositiveNumberByPrecision(decimalPlaces)
          ).toFixed(decimalPlaces);
        }

        const [integerPart, decimalPart] = formatted.split(".");
        const formattedInteger = integerPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        );

        return decimalPart !== undefined
          ? `${formattedInteger}.${decimalPart}`
          : formattedInteger;
      } catch {
        return "";
      }
    },
    []
  );

  const parseValue = useCallback((val: string): string => {
    if (!val) return "";
    return val.replace(/,/g, "");
  }, []);

  const [value, setValue] = useState<string>(() =>
    formatValue(initialValue, { decimalPlaces, allowZero, min, max })
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cursorPosition = useRef<number | null>(null);
  const lastValueRef = useRef<string>();

  useEffect(() => {
    if (onChange) {
      onChange(parseValue(value));
    }
    lastValueRef.current = parseValue(value);

  }, [value, onChange]);

  const setCursor = useCallback(() => {
    if (inputRef.current && cursorPosition.current !== null) {
      inputRef.current.setSelectionRange(
        cursorPosition.current,
        cursorPosition.current
      );
    }
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let rawValue = e.target.value;
      cursorPosition.current = e.target.selectionStart || null;
      
      if(!allowZero&&rawValue?.indexOf("-")!==-1){
         rawValue=rawValue.replace("-", "");
      }
      if(rawValue===""){
        setValue("");
        return;
      }
      try {
      
        new Decimal(rawValue);
        const  v=validateInput(rawValue, { decimalPlaces, allowNegative, min, max })
        setValue(v);
      } catch {
        if (lastValueRef.current&&rawValue!=='-') {
          const  v= validateInput(lastValueRef.current, {
            decimalPlaces,
            allowNegative,
            min,
            max
          });
          setValue(v);
        }else if(rawValue=='-'){
          setValue("-");
        }
      }
   
    },
    [decimalPlaces, allowNegative, min, max]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) onFocus(e);
      setValue(parseValue(value));
    },
    [value, onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(e);

      try {
        if (
          !allowZero &&
          (new Decimal(value).lt(0) || new Decimal(value).eq(0))
        ) {
          setValue("");
        } else {
          setValue(formatValue(value, { decimalPlaces, allowZero, min, max }));
        }
      } catch {
        setValue("");
      }
    },
    [value, onBlur, decimalPlaces, allowZero, min, max]
  );

  useEffect(() => {
    setCursor();
  }, [value, setCursor]);

  return {
    value,
    setValue,
    onChange: handleInputChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ref: inputRef
  };
}

export default useNumberInput;
