import { renderHook } from '@testing-library/react';
import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useUpload, { UploadProps } from '../use-upload';
import { setup, teardown } from './mock';
// 创建一个jsdom实例，模拟一个HTML文档
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// 将全局的window、document等对象设置为jsdom模拟出来的对象
global.window = dom.window;
global.document = dom.window.document;

// 模拟相关模块和函数
vi.mock('@/common/storage', () => ({
  get: vi.fn(),
}));
vi.mock('@/common/utils', () => ({
  getToken: vi.fn(),
}));
vi.mock('@/components', () => ({
  TimeZone: {
    get: vi.fn(),
  },
}));
vi.mock('@ebonex/utils', () => ({
  Lane: vi.fn(),
}));
vi.mock('antd', () => ({
  message: {
    error: vi.fn(),
  },
  UploadProps: vi.fn(),
}));

describe('useUpload', () => {
  beforeEach(() => {
    // 重置每个测试用例之前的模拟函数调用记录
    vi.resetAllMocks();
  });
  beforeEach(() => setup());
  afterEach(() => {
    teardown();
  });

  it('should set initial fileList correctly', () => {
    const props: UploadProps = { maxCount: 1, multiple: false, bizType: 'saas' };

    const { result } = renderHook(() => useUpload(props));
    const { fileList } = result.current;
    expect(fileList).toEqual([]);
  });

  // it('should handle file size limit correctly', async () => {
  //   const props: UploadProps = { maxCount: 1, multiple: false, bizType: 'saas' };
  //   const largeFile = { size: 1024 * 1024 * 100 } as RcFile;
  //   const { result } = renderHook(() => useUpload(props));
  //   // const { fileList } = result.current;
  //   // const result = await beforeUpload(largeFile, []);
  //   expect(result).toBe(false);
  //   expect(message.error).toHaveBeenCalledWith(`File size exceeds the limit: ${largeFile.name}`);
  // });

  it('should get refs inside Upload in componentDidMount', async () => {
    // let ref: React.RefObject<HTMLInputElement>;
    // const props: UploadProps = { maxCount: 1, multiple: false, bizType: 'saas' };
    // const largeFile = { size: 1024 * 1024 * 100 } as RcFile;
    // const App: React.FC = () => {
    //   const inputRef = useRef<HTMLInputElement>(null);
    //   const { uploadProps } = useUpload(props);
    //   useEffect(() => {
    //     ref = inputRef;
    //   }, []);
    //   return (
    //     <Upload {...uploadProps} supportServerRender={false}>
    //       <input ref={inputRef} />
    //     </Upload>
    //   );
    // };
    // const { getByText } = render(<App />);
    // const { container: wrapper } = render(
    //   <Upload {...props}>
    //     <button type="button">upload</button>
    //   </Upload>,
    // );
  });
});
