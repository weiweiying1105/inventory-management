import OSS from 'ali-oss'
import dotenv from 'dotenv'
// 确保在创建 OSS 实例之前加载环境变量
dotenv.config()

export const ossConfig = new OSS({
  region: 'oss-cn-beijing',
  bucket: 'wwyimage',
  accessKeyId: process.env.ACCESSKEYID || '',
  accessKeySecret: process.env.ACCESSKEYSECRET || '',
  internal: false,
  secure: true,
  endpoint: 'oss-cn-beijing.aliyuncs.com',  // 添加正确的 endpoint
  cname: false, // 是否使用自定义域名
})