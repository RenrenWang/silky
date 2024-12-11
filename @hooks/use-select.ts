import { useMemo } from 'react';
import useRequest from './use-request';
import { RequestProps, Service } from './use-request/typing';

const useSelect = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  props: {
    transform?: (data: TData) => any;
    optionLabel?: string;
    optionValue?: string;
  } & RequestProps<TData, TParams>,
) => {
  const { transform, optionLabel, optionValue, ...rest } = props;

  const { data, loading, refresh, run }: any = useRequest(service, {
    ...rest,
  });

  const options = useMemo(() => {
    return data?.data?.map((item: any) => {
      return {
        ...(transform?.(item) || {
          ...item,
          label: optionLabel && item?.[optionLabel],
          value: optionValue && item?.[optionValue],
        }),
      };
    });
  }, [data?.data, optionLabel, optionValue, transform]);

  return {
    options,
    loading,
    refresh,
    run,
  };
};

export default useSelect;
