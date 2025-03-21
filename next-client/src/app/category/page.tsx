
"use client"
import { useState } from 'react'
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../state/api'
import { Edit, Delete } from '@mui/icons-material'

const Category = () => {
  const [open, setOpen] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const { data: categories, isLoading } = useGetCategoriesQuery("")
  const list = categories?.list || []
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleEdit = (row: any) => {
    setEditId(row.id)
    setCategoryName(row.categoryName)
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确定要删除这个分类吗？')) {
      await deleteCategory(id)
    }
  }

  const handleSubmit = async () => {
    if (categoryName.trim()) {
      if (editId) {
        await updateCategory({ id: editId, categoryName })
      } else {
        await createCategory({ categoryName })
      }
      setCategoryName('')
      setEditId(null)
      setOpen(false)
    }
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'categoryName', headerName: '分类名称', width: 200 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '操作',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<Edit />}
          label="编辑"
          onClick={() => handleEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<Delete />}
          label="删除"
          onClick={() => handleDelete(params.row.id)}
        />,
      ]
    }
  ]

  const handleClose = () => {
    setOpen(false)
    setEditId(null)
    setCategoryName('')
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">产品分类管理</h1>
        <Button variant="contained" onClick={() => setOpen(true)}>
          新增分类
        </Button>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={list || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
        />
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editId ? '编辑分类' : '新增分类'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="分类名称"
            fullWidth
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleSubmit} variant="contained">
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Category