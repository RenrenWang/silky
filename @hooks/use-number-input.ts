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
  ref: React.RefObject<HTMLInputElement>;
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
  onBlur,
}: UseNumberInputProps): UseNumberInputReturn {
  // Helper: Validate and sanitize input
  const validateInput = useCallback(
    (rawValue: string): string => {
      // 如果禁止负数，并且输入为负数，则直接返回正数
      if (!allowNegative && rawValue.startsWith("-")) {
        rawValue = rawValue.replace("-", ""); // 移除负号
      }
  
      if (rawValue === "-") return allowNegative ? "-" : ""; // 允许负号时仍返回负号
  
      let newValue = rawValue.replace(/[^0-9.-]/g, ""); // Remove illegal characters
  
      // Handle multiple dots
      const parts = newValue.split(".");
      if (parts.length > 2) {
        newValue = parts[0] + "." + parts.slice(1).join("");
      }
  
      // Enforce decimal places
      const [integerPart, decimalPart] = newValue.split(".");
      if (decimalPart && decimalPart.length > decimalPlaces) {
        newValue = `${integerPart}.${decimalPart.slice(0, decimalPlaces)}`;
      }
  
      // Clamp to min and max
      try {
        const numericValue = new Decimal(newValue || 0);
        if (numericValue.lt(min)) return String(min);
        if (numericValue.gt(max)) return String(max);
      } catch {
        return ""; // Invalid number input
      }
  
      return newValue;
    },
    [allowNegative, decimalPlaces, min, max]
  );
  

  // Helper: Format value for display
  const formatValue = useCallback(
    (value: string): string => {
      if (!value || value === "-") return value; // Empty value or single negative sign
      try {
        const numericValue = new Decimal(value.replace(/,/g, ""));
        let formatted = numericValue.toFixed(decimalPlaces);

        // Add thousands separators
        const [integerPart, decimalPart] = formatted.split(".");
        const formattedInteger = integerPart.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        );

        return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
      } catch {
        return ""; // Invalid input
      }
    },
    [decimalPlaces]
  );

  // State management
  const [value, setValue] = useState<string>(
    () => formatValue(String(initialValue))
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (onChange) {
      onChange(value.replace(/,/g, "")); // Pass unformatted value to onChange
    }
  }, [value, onChange]);

  // Input handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const validatedValue = validateInput(rawValue);
      setValue(validatedValue);
    },
    [validateInput]
  );

  const handleFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onFocus) onFocus(e);
      setValue(value.replace(/,/g, "")); // Remove formatting on focus
    },
    [value, onFocus]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (onBlur) onBlur(e);

      if (!value || (!allowZero && new Decimal(value || 0).eq(0))) {
        setValue(allowZero ? "0" : "");
        return;
      }

      const validatedValue = validateInput(value);
      setValue(formatValue(validatedValue)); // Reformat on blur
    },
    [value, validateInput, formatValue, onBlur, allowZero]
  );

  return {
    value,
    setValue,
    onChange: handleInputChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ref: inputRef,
  };
}

export default useNumberInput;
