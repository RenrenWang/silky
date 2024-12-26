import { useCallback } from "react";

const useFormErrors = (errors: Record<string, any>) => {
  const getErrors = useCallback(
    (name: string): string[] => {
 
      const extractErrors = (errObj: Record<string, any>, path: string[] = []): string[] => {
        if (!errObj || typeof errObj !== "object") return [];

        const messages: string[] = [];
        const currentPath = path.join(".");

        if (currentPath === name || currentPath.startsWith(`${name}.`) || currentPath.startsWith(`${name}[`)) {
          if (errObj?.message) {
            messages.push(errObj.message);
          }
        }

        for (const key in errObj) {
          if (errObj.hasOwnProperty(key)) {
            messages.push(...extractErrors(errObj[key], [...path, key]));
          }
        }

        return messages;
      };

      return extractErrors(errors);
    },
    [errors]
  );

  return { getErrors };
};

export default useFormErrors;
