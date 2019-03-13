# aliyunoss uploader
  > 基于fs & ali-oss，批量上传文件(putStream)至阿里云oss

## 安装
  ```
  npm install --save-dev @crazymuyang/alioss-uploader
  ```

## 使用
  ```
  const aliOssUploader = require('@crazymuyang/alioss-uploader');
  const path = require('path');
  const aliossConfig = {
    region: 'oss-cn-hangzhou',
    accessKeyId: 'your accessKeyId',
    accessKeySecret: 'your accessKeySecret',
    bucket: 'your bucket',
  };
  const uploadConfig = {
    dirpath: path.resolve(__dirname, './test'),  // 将该路径下的文件上传至oss()
    destpath: '/test',  // 将文件上传至bucket下的该路径下
  }

  const uploader = new aliOssUploader(aliossConfig, uploadConfig);
  uploader.start();
  ```
