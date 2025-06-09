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
const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    isLoading,
    isError,
  } = useGetProductsQuery(searchTerm);
  const products = data?.data?.list;

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

      {/* HEADER BAR */}
      <div className="flex justify-between items-center mb-6">
        <Header name="Products" />
        <Button type="primary">
        <Link href="/products/add" className="button-style flex justify-center">
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> 添加产品
        </Link>
        </Button>

      </div>

      {/* BODY PRODUCTS LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg-grid-cols-3 gap-10 justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          products?.map((product) => (
            <div
              key={product.productId}
              className="border bg-white shadow rounded-md p-4 max-w-full w-full mx-auto"
            >
              <div className="flex justify-start items-center gap-5">
                {/* 展示多张图片 */}
                <div className="flex flex-col gap-2">
                  {product.images && product.images.length > 0 ? (
                    product.images.map((imgUrl: string, idx: number) => (
                      <Image
                        key={idx}
                        src={imgUrl}
                        alt={product.name}
                        width={80}
                        height={80}
                        className="mb-1 rounded-xl w-20 h-20"
                      />
                    ))
                  ) : (
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">无图片</div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 font-semibold">{product.name}</h3>
                  <div className="text-gray-800">分类ID: {product.category.categoryName}</div>
                  <div className="text-gray-800">存储方式: {product.storageMethod}</div>
                  <div className="text-gray-800">描述: {product.description}</div>
                  <div className="text-gray-800">评分: {product.rating}</div>
                  <div className="text-gray-800">热门: {product.isPopular ? '是' : '否'} 热销: {product.isHot ? '是' : '否'} 新品: {product.isNew ? '是' : '否'} 推荐: {product.isRecommend ? '是' : '否'}</div>
                  {/* SKU 列表 */}
                  <div className="mt-2">
                    <div className="font-semibold">SKU 列表：</div>
                    {product.skus && product.skus.length > 0 ? (
                      product.skus.map((sku: any, skuIdx: number) => (
                        <div key={skuIdx} className="border p-2 rounded mb-2 bg-gray-50">
                          <div>单位: {sku.unit}</div>
                          <div>零售价: {sku.retailPrice}</div>
                          <div>批发价: {sku.wholesalePrice}</div>
                          <div>会员价: {sku.memberPrice}</div>
                          <div>库存: {sku.stock}</div>
                          <div>编码: {sku.code}</div>
                          <div>默认: {sku.isDefault ? '是' : '否'}</div>
                        </div>
                      ))
                    ) : (
                      <div>无SKU</div>
                    )}
                  </div>
                  <div className="flex justify-between flex-1 mt-2">
                    {product.rating && (
                      <div className="flex items-center">
                        <Rating rating={product.rating} />
                      </div>
                    )}
                    <Link href={`/products/add?id=${product.productId}`} className="button-style flex justify-center">
                    <Button variant="outlined" color="primary" size="small" >编辑</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {/* <CreateProductDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProduct}
      /> */}
    </div>
  );
}

export default Products