import { renderHook, act } from "@testing-library/react";
import useNumberInput from "../@hooks/use-number-input";
import { expect,describe } from "vitest";
import { it } from "vitest";

describe("useNumberInput Hook - Extended Tests", () => {

  
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
});it("should handle negative numbers with formatting", () => {
  const { result } = renderHook(() =>
    useNumberInput({ decimalPlaces: 2 })
  );
  act(() => {
    result.current.onChange({ target: { value: "-1234567.89" } } as any);
  });
  expect(result.current.value).toBe("-1,234,567.89");
});
it("should remove spaces and non-numeric characters", () => {
  const { result } = renderHook(() =>
    useNumberInput({ decimalPlaces: 2 })
  );
  act(() => {
    result.current.onChange({ target: { value: " 123  ,456.78abc " } } as any);
  });
  expect(result.current.value).toBe("123,456.78");
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
it("should remove commas on focus", () => {
  const { result } = renderHook(() =>
    useNumberInput({ decimalPlaces: 2 })
  );
  act(() => {
    result.current.onChange({ target: { value: "1,234,567.89" } } as any);
  });

  act(() => {
    result.current.onFocus({} as any);
  });

  expect(result.current.value).toBe("1234567.89");
});

it("should add commas on blur", () => {
  const { result } = renderHook(() =>
    useNumberInput({ decimalPlaces: 2 })
  );
  act(() => {
    result.current.onChange({ target: { value: "1234567.89" } } as any);
  });

  act(() => {
    result.current.onBlur({} as any);
  });

  expect(result.current.value).toBe("1,234,567.89");
});
it("should handle multiple dots in the input", () => {
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
it("should allow negative numbers when allowNegative is true", () => {
  const { result } = renderHook(() => useNumberInput({ allowNegative: true }));
  act(() => {
    result.current.onChange({ target: { value: "-123" } } as any);
  });
  expect(result.current.value).toBe("-123");
});

it("should not allow negative numbers when allowNegative is false", () => {
  const { result } = renderHook(() => useNumberInput({ allowNegative: false }));
  act(() => {
    result.current.onChange({ target: { value: "-123" } } as any);
  });
  expect(result.current.value).toBe("123");
});
it("should handle empty value on initialization", () => {
  const { result } = renderHook(() => useNumberInput({ initialValue: "" }));
  expect(result.current.value).toBe(""); // 初始值为空
});

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
