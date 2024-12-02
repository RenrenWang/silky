import { expect,describe,it,vi } from 'vitest'
import { renderHook,waitFor } from '@testing-library/react'
import useRequest from "@/useRequest/index";

describe('useRequest', () => {
  it('should fetch data successfully',async () => {
    const expectedData = [{ title: 'Star Wars' }];
    const res={code:0, data: expectedData }
    const mockService = vi.fn(() => Promise.resolve(res));

    const { result } = renderHook(() => useRequest<any,any>(mockService));

   
    result.current.runSync(); 
   
    await waitFor(() => {
      expect(result.current.data).toEqual(res);
      expect(result.current.loading).toEqual(false);
    }, {
      timeout: 300, // 等待5秒
    });
  });
});