import qs from 'query-string';
import { useMemo } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

const useLocationSearch = () => {
  const [, setSearchParams] = useSearchParams();
  const location = useLocation();

  const setSearch: any = (values: Record<string, any>) => {
    setSearchParams(values);
  };

  const search = useMemo(() => {
    const search = location.search.replace('?', '');
    return qs.parse(search);
  }, [location.search]);

  return [search, setSearch];
};

export default useLocationSearch;
