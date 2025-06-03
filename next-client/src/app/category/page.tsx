
'use client'

import { useState } from 'react'
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../state/api'
import { ICategory } from "@/types/category"
import { Table, Drawer, Button, Form, Input, Select, message } from 'antd';

const Category = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  
  const { data: categories, isLoading } = useGetCategoriesQuery("")
  const list = categories?.list || []
  
  const [createCategory] = useCreateCategoryMutation()
  const [updateCategory] = useUpdateCategoryMutation()
  const [deleteCategory] = useDeleteCategoryMutation()

  const handleSubmit = async (values: any) => {
    try {
      if (editId) {
        await updateCategory({ id: editId, ...values })
        message.success('分类更新成功')
      } else {
        await createCategory(values)
        message.success('分类创建成功')
      }
      setOpen(false)
      form.resetFields()
      setEditId(null)
    } catch (error) {
      message.error(editId ? '更新失败' : '创建失败')
    }
  }

  const handleEdit = (record: ICategory) => {
    setEditId(record.id)
    form.setFieldsValue({
      categoryName: record.categoryName,
      description: record.description,
      parentId: record.parentId,
      subCategoryName: record.subCategoryName
    })
    setOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory({ id })
      message.success('删除成功')
    } catch (error) {
      message.error('删除失败')
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
      render: (_, record: ICategory) => (
        <div className="space-x-2">
          <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">产品分类管理</h1>
        <Button onClick={() => setOpen(true)} type='primary'>
          新增分类
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={list}
        loading={isLoading}
        rowKey="id"
        expandable={{
          childrenColumnName: 'subCategory'
        }}
      />

      <Drawer
        title={editId ? "编辑分类" : "新增分类"}
        placement="right"
        onClose={() => {
          setOpen(false)
          setEditId(null)
          form.resetFields()
        }}
        open={open}
        width={400}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea placeholder="请输入分类描述" />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="父级分类"
          >
            <Select
              allowClear
              placeholder="请选择父级分类"
            >
              {list.map((category: ICategory) => (
                <Select.Option key={category.id} value={category.id}>
                  {category.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subCategoryName"
            label="子分类名称"
          >
            <Input placeholder="请输入子分类名称" />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setOpen(false)}>取消</Button>
            <Button type="primary" htmlType="submit">
              {editId ? '更新' : '创建'}
            </Button>
          </div>
        </Form>
      </Drawer>
    </div>
  )
}

export default Category