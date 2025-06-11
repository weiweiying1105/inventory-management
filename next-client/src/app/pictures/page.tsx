"use client"
import { useState, useEffect } from 'react'
import {
  Button, ImageList, ImageListItem, ImageListItemBar, ListSubheader, IconButton, Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography
} from '@mui/material'
import { Cloudinary } from 'cloudinary-core';

const cloudinary = new Cloudinary({
 cloud_name: 'dc6wdjxld', 
        api_key: '925588468673723', 
  api_secret: 'gBuAbiJsd-4jaWEDqpCkbwNMogk'
});

import { ContentCopy } from '@mui/icons-material';
import { Image } from '@/types/image'
import { useUploadImageMutation, useGetImagePageQuery, useSavePictureMutation } from "../state/api"
import { Pagination } from '@mui/material'
const Pictures = () => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FormData | null>(null)
  const [uploadImage] = useUploadImageMutation();
  const [savePicture] = useSavePictureMutation();
  const SIZE = 100;
  const [page, setPage] = useState(1)
  const [imgList, setImgList] = useState<Image[]>([])
  const [formData, setFormData] = useState({
    url: '',
    name: ''
  })
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({
        ...formData,
        name: file.name
      });
    }
  }



  // 修改这里：直接传入参数对象
  // 修改这里，添加 refetch
  const { data: imageData, refetch } = useGetImagePageQuery({
    page: page,
    size: SIZE
  });
  useEffect(() => {
    console.log('imageData', imageData);
    if (imageData?.list) {
      setImgList(imageData.list);
    }
  }, [imageData, page]);




const handleUpload = async () => {
  if (!selectedFile) return;

  try {
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', 'inventory');

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (data.secure_url) {
      const newPicture = {
        ...formData,
        url: data.secure_url,
        name: data.original_filename
      };
      await savePicture(newPicture);
      setOpen(false);
      setSelectedFile(null);
      setFormData({
        url: '',
        name: '',
      });
      refetch(); // 刷新图片列表
    }
  } catch (error) {
    console.error('保存图片失败:', error);
  }
}
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  }


  return (<div>
    <div className='mb-[20px]'>
      <Button variant="contained" onClick={() => setOpen(true)} >新增图片</Button>
    </div>
    <ImageList sx={{ width: 450, height: 450 }}>
      {imgList.map((item) => (
        <ImageListItem key={item.url}>
          <img
            srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.url}?w=248&fit=crop&auto=format`}
            alt={item.name}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.name}
            subtitle={item.name}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`copy link for ${item.url}`}
                onClick={() => handleCopyLink(item.url)}
              >
                <ContentCopy />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>

    <Pagination
      count={Math.ceil(imageData?.pagination?.total || 0 / SIZE)}
      page={page}
      onChange={(_, value) => handlePageChange(value)}
    />

    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
      <DialogTitle>上传图片</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-image"
            onChange={handleImageChange}
          />
          <label htmlFor="upload-image">
            <Button
              variant="outlined"
              component="span"
              sx={{ mb: 2 }}
            >
              选择图片
            </Button>
          </label>
          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              已选择: {selectedFile.name}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>取消</Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFile}
          color="primary"
        >
          上传
        </Button>
      </DialogActions>
    </Dialog>
  </div >
  )
}

export default Pictures