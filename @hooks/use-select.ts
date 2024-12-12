import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import uniqBy from "lodash/uniqBy";

export type UseSelectProps<TData, TError> = {
  resource: string;
  optionLabel?: keyof TData | ((item: TData) => string);
  optionValue?: keyof TData | ((item: TData) => string);
  searchField?: keyof TData;
  filters?: { field: keyof TData; operator: string; value: any }[];
  sorters?: { field: keyof TData; order: "asc" | "desc" }[];
  debounceTime?: number;
  initialOptions?: TData[];
  fetchOptions: (params: {
    filters: Record<string, any>[];
    sorters: Record<string, any>[];
    search?: { field: string; value: string };
  }) => Promise<TData[]>;
};

export type UseSelectReturnType<TData> = {
  options: { label: string; value: any }[];
  search: (value: string, field?: keyof TData) => void;
  isLoading: boolean;
};

export const useSelect = <TData extends Record<string, any>, TError = unknown>(
  props: UseSelectProps<TData, TError>
): UseSelectReturnType<TData> => {
  const {
    resource,
    optionLabel = "title",
    optionValue = "id",
    searchField,
    filters = [],
    sorters = [],
    debounceTime = 300,
    initialOptions = [],
    fetchOptions,
  } = props;

  if (!fetchOptions) {
    throw new Error("`fetchOptions` is required to use `useSelect`.");
  }

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [localFilters, setFilters] = useState(filters);
  const [localOptions, setLocalOptions] = useState<TData[]>(initialOptions);

  const getLabel = useCallback(
    (item: TData) => {
      if (typeof optionLabel === "string") {
        return (item as any)[optionLabel] || "";
      }
      return optionLabel(item);
    },
    [optionLabel]
  );

  const getValue = useCallback(
    (item: TData) => {
      if (typeof optionValue === "string") {
        return (item as any)[optionValue] || null;
      }
      return optionValue(item);
    },
    [optionValue]
  );

  const { isLoading } = useQuery<TData[], TError>(
    [resource, localFilters, sorters, searchQuery],
    () =>
      fetchOptions({
        filters: localFilters,
        sorters,
        search: searchQuery
          ? { field: searchField || "default", value: searchQuery }
          : undefined,
      }),
    {
      enabled: Boolean(resource),
      onSuccess: (fetchedData) => {
        setLocalOptions((prevOptions) =>
          uniqBy([...prevOptions, ...fetchedData], (item) => getValue(item))
        );
      },
    }
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((query: string) => {
        setSearchQuery(query);
      }, debounceTime),
    [debounceTime]
  );

  const search = useCallback(
    (value: string, field?: keyof TData) => {
      debouncedSearch(value);
      setFilters([
        ...filters,
        {
          field: field || searchField || "default",
          operator: "contains",
          value,
        },
      ]);
    },
    [debouncedSearch, filters, searchField]
  );

  const options = useMemo(
    () =>
      localOptions.map((item) => ({
        label: getLabel(item),
        value: getValue(item),
      })),
    [localOptions, getLabel, getValue]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return {
    options,
    search,
    isLoading,
  };
};
