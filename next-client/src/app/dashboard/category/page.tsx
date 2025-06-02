'use client'
import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';

interface Category {
  id: number;
  categoryName: string;
  subCategoryName?: string;
  description?: string;
  parentId?: number;
  subCategory?: Category[];
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      message.error('获取分类列表失败');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (data.success) {
        message.success('创建成功');
        setIsModalVisible(false);
        form.resetFields();
        fetchCategories();
      }
    } catch (error) {
      message.error('创建失败');
    }
  };

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
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          新建分类
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        expandable={{
          childrenColumnName: 'subCategory'
        }}
      />

      <Modal
        title="新建分类"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleCreate}
          layout="vertical"
        >
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="subCategoryName"
            label="子分类名称"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="parentId"
            label="父分类"
          >
            <Select allowClear>
              {categories.map(cat => (
                <Select.Option key={cat.id} value={cat.id}>
                  {cat.categoryName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}