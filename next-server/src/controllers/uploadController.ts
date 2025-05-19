import { Request, Response } from "express";
import { uploadToOSS } from "../utils/multerConfig";

export const uploadImage = async (req: Request, res: Response) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = await uploadToOSS(file);
    res.status(200).json({
      code: 200,
      data: {
        url
      },
      message: '上传成功'
    });
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({
      code: 500,
      error: '图片上传失败',
      message: error instanceof Error ? error.message : '未知错误'
    });
  }
}