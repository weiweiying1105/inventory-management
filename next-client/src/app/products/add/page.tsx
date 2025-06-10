/*
 * @Author: your name
 * @Date: 2025-06-06 09:52:49
 * @LastEditTime: 2025-06-06 14:24:23
 * @LastEditors: 韦玮莹
 * @Description: In User Settings Edit
 * @FilePath: \inventory-management\next-client\src\app\products\add\page.tsx
 */
"use client"
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Header from "@/app/(components)/Header";
import { NewProduct } from "@/types/product";
import { useGetImagePageQuery, useGetCategoriesQuery, useCreateProductMutation } from "../../state/api";
import { Drawer, Modal, Image as AntImage, Select, Button ,Pagination,} from "antd";
import { Image } from "@/types/image";

type CreateProductDrawerProps = {

}

const CreateProductDrawer = (props: CreateProductDrawerProps) => {
  const [imgList, setImgList] = useState<Image[]>([]);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const SIZE =100;
 const [selectedImages,setSelectImages] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const { data: categories, isLoading } = useGetCategoriesQuery("");
  const list = categories?.data || [];
  const [formData, setFormData] = useState({
    name: '',
    categoryId: 0,
    storageMethod: '',
    description: '',
    images: [],
    rating: 0,
    isPopular: false,
    isHot: false,
    isNew: false,
    isRecommend: false,
    skus: [{
      unit: '',
      retailPrice: 0,
      wholesalePrice: 0,
      memberPrice: 0,
      weight: 0,
      dimensions: '',
      stock: 0,
      code: '',
      isDefault: true
    }]
  });

  // 获取图片列表
  const { data:imageData } = useGetImagePageQuery({
    page: 1,
    size: 100
  });
  useEffect(() => {
    console.log('imageData', imageData?.list);
    if(imageData?.list){
      setImageList(imageData?.list);
    }
  },[imageData?.list,page])


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rating" ? parseFloat(value) : value
    });
  };

  const handleSkuChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSkus = [...formData.skus];
    newSkus[0] = {
      ...newSkus[0],
      [name]: name === "stock" || name.includes("Price") || name === "weight"
        ? parseFloat(value)
        : value
    };
    setFormData({ ...formData, skus: newSkus });
  };
  const [createProduct] = useCreateProductMutation();
  const handleSubmit = async (productData: NewProduct) => {
    for (const key in productData) {
      if (productData[key as keyof NewProduct] === '') {
        console.log(key + '为空', productData[key as keyof NewProduct]);
        return;
      }
    }
    // 自动添加 defaultSku 字段
    const defaultSku = productData.skus.find(sku => sku.isDefault) || productData.skus[0];
    await createProduct({ ...productData, defaultSku });
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  // 添加新的 SKU
  const handleAddSku = () => {
    const newSkuIndex = formData.skus.length;
    setFormData({
      ...formData,
      skus: [
        ...formData.skus,
        {
          unit: '',
          retailPrice: 0,
          wholesalePrice: 0,
          memberPrice: 0,
          weight: 0,
          dimensions: '',
          stock: 0,
          code: generateSKUCode(formData.categoryId, newSkuIndex),
          isDefault: false
        }
      ]
    });
  };

  // 删除指定的 SKU
  const handleRemoveSku = (index: number) => {
    if (formData.skus.length === 1) {
      return; // 保留至少一个 SKU
    }
    const newSkus = formData.skus.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      skus: newSkus
    });
  };

  const generateSKUCode = (categoryId: number, index: number) => {
    const categoryCode = categoryId.toString().padStart(2, '0');
    const productCode = Math.floor(Math.random() * 1000000).toString().padStart(4, '0');
    const skuVariant = index.toString().padStart(2, '0');
    return `${categoryCode}${productCode}${skuVariant}`;
  }

  // 处理图片选择
  const handleImageSelect = (url: string) => {
    setFormData({...formData, images: [...(formData.images || []), url] });
    setImageModalOpen(false);
  };
  // 确认图片
  const handleConfirmImages = () => {
    setSelectImages(formData.images || []);
    setImageModalOpen(false);
  }
  

  return (
    <>

      <form className="mt-5"  method="POST" onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(formData);
      }}>
        <label htmlFor="name" className={labelCssStyles}>Product Name</label>
        <input
          type="text"
          name="name"
          placeholder="Name"
          onChange={handleChange}
          value={formData.name}
          className={inputCssStyles}
          required
        />

        <label htmlFor="categoryId" className={labelCssStyles}>Category</label>
        <Select
          className="w-full mb-2"
          name="categoryId"
          placeholder="请选择商品分类"
          value={formData.categoryId || undefined}
          onChange={(value) => setFormData({ ...formData, categoryId: value })}
        >
          {list.map((category) => (
            <React.Fragment key={category.id}>
              <Select.Option value={category.id}>
                {category.categoryName}
              </Select.Option>
              {category.subCategory?.map((sub) => (
                <Select.Option key={sub.id} value={sub.id}>
                  ├─ {sub.categoryName}
                </Select.Option>
              ))}
            </React.Fragment>
          ))}
        </Select>
        <label htmlFor="storageMethod" className={labelCssStyles}>存储方式</label>
        <input
          type="text"
          name="storageMethod"
          placeholder="存储方式"
          onChange={handleChange}
          value={formData.storageMethod}
          className={inputCssStyles}
          required
        />
        <label htmlFor="description" className={labelCssStyles}>描述</label>
        <textarea
          name="description"
          placeholder="描述（选填）"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          value={formData.description}
          className={inputCssStyles}
        />
      {/* 添加图片选择区域 */}
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">商品图片</h3>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.images?.map((url, index) => (
            <div key={index} className="relative w-24 h-24">
              <AntImage
                src={url}
                alt={`商品图片 ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        <Button type="primary" onClick={() => setImageModalOpen(true)}>
          选择图片
        </Button>
      </div>
        {/* SKU 信息 */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">SKU 信息</h3>
            <Button type="primary" onClick={handleAddSku}>添加规格</Button>
          </div>

          {formData.skus.map((sku, index) => (
            <div key={index} className="border p-4 rounded-md mb-4 relative">
              {index > 0 && (
                <Button
                  type="text"
                  danger
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveSku(index)}
                >
                  删除
                </Button>
              )}

              <div className="mb-4">
                <label className={labelCssStyles}>默认规格</label>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={sku.isDefault}
                  onChange={(e) => {
                    const newSkus = formData.skus.map((s, i) => ({
                      ...s,
                      isDefault: i === index ? e.target.checked : false
                    }));
                    setFormData({ ...formData, skus: newSkus });
                  }}
                  className="mr-2"
                />
              </div>

              <label htmlFor={`unit-${index}`} className={labelCssStyles}>单位</label>
              <input
                type="text"
                name="unit"
                placeholder="单位（如：条、kg、100g等）"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.unit}
                className={inputCssStyles}
                required
              />

              <label htmlFor={`retailPrice-${index}`} className={labelCssStyles}>零售价</label>
              <input
                type="number"
                name="retailPrice"
                placeholder="零售价"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.retailPrice}
                className={inputCssStyles}
                required
              />

              <label htmlFor={`wholesalePrice-${index}`} className={labelCssStyles}>批发价</label>
              <input
                type="number"
                name="wholesalePrice"
                placeholder="批发价"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.wholesalePrice}
                className={inputCssStyles}

              />

              <label htmlFor={`memberPrice-${index}`} className={labelCssStyles}>会员价</label>
              <input
                type="number"
                name="memberPrice"
                placeholder="会员价"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.memberPrice}
                className={inputCssStyles}
              />

              <label htmlFor={`weight-${index}`} className={labelCssStyles}>重量</label>
              <input
                type="number"
                name="weight"
                placeholder="重量"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.weight}
                className={inputCssStyles}
              />

              <label htmlFor={`dimensions-${index}`} className={labelCssStyles}>尺寸</label>
              <input
                type="text"
                name="dimensions"
                placeholder="包装尺寸(选填)"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.dimensions}
                className={inputCssStyles}
              />

              <label htmlFor={`stock-${index}`} className={labelCssStyles}>库存</label>
              <input
                type="number"
                name="stock"
                placeholder="库存"
                onChange={(e) => handleSkuChange(e, index)}
                value={sku.stock}
                className={inputCssStyles}
                required
              />


            </div>
          ))}
        </div>

        {/* 商品属性 */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">商品属性</h3>
          <div className="flex flex-wrap gap-4 mt-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="mr-2"
              />
              热门
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isHot"
                checked={formData.isHot}
                onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                className="mr-2"
              />
              热销
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                className="mr-2"
              />
              新品
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isRecommend"
                checked={formData.isRecommend}
                onChange={(e) => setFormData({ ...formData, isRecommend: e.target.checked })}
                className="mr-2"
              />
              推荐
            </label>
          </div>
        </div>

        {/* 按钮部分保持不变 */}
        <div className="flex justify-end mt-4">
          <Button type="primary" htmlType="submit">
            创建
          </Button>
        </div>
      </form>


      {/* 图片选择模态框保持不变 */}

      {/* 图片选择模态框 */}
      <Modal
        title="选择商品图片"
        open={imageModalOpen}
        onCancel={() => setImageModalOpen(false)}
        onOk={handleConfirmImages}
        width={800}
      >
        <div className="grid grid-cols-4 gap-4">
          {imageList.map((item) => (
            <div
              key={item.url}
              className={`relative cursor-pointer border-2 ${selectedImages.includes(item.url) ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => handleImageSelect(item.url)}
            >
              <AntImage
                src={item.url}
                alt={item.name}
                className="w-full h-32 object-cover"
              />
              {selectedImages.includes(item.url) && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page}
            total={imageData?.total || 0}
            pageSize={SIZE}
            onChange={(page) => setPage(page)}
          />
        </div>
      </Modal>
    </>
  );
};

export default CreateProductDrawer;