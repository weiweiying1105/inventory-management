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
import { Image } from '@/types/image'
import { useUploadImageMutation, useGetImagePageQuery } from "../state/api"

const Pictures = () => {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FormData | null>(null)
  const [uploadImage] = useUploadImageMutation();
  const [savePicture] = useSavePictureMutation();
  const [getImagePage] = useGetImagePageQuery();
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



  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const fd = new FormData();
      fd.append('image', selectedFile);
      fd.append('name', formData.name);

      const { data } = await uploadImage({ image: fd });
      if (data?.code === 200) {
        const newPicture = {
          ...formData,
          url: data.data.url,
        };
        await savePicture(newPicture);
        setOpen(false);
        setSelectedFile(null);
        setFormData({
          url: '',
          name: '',
        });
      }
    } catch (error) {
      console.error('保存图片失败:', error);
    }
  }
  const SIZE = 100;
  const [page, setPage] = useState(1)
  useEffect(() => {
    const fetchPictures = async () => {
      try {
        const { data } = await getImagePage({
          page: page,
          size: SIZE
        });
        if (data?.code === 200) {
          setImgList(data.list);
        }
      } catch (error) {
        console.error('获取图片失败:', error);
      }
    };
    fetchPictures();
  }, [page])


  return (<div>
    <Button variant="contained" onClick={() => setOpen(true)}>新增图片</Button>
    <ImageList sx={{ width: 500, height: 450 }}>

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
                aria-label={`info about ${item.name}`}
              >
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>



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