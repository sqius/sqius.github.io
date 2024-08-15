# React + Antd Upload 头像上传

``` tsx
import { useState } from 'react';
import { message, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { RcFile, UploadProps } from 'antd/es/upload/interface';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

export type Props = {
  value?: { key: string; label: string }[];
  onChange?: (file?: RcFile) => void;
} & UploadProps;

export default (props: Props) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const { onChange, ...restProps } = props;

  const beforeUpload = (file: RcFile) => {
    // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isJpgOrPng = file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('只能上传 PNG 文件!');
      // message.error('只能上传 JPG/PNG 文件!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片最大不能超过 2MB!');
    }
    if (isJpgOrPng && isLt2M) {
      getBase64(file as RcFile, (url) => {
        setImageUrl(url);
      });
      if (onChange) onChange(file);
    }
    return false;
  };

  // trigger
  const uploadButton = (
    <div>
      <PlusOutlined /> 上传
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      beforeUpload={beforeUpload}
      showUploadList={false}
      fileList={[]}
      {...restProps}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
    </Upload>
  );
};
```