"use client"
import { useGetProductsQuery, useCreateProductMutation } from "../state/api"
import { useState } from 'react'
import { PlusCircleIcon, SearchIcon } from "lucide-react";
import Header from "@/app/(components)/Header";
import Rating from "@/app/(components)/Rating";
import CreateProductDrawer from "./CreateProductDrawer";
import Image from "next/image";
import { NewProduct, Product } from '@/types/product'
import { Button } from '@mui/material';
import Link from 'next/link'
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
        <Link href="/products/add" className="button-style">
          <PlusCircleIcon className="w-5 h-5 mr-2 !text-gray-200" /> 添加产品
        </Link>

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
                <Image
                  src={product.image}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="mb-3 rounded-2xl w-36 h-36"
                />
                <div className="flex-1">
                  <h3 className="text-lg text-gray-900 font-semibold">
                    {product.name}
                  </h3>
                  <p className="text-gray-800">${product.price.toFixed(2)}</p>
                  <div className="text-sm text-gray-600 mt-1">
                    库存: {product.stockQuantity}
                  </div>
                  <div className="flex justify-between flex-1">
                    {product.rating && (
                      <div className="flex items-center mt-2">
                        <Rating rating={product.rating} />
                      </div>
                    )}
                    <Button variant="outlined" color="primary" size="small" >
                      编辑
                    </Button>
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