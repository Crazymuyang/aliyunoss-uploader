import { readdirSync, statSync, createReadStream } from 'fs';
import { resolve } from 'path';
import { createRequire } from 'module';
import chalk from 'chalk';

const require = createRequire(import.meta.url);
const log = require('single-line-log').stdout;

class AliOssUploader{
  /**
   * aliOssUploader
   * @param {Object} aliossConfig 
   * @param {Object} uploadConfig 
   * @example { region: 'oss-cn-hangzhou', accessKeyId: 'your keyid', accessKeySecret: 'you keysecret', bucket: 'your bucket',}
   * @example { dirpath: resolve(__dirname, './test'), destpath: 'your destpath belong to the current bucket'}
   */
  constructor(aliossConfig, uploadConfig) {
    const OSS = require('ali-oss');
    this.client = new OSS(aliossConfig);
    this.dirpath = uploadConfig.dirpath;
    this.destpath = uploadConfig.destpath;
    this.streamList = [];
    this.streamAmount = 0;
  }

  start() {
    this.streamFactory(this.dirpath, this.destpath);
    this.streamList.forEach((fileItem, idx) => {
      this.putStream(fileItem.destPath, fileItem.stream, idx);
    });
  }
  /**
   * aliyunoss 流式上传
   * @param {String} filename 上传至oss使用的文件名
   * @param {String} stream 可读的文件流
   */
  async putStream (filename, stream, idx) {
    try {
      await this.client.putStream(filename, stream);

      log(chalk.green(`Processing: ${idx + 1}/${this.streamAmount} ${filename}`));

      (idx + 1 === this.streamAmount) && log(chalk.green(`上传完成，本次共计${this.streamAmount}个文件`));
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
    const files = readdirSync(dirpath);
    files.length && files.forEach((filename) => {
      const filepath = resolve(dirpath, filename);
      const isDir = statSync(filepath).isDirectory();
      const isFile = statSync(filepath).isFile();
      if(isFile) {
        const stream = createReadStream(filepath);
        this.streamList.push({ stream, destPath: `${destPath}/${filename}` });
        this.streamAmount++;
      }else if (isDir) {
        this.streamFactory(filepath, `${destPath}/${filename}`);
      }
    });
  }
}

export { AliOssUploader as default };
