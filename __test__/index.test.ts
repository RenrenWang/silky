import { renderHook, act } from "@testing-library/react";
import useNumberInput from "../@hooks/use-number-input";
import { expect,describe } from "vitest";
import { it } from "vitest";

describe("useNumberInput Hook - Extended Tests", () => {
  it("should handle empty initial value", () => {
    const { result } = renderHook(() =>
      useNumberInput({ initialValue: "", decimalPlaces: 2 })
    );
    expect(result.current.value).toBe("");
  });

  it("should handle extremely large numbers", () => {
    const { result } = renderHook(() =>
      useNumberInput({ decimalPlaces: 2 })
    );

    act(() => {
      result.current.onChange({ target: { value: "999999999999.9999" } } as any);
    });

    expect(result.current.value).toBe("999,999,999,999.99");
  });

  it("should handle extremely small numbers", () => {
    const { result } = renderHook(() =>
      useNumberInput({ decimalPlaces: 5, allowNegative: true })
    );

    act(() => {
      result.current.onChange({ target: { value: "-0.00000123" } } as any);
    });

    expect(result.current.value).toBe("-0.00000");
  });

  it("should remove commas when parsing the value", () => {
    const { result } = renderHook(() =>
      useNumberInput({ decimalPlaces: 2 })
    );

    act(() => {
      result.current.onChange({ target: { value: "1,234,567.89" } } as any);
    });

    expect(result.current.value).toBe("1,234,567.89");
  });

  it("should handle input with multiple dots", () => {
    const { result } = renderHook(() =>
      useNumberInput({ decimalPlaces: 2 })
    );

    act(() => {
      result.current.onChange({ target: { value: "123..45" } } as any);
    });

    expect(result.current.value).toBe("123.45");
  });

  it("should clamp values below minimum", () => {
    const { result } = renderHook(() =>
      useNumberInput({ min: 10, max: 100 })
    );

    act(() => {
      result.current.onChange({ target: { value: "5" } } as any);
    });

    expect(result.current.value).toBe("10");
  });

  it("should clamp values above maximum", () => {
    const { result } = renderHook(() =>
      useNumberInput({ min: 10, max: 100 })
    );

    act(() => {
      result.current.onChange({ target: { value: "150" } } as any);
    });

    expect(result.current.value).toBe("100");
  });

  it("should handle '-' as valid input when allowNegative is true", () => {
    const { result } = renderHook(() =>
      useNumberInput({ allowNegative: true })
    );

    act(() => {
      result.current.onChange({ target: { value: "-" } } as any);
    });

    expect(result.current.value).toBe("-");
  });

  it("should clear invalid input characters", () => {
    const { result } = renderHook(() =>
      useNumberInput({ decimalPlaces: 2 })
    );

    act(() => {
      result.current.onChange({ target: { value: "123abc456" } } as any);
    });
   
    expect(result.current.value).toBe("123456");
  });

  it("should format on blur even with incomplete input", () => {
    const { result } = renderHook(() =>
      useNumberInput({ decimalPlaces: 2 })
    );

    act(() => {
      result.current.onChange({ target: { value: "12." } } as any);
    });

    act(() => {
      result.current.onBlur({} as any);
    });

    expect(result.current.value).toBe("12.00");
  });
});
