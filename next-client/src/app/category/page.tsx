
'use client'

import { useEffect, useState } from 'react'
import { useGetCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../state/api'
import { ICategory } from "@/types/category"
import { Table, Drawer, Button, Form, Input, Select, message, TreeSelect } from 'antd';
import { Drawer as AntDrawer, Modal, Image as AntImage } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useGetImagePageQuery } from '../state/api';

const Category = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const { data: categories, isLoading } = useGetCategoriesQuery("")
  const list = categories?.data || []
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(null);
 const [page, setPage] = useState(1);
  const SIZE = 100;
  const [imageList, setImageList] = useState<string[]>([]);
  // 获取图片列表
  const { data: imageData } = useGetImagePageQuery({
    page,
    size: SIZE
  });
  console.log('imageData',imageData)
 // 获取图片库
  useEffect(() => {
    console.log('imageData', imageData?.list);
    if (imageData?.list) {
      setImageList(imageData?.list);
    }
  }, [imageData?.list, page])
  const handleThumbnailSelect = (url: string) => {
    setSelectedThumbnail(url);
    form.setFieldsValue({ thumbnail: url });
    setImageModalOpen(false);
  };
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
      subCategoryName: record.subCategoryName,
      thumbnail: record.thumbnail
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
      title: '缩略图',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => thumbnail ? <img src={thumbnail} alt="缩略图" style={{ width: 40, height: 40, objectFit: 'cover' }} /> : null
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
            <TreeSelect
              allowClear
              placeholder="请选择父级分类"
              treeDefaultExpandAll
              treeData={list.filter((category: ICategory) => !editId || category.id !== editId).map((category: ICategory) => ({
                title: category.categoryName,
                value: category.id,
                key: category.id,
                children: Array.isArray(category.subCategory) && category.subCategory.length > 0
                  ? category.subCategory.map((sub: ICategory) => ({
                      title: sub.categoryName,
                      value: sub.id,
                      key: sub.id,
                      children: Array.isArray(sub.subCategory) && sub.subCategory.length > 0
                        ? sub.subCategory.map((sub2: ICategory) => ({
                            title: sub2.categoryName,
                            value: sub2.id,
                            key: sub2.id,
                            children: sub2.subCategory // 可继续递归
                          }))
                        : undefined
                  }))
                : undefined
              }))}
            />
          </Form.Item>

          <Form.Item
            name="subCategoryName"
            label="子分类名称"
          >
            <Input placeholder="请输入子分类名称" />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="缩略图"
          >
            <Button icon={<UploadOutlined />} onClick={() => setImageModalOpen(true)}>
              选择图片
            </Button>
            {form.getFieldValue('thumbnail') && (
              <img src={form.getFieldValue('thumbnail')} alt="缩略图预览" style={{ width: 80, height: 80, marginTop: 8, objectFit: 'cover' }} />
            )}
          </Form.Item>
          <Modal
            title="选择缩略图"
            open={imageModalOpen}
            onCancel={() => setImageModalOpen(false)}
            footer={null}
            width={600}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {(imageData?.list || []).map((img: any, idx: number) => {
                // 兼容 img 既可能为 string 也可能为 Image 类型
                const url = typeof img === 'string' ? img : (img && typeof img.url === 'string' ? img.url : '');
                return (
                  <div key={url || idx} style={{ border: form.getFieldValue('thumbnail') === url ? '2px solid #1890ff' : '1px solid #eee', borderRadius: 4, padding: 4, cursor: 'pointer' }} onClick={() => handleThumbnailSelect(url)}>
                    <AntImage src={url} width={100} height={100} style={{ objectFit: 'cover' }} preview={false} />
                  </div>
                );
              })}
            </div>
          </Modal>

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

