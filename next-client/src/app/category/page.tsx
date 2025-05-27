
"use client"
import { useState } from 'react'
// import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid'
// import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../state/api'
import { Edit, Delete } from '@mui/icons-material'
import { ICategory } from "@/types/category"
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
const Category = () => {
   const [form] = Form.useForm();
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
      await deleteCategory({ id })
    }
  }

  const handleCreate = async () => {
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

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: '子分类名称',
      dataIndex: 'subCategoryName',
      key: 'subCategoryName',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '产品数量',
      key: 'productsCount',
      render: (record: ICategory) => record.products?.length || 0
    },
    {
      title: '操作',
      key: 'action',
      render: (record: ICategory) => (
        <Button type="link" onClick={() => handleDelete(record.id)}>删除</Button>
      )
    }
  ];

  const handleClose = () => {
    setOpen(false)
    setEditId(null)
    setCategoryName('')
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">产品分类管理</h1>
        <Button variant="contained" onClick={() => setOpen(true)}>
          新增分类
        </Button>
      </div>

      <div style={{ height: 400, width: '100%' }}>
        <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="name" label="商品名称" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="categoryId" label="商品分类">
          <Select allowClear>
            {categories.map(cat => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="unit" label="单位" rules={[{ required: true }]}>
          <Input placeholder="如：件、kg、个" />
        </Form.Item>

        <Form.Item name="storageMethod" label="储存方式">
          <Select>
            <Select.Option value="常温">常温</Select.Option>
            <Select.Option value="冷藏">冷藏</Select.Option>
            <Select.Option value="冷冻">冷冻</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="price" label="价格" rules={[{ required: true }]}>
          <InputNumber min={0} step={0.01} />
        </Form.Item>

        <Form.Item name="stock" label="库存" rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="description" label="商品描述">
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="商品图片">
          <Upload {...uploadProps} listType="picture-card">
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">创建商品</Button>
        </Form.Item>
      </Form>
      </div>

      <Modal
        title="新建分类"
        open={open}
        onCancel={() => handleClose()}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="subCategoryName" label="子分类名称">
            <Input />
          </Form.Item>

          <Form.Item name="parentId" label="父分类">
            <Select allowClear>
              {list.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="描述">
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">确定</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Category