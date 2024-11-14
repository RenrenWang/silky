import { expect,describe,it,vi } from 'vitest'
import { renderHook,waitFor } from '@testing-library/react'
import useRequest from "@/useRequest/index";

describe('useRequest', () => {
  it('should fetch data successfully',async () => {
    const expectedData = [{ title: 'Star Wars' }];
    const res={code:0, data: expectedData }
    const mockService = vi.fn(() => Promise.resolve(res));

    const { result } = renderHook(() => useRequest({
      service: mockService,
      options: {
        manual: true,
      },
     }));

     // 等待请求完成
   
    await waitFor(() => {
      //  // 检查服务是否被调用
      //  expect(mockService).toHaveBeenCalled();
      //  // 检查数据是否已更新
      expect(result.current.data).toEqual(res);
      //  // 断言数据是否符合预期
      //  expect(result.current.data).toEqual(expectedData);
    }, {
      timeout: 300, // 等待5秒
    });
  });
});