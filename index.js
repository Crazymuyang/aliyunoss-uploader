const fs = require('fs');
const path = require('path');
const log = require('single-line-log').stdout;

class aliOssUploader{
  /**
   * aliOssUploader
   * @param {Object} aliossConfig 
   * @param {Object} uploadConfig 
   * @example { region: 'oss-cn-hangzhou', accessKeyId: 'your keyid', accessKeySecret: 'you keysecret', bucket: 'your bucket',}
   * @example { dirpath: './test', destpath: 'your destpath belong to the current bucket'}
   */
  constructor(aliossConfig, uploadConfig) {
    const OSS = require('ali-oss');
    this.client = new OSS(aliossConfig);
    this.dirpath = path.resolve(__dirname, uploadConfig.dirpath);
    this.destpath = uploadConfig.destpath;
    this.streamList = [];
    this.streamAmount = 0;
  }

  start() {
    this.streamFactory(this.dirpath, this.destpath);
    this.streamList.forEach((fileItem, idx) => {
      this.putStream(fileItem.destPath, fileItem.stream);
      log(`\x1B[32m--正在上传${idx + 1}/${this.streamAmount}--\x1B[39m`);
      (idx + 1 === this.streamAmount) && log(`\x1B[32m上传完成，本次共计${this.streamAmount}个文件\x1B[39m`);
    });
  }
  /**
   * aliyunoss 流式上传
   * @param {String} filename 上传至oss使用的文件名
   * @param {String} stream 可读的文件流
   */
  async putStream (filename, stream) {
    try {
      await this.client.putStream(filename, stream);
    } catch (err) {
      throw err;
    }
  }

  /**
   * 生成stream流列表
   * @param {String} dirpath 本地需要上传的目录位置
   * @param {String} destPath 上传至服务器的目录位置
   */
  streamFactory(dirpath, destPath) {
    const files = fs.readdirSync(dirpath);
    files.length && files.forEach((filename) => {
      const filepath = path.resolve(dirpath, filename);
      const isDir = fs.statSync(filepath).isDirectory();
      const isFile = fs.statSync(filepath).isFile();
      if(isFile) {
        const stream = fs.createReadStream(filepath);
        this.streamList.push({ stream, destPath: `${destPath}/${filename}` });
        this.streamAmount++;
      }else if (isDir) {
        this.streamFactory(filepath, `${destPath}/${filename}`);
      }
    });
  }
}

module.exports = aliOssUploader;