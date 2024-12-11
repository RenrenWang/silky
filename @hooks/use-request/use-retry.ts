import { useRef } from "react";
import { RequestPluginProps } from "./typing";

export const useRetryPlugin = <D, P extends any[]>(
    { options: {retry=false, retryInterval = 1000, maxRetries = 3 }, onChangeLoading }: RequestPluginProps<D, P>
) => {
    const retriesRef = useRef(0); // 当前重试次数
    const delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
     if(!retry){
        return {}
    }

    return {
        onError: async (error:any,par:any,request:any) => {
            console.log("===error====",error)
                if (retriesRef.current < maxRetries) {
                    retriesRef.current++;
                    console.warn(
                        `Request failed, retrying (${retriesRef.current}/${maxRetries})...`
                    );
                    // 添加延迟后重试\
                  await delay(retryInterval);
                  return  request(par);
                } else {
                  console.error("Max retries reached. Aborting...");
                  throw error; // 达到最大重试次数，抛出错误
               }
           
         
        },
        onFinally: () => {
            // 重置重试计数器
            retriesRef.current = 0;
            onChangeLoading(false); // 确保结束加载状态
        },
    };
};
