"use client"
import { useGetProductsQuery, useCreateProductMutation } from "../state/api"
import { useState } from 'react'
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductDrawer from "./CreateProductDrawer";
import Image from "next/image";
import { NewProduct, Product } from '@/types/product'
import Link from 'next/link'
import {Button} from 'antd'
import { Table } from 'antd';
const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    data,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);
  const products = data?.data?.list;
  function renderImage(images: string[]) {
    if(!images) return ''
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
 const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        console.log(image),
        renderImage(image)
      ),
    },
    {
      title: '分类',
      dataIndex: ['category', 'categoryName'],
      key: 'category',
    },
    {
      title: '存储方式',
      dataIndex: 'storageMethod',
      key: 'storageMethod',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
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

      {/* TABLE */}
      <Table columns={columns} dataSource={products} rowKey="productId" />
    </div>
  );
}

export default Products