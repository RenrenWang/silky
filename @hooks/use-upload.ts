import { get } from '@/common/storage';
import { getToken } from '@/common/utils';
import { TimeZone } from '@/components';
import { Lane } from '@ebonex/utils';
import { UploadProps as AntUploadProps, message } from 'antd';
import { RcFile, UploadChangeParam, UploadFile } from 'antd/es/upload';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { useCallback, useState } from 'react';

export type UploadProps = {
  onUploadProgress?: (percentCompleted: number, file: string | RcFile | Blob) => number | string;
  maxCount?: number;
  multiple?: boolean;
  maxSize?: number;
  extraFields?: { [key: string]: string | Blob | number | boolean };
  interceptRequest?: (result: any, file: string | RcFile | Blob) => Promise<boolean>;
} & AntUploadProps;

// 定义允许上传的文件类型，提取为常量方便维护和阅读
const ACCEPTED_FILE_TYPES = `.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.bmp,.gif,.tif,.tiff,.txt,.pdf,.zip,.rar,.7z,
    application/msword, 
    application/vnd.openxmlformats-officedocument.wordprocessingml.document, 
    application/vnd.ms-excel, 
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, 
    text/csv, 
    image/jpeg, 
    image/png, 
    image/bmp, 
    image/gif, 
    image/tiff, 
    text/plain, 
    application/pdf, 
    application/zip, 
    application/x-rar-compressed,
    application/x-7z-compressed`;

// 默认的上传组件属性配置，方便复用和统一管理
const DEFAULT_UPLOAD_PROPS: Partial<AntUploadProps> = {
  name: 'file',
  multiple: false,
  maxCount: 1,
};

const useUpload = (props: UploadProps = { maxCount: 1, multiple: false, bizType: 'saas' }) => {
  const {
    onUploadProgress,
    maxSize = 1024 * 1024 * 50,
    interceptRequest,
    onChange: originOnChange,
    beforeUpload: originBeforeUpload,
    name,
    extraFields,
    ...reset
  } = props;

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const createFormData = (file: RcFile) => {
    const formData = new FormData();
    const formName = name || (DEFAULT_UPLOAD_PROPS.name as string);
    formData.append(formName, file);

    if (extraFields) {
      Object.keys(extraFields).reduce((acc: FormData, field: string) => {
        if (extraFields[field]) {
          acc.append(field, extraFields[field] as string);
        }

        return acc;
      }, formData);
    }

    return formData;
  };

  const beforeUpload = useCallback(
    async (file: RcFile, FileList: RcFile[]) => {
      if (!file?.size || file?.size > maxSize) {
        message.error(`File size exceeds the limit: ${file.name}`);
        return false;
      }

      if (file?.name && fileList.some((f) => f?.name === file.name)) {
        message.error(`File already exists: ${file.name}`);
        return false;
      }

      if (originBeforeUpload) {
        return await originBeforeUpload(file, FileList);
      }

      return true;
    },
    [fileList, maxSize, originBeforeUpload],
  );

  const handleUploadProgress = (
    progressEvent: any,
    file: RcFile,
    onProgress: (progress: { percent: number }) => void,
  ) => {
    const { loaded, total } = progressEvent;
    let percentCompleted = 100;
    if (total) {
      percentCompleted = Math.round((loaded * 100) / total);
    }
    if (onUploadProgress) {
      percentCompleted = onUploadProgress(percentCompleted, file) as number;
    }
    onProgress({ percent: percentCompleted });
  };

  const uploadProps: UploadProps = {
    ...DEFAULT_UPLOAD_PROPS,
    accept: ACCEPTED_FILE_TYPES,
    beforeUpload,
    onChange(info) {
      const { fileList } = info;
      setFileList(fileList);
      originOnChange?.(info);
    },
    customRequest: async ({ action, file, onSuccess, onError, onProgress }: UploadRequestOption) => {
      const formData = createFormData(file);

      const lane = new Lane({
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept-Language': get('locale'),
          'X-Token': getToken(),
          timeZone: TimeZone.get(),
        },
      });

      try {
        const res = await lane.post(action, formData, {
          onUploadProgress: (progressEvent) => handleUploadProgress(progressEvent, file, onProgress),
        });

        if (res?.code == 0) {
          if (interceptRequest) {
            const result = await interceptRequest(res, file);
            if (!result) {
              onError({
                status: res?.code,
              });
              return;
            }
          }

          onSuccess(res);
        } else {
          message.error(res?.message || `Upload failed: ${file?.name}`);
          onError({
            status: res?.code,
          });
        }
      } catch (e) {
        onError({
          status: e,
        });
      }
    },
    fileList,
    ...reset,
  };

  const remove = useCallback(
    (file?: UploadFile) => {
      let newFileList: UploadFile[] = [];

      if (file) {
        newFileList = fileList.filter((item: any) => item.uid !== file.uid);
      }

      setFileList(newFileList);
      originOnChange?.({ fileList: newFileList } as UploadChangeParam<UploadFile<any>>);
    },
    [fileList, originOnChange],
  );

  return { uploadProps, fileList, remove };
};

export default useUpload;
