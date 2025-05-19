import OSS from 'ali-oss'

export const ossConfig = new OSS({
  region: 'oss-cn-beijing',
  bucket: 'wwyimage',
  accessKeyId: process.env.ACCESSKEYID || '',
  accessKeySecret: process.env.ACCESSKEYSECRET || '',
  internal: false,
  secure: true,
  endpoint: 'oss-cn-beijing.aliyuncs.com',  // 添加正确的 endpoint
  cname: false
})