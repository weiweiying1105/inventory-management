/*
 * @Author: your name
 * @Date: 2025-05-09 09:29:43
 * @LastEditTime: 2025-05-12 14:25:33
 * @LastEditors: 韦玮莹
 * @Description: In User Settings Edit
 * @FilePath: \next-server\src\utils\multerConfig.ts
 */
import multer from 'multer';
import { ossConfig } from '../config/ossConfig';

// 配置内存存储，因为我们会直接上传到OSS，所以不需要保存到本地
const storage = multer.memoryStorage()



const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 限制文件大小为10MB
  },
  fileFilter: (req, file, cb) => {
    // 只允许上传图片
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件！'));
    }
  },
})

export const uploadToOSS = async (file: Express.Multer.File): Promise<string> => {
  try {
    // 生成唯一的文件名，避免文件名冲突
    const ext = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    
    // 指定上传目录
    const objectName = `products/${fileName}`;
    
    const result = await ossConfig.put(objectName, file.buffer);
    
    if (!result.url) {
      throw new Error('OSS返回的URL为空');
    }
    
    return result.url;
  } catch (error) {
    console.error('OSS上传详细错误:', error);
    throw new Error(
      error instanceof Error 
        ? `上传到OSS失败: ${error.message}` 
        : '上传到OSS失败: 未知错误'
    );
  }
}

export default upload;