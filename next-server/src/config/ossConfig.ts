/*
 * @Author: your name
 * @Date: 2025-05-12 13:38:20
 * @LastEditTime: 2025-05-12 14:00:01
 * @LastEditors: 韦玮莹
 * @Description: In User Settings Edit
 * @FilePath: \next-server\src\utils\ossConfig.ts
 */
import OSS from 'ali-oss'

export const ossConfig = new OSS({
  region: 'oss-cn-beijing',
  bucket: 'wwyimage',
})