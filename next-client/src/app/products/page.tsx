"use client"
import { useGetProductsQuery, useCreateProductMutation } from "../state/api"
import { useState } from 'react'
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import type { TableColumnsType, TableProps } from 'antd';
type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection'];
import Image from "next/image";
import { NewProduct, Product } from '@/types/product'
import Link from 'next/link'
import { Button } from 'antd'
import { Table } from 'antd';
interface DataType {
  key: React.ReactNode;
  name: string;
  age: number;
  address: string;
  children?: DataType[];
}

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data,
    isLoading,
    isError,
  }: { data: any; isLoading: boolean; isError: boolean } = useGetProductsQuery(searchTerm);
  const [checkStrictly, setCheckStrictly] = useState(false);
  const products = data?.data?.list;
  function renderImage(images: string[]) {
    if (!images) return ''
    for (let i = 0; i < images.length; i++) {
      return (
        <Image
          key={i}
          src={images[i]}
          alt="Product Image"
          width={50}
          height={50}
          className="w-10 h-10 object-cover rounded"
        />
      );

    }
  }
  const columns: TableColumnsType<Product> = [
    {
      title: '主图',
      dataIndex: 'thumb',
      key: 'thumb',
      render: (thumb: string) => (
        <Image
          src={thumb}
          alt="Product Thumbnail"
          width={50}
          height={50}
          className="w-10 h-10 object-cover rounded"
        />
      ),
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: ['category', 'categoryName'],
      key: 'categoryName',
    },
    {
      title: '零售价',
      dataIndex: 'skus',
      key: 'retailPrice',
      render: (skus) => skus?.[0]?.retailPrice,
    },
    {
      title: '库存',
      dataIndex: 'skus',
      key: 'stock',
      render: (skus) => skus?.[0]?.stock,
    },
    {
      title: '销量',
      dataIndex: 'skus',
      key: 'soldQuantity',
      render: (skus) => skus?.[0]?.soldQuantity,
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Link href={`/products/add?id=${record.productId}`}>
          <Button type="link">编辑</Button>
        </Link>
      ),
    },
  ];

  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }
  if (isLoading) {
    return <div className="py-4">Loading...</div>;
  }

  if (isError || !products) {
    return (
      <div className="text-center text-red-500 py-4">
        Failed to fetch products
      </div>
    );
  }
  // rowSelection objects indicates the need for row selection
  const rowSelection: TableRowSelection<DataType> = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };
  return (
    <div className="mx-auto pb-5 w-full">

      {/* SEARCH BAR */}
      <div className="mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded">
          <SearchIcon className="w-5 h-5 text-gray-500 m-2" />

          <input
            className="w-full py-2 px-4 rounded bg-white"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Link href={`/products/add`}>
          <Button type="primary">新增</Button>
        </Link>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        rowKey="productId"
        dataSource={products}
      />
    </div>
  );
}

export default Products