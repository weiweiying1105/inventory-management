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
import imageCompression from 'browser-image-compression';

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles(Array.from(files));
    }
  };



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
    if (!selectedFiles.length) return;
    try {
      for (const file of selectedFiles) {
        // 新增：压缩图片
        const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 });
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('upload_preset', 'inventory');
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        if (data.secure_url) {
          const newPicture = {
            url: data.secure_url,
            name: data.original_filename
          };
          await savePicture(newPicture);
        }
      }
      setOpen(false);
      setSelectedFiles([]);
      setFormData({ url: '', name: '' });
      refetch();
    } catch (error) {
      console.error('保存图片失败:', error);
    }
  }
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
  }


  return (<div className='h-[100%]'>
    <div className='mb-[20px]'>
      <Button variant="contained" onClick={() => setOpen(true)} >新增图片</Button>
    </div>
    <ImageList sx={{ width: '100%', height: '100%', flexWrap: 'wrap', display: 'flex', overflowX: 'visible' }} cols={imgList.length || 1} rowHeight={180}>
      {imgList.map((item) => (
        <ImageListItem key={item.url} style={{ width: 180 }}>
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
      count={Math.ceil((imageData?.pagination?.total || 0) / SIZE)}
      page={page}
      onChange={(_, value) => handlePageChange(value)}
    />

    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
      <DialogTitle>上传图片</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{ border: '2px dashed #aaa', borderRadius: 8, padding: 24, marginBottom: 16, background: '#fafafa', cursor: 'pointer' }}
            onClick={() => document.getElementById('upload-image')?.click()}
          >
            Drag images here or click to select
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              id="upload-image"
              onChange={handleImageChange}
            />
          </div>
          {selectedFiles.length > 0 && (
            <Typography variant="body2" color="textSecondary">
              Selected: {selectedFiles.map(f => f.name).join(', ')}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>取消</Button>
        <Button
          onClick={handleUpload}
          disabled={!selectedFiles.length}
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

const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    setSelectedFiles(Array.from(files));
  }
};
const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  e.stopPropagation();
};