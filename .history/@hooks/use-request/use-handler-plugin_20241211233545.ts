import { useCallback, useRef, useState } from "react";
import { RequestPlugin, RequestPluginReturn, RequestProps } from "./typing";

export const useHandlerPlugin = <D, P extends any[]>(
  baseHandler: (...config: P) => Promise<D>,
  plugins: Array<RequestPlugin<D, P>>,
  options: RequestProps<D, P> = {}
) => {
  const prevResultRef = useRef<D | undefined>(undefined);
  const prevParamsRef = useRef<P | undefined>(options?.params);
  const [data, setData] = useState<D | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const pluginInstances = plugins.map((usePlugin) =>
    usePlugin({
      options,
      onChangeLoading: (loading) => setLoading(loading) // TODO forward
    })
  );

  // 修正 executePluginHooks 的类型推断
  const executePluginHooks = async <K extends keyof RequestPluginReturn<D, P>>(
    hookName: K,
    ...args: Parameters<NonNullable<RequestPluginReturn<D, P>[K]>>
  ) => {
    for (const plugin of pluginInstances) {
      const hook = plugin[hookName];

      if (typeof hook === "function") {
        // 明确告诉 TypeScript，hook 是函数类型
        await (hook as (...args: Parameters<NonNullable<typeof hook>>) => any)(
          ...args
        );
      }
    }
  };

  const executeBeforeRequestHooks = async (params: P) => {
    let finalParams =
      Array.isArray(params) && params?.length ? params : prevParamsRef.current;
    let shouldStop = false;

    for (const plugin of pluginInstances) {
      if (plugin.onBeforeRequest) {
        const result = await plugin.onBeforeRequest({
          prevParams: finalParams,
          prevResult: prevResultRef.current
        });

        if (result) {
          shouldStop = !!result.returnStop;

          if (result.response) {
            prevResultRef.current = result.response;

            if (shouldStop) {
              setData(result.response);
              await executePluginHooks("onFinally");
              return { shouldStop, finalParams };
            }
          }

          if (result.params) {
            finalParams = result.params;
          }
        }
      }
    }

    return { shouldStop, finalParams };
  };

  const request = useCallback(
    async (params: P) => {
      const { shouldStop, finalParams } = await executeBeforeRequestHooks(
        params
      );

      prevParamsRef.current = finalParams;

      if (shouldStop) {
        return prevResultRef.current;
      }

      try {
        const response = await baseHandler(...((finalParams as P) || []));
        let finalResponse = response;

        // Execute onSuccess hooks
        for (const plugin of pluginInstances) {
          if (plugin.onSuccess) {
            const processedResponse = await plugin.onSuccess(
              finalResponse,
              finalParams!
            );
            if (processedResponse) {
              finalResponse = processedResponse;
            }
          }
        }

        setData(finalResponse);
        prevResultRef.current = finalResponse;
        options?.onSuccess?.(finalResponse);

        return Promise.resolve(finalResponse);
      } catch (error) {
        // Execute onError and onFinally hooks
        options?.onError?.(error as any);

        await executePluginHooks("onError", error, finalParams!, request);

        return Promise.reject(error);
      } finally {
        options?.onFinally?.();
        executePluginHooks("onFinally");
      }
    },
    [baseHandler, pluginInstances]
  );


   // 取消所有请求
   const cancel = () => {
     executePluginHooks("onError", error, finalParams!, request);
  };

  return {
    request,
    data,
    loading,
    cancel,
    prevParamsRef
  };
};
