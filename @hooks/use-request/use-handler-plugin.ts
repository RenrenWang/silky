import { useCallback, useRef, useState } from "react";
import { RequestPlugin, RequestProps } from "./typing";


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
      onChangeLoading: setLoading,
    })
  );

  const executePluginHooks = async <K extends keyof RequestPlugin<D, P>>(
    hookName: K,
    ...args: Parameters<NonNullable<RequestPlugin<D, P>[K]>>
  ) => {
    for (const plugin of pluginInstances) {
      const hook = plugin[hookName];

      if (hook) {
        await hook(args);
      }
    }
  };

  const executeBeforeRequestHooks = async (params: P) => {
    let finalParams = Array.isArray(params) && params?.length ? params : prevParamsRef.current;
    let shouldStop = false;

    console.log("params", finalParams)

    for (const plugin of pluginInstances) {
      if (plugin.onBeforeRequest) {
        const result = await plugin.onBeforeRequest({
          prevParams: finalParams,
          prevResult: prevResultRef.current,
        });

        if (result) {
          if (result.response) {
            prevResultRef.current = result.response;
            shouldStop = !!result.returnStop;

            if (shouldStop) {
              setData(result.response);
              await executePluginHooks("onFinally", null, result.response, finalParams);
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
      const { shouldStop, finalParams } = await executeBeforeRequestHooks(params);

      prevParamsRef.current = finalParams;

      if (shouldStop) {
        return prevResultRef.current;
      }

      try {
        const response = await baseHandler(...(finalParams as P||[]));
        let finalResponse = response;

        // Execute onSuccess hooks
        for (const plugin of pluginInstances) {
          if (plugin.onSuccess) {
            const processedResponse = await plugin.onSuccess(finalResponse, finalParams);
            if (processedResponse) {
              finalResponse = processedResponse;
            }
          }
        }

        setData(finalResponse);
        prevResultRef.current = finalResponse;

        // Execute onFinally hooks
        await executePluginHooks("onFinally", null, finalResponse, finalParams);

        return Promise.resolve(finalResponse);;

      } catch (error) {
        // Execute onError and onFinally hooks
        await executePluginHooks("onError", error, finalParams);
        await executePluginHooks("onFinally", error, prevResultRef.current, finalParams);
        return Promise.reject(error);
      }
    },
    [baseHandler, pluginInstances]
  );

  return {
    request,
    data,
    loading,
    prevParamsRef
  };
};
