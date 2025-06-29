/*
 * @Author: your name
 * @Date: 2025-06-06 09:52:49
 * @LastEditTime: 2025-06-06 14:24:23
 * @LastEditors: 韦玮莹
 * @Description: In User Settings Edit
 * @FilePath: \inventory-management\next-client\src\app\products\add\page.tsx
 */
"use client"
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { NewProduct } from "@/types/product";
import { useGetImagePageQuery, useGetCategoriesQuery, useCreateProductMutation, useUpdateProductMutation, useGetProductDetailQuery } from "../../state/api";
import { Drawer, Modal, Image as AntImage, Select, Button, Pagination, } from "antd";
import { Checkbox, Col, Row } from 'antd';
import type { GetProp } from 'antd';
import { ICategory } from "@/types/category"
import { TreeSelect } from "antd";
import { truncate } from "fs";

type CreateProductDrawerProps = {

}

const CreateProductDrawer = (props: CreateProductDrawerProps) => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const router = useRouter()

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const SIZE = 100;
  const [selectedImages, setSelectImages] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const { data: categories, isLoading } = useGetCategoriesQuery("");
  const list = categories?.data || [];
  // 获取图片列表
  const { data: imageData } = useGetImagePageQuery({
    page: 1,
    size: 100
  });
  const [formData, setFormData] = useState({
    tags:[],
    name: '',
    categoryId: 0,
    storageMethod: '',
    description: '',
    images: [] as string[],
    thumb: '',
    rating: 0,
    isPopular: false,
    isHot: false,
    isNew: false,
    isRecommend: false,
    specGroups: [   // 示例：
      {
        name: '',
        values: [
          { value: '' },
        ]
      }], // 添加规格组字段
    skus: [{
      unit: '',
      retailPrice: 0,
      wholesalePrice: 0,
      memberPrice: 0,
      weight: 0,
      dimensions: '',
      stock: 0,
      code: '',
      isDefault: true,
      specValues: [
        // 示例：
        // {
        //   specValueIds: [1, 3], // 对应红色+S的规格值ID
        //   retailPrice: 100,
        //   wholesalePrice: 80,
        //   memberPrice: 90,
        //   stock: 50,
        //   code: 'AUTO_GENERATED',
        //   unit: '件',
        //   weight: 0.5,
        //   dimensions: '10x10x5',
        //   isDefault: false
      ] // 添加规格值字段
    }]
  });
  // 获取图片库
  useEffect(() => {
    console.log('imageData', imageData?.list);
    if (imageData?.list) {
      setImageList(imageData?.list);
    }
  }, [imageData?.list, page])
  // 接口获取产品详情
  const { data: productDetail } = productId ? useGetProductDetailQuery({ id: productId }) : { data: null };
  useEffect(() => {
    if (productDetail) {
      //  console.log('productDetail', productDetail?.data);
      productDetail && productDetail?.data && setFormData(productDetail?.data);
    }
  }, [productDetail])

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
  const [updateProduct] = useUpdateProductMutation();
  const handleSubmit = async (productData: NewProduct) => {
    console.log('productData', productData);
    for (const key in productData) {
      if (productData[key as keyof NewProduct] === '') {
        console.log(key + '为空', productData[key as keyof NewProduct]);
        return;
      }
    }
    // 自动添加 defaultSku 字段
    const defaultSku = productData.skus.find(sku => sku.isDefault) || productData.skus[0];
    if (productData.productId) {
      await updateProduct({ ...productData, defaultSku });

    } else {
      const res = await createProduct({ ...productData, defaultSku });
    }

    router.back()
  };

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";
  const generateSKUCode = (categoryId: number, index: number) => {
    const categoryCode = categoryId.toString().padStart(2, '0');
    const productCode = Math.floor(Math.random() * 1000000).toString().padStart(4, '0');
    const skuVariant = index.toString().padStart(2, '0');
    return `${categoryCode}${productCode}${skuVariant}`;
  }


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
          isDefault: false,
          specValues: []
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


  // 确认图片
  const handleConfirmImages = () => {
    setSelectImages(formData.images || []);
    setImageModalOpen(false);
  }
  const onImageChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
    if (chooseImgType === 'thumb') {
      setFormData({ ...formData, thumb: checkedValues[0] as string });
    } else {
      setFormData({ ...formData, images: checkedValues as string[] });
    }
  };
  // 添加规格组
  const handleAddSpecGroup = () => {
    setFormData({
      ...formData,
      specGroups: [
        ...formData.specGroups,
        {
          name: '',
          values: [{ value: '' }]
        }
      ]
    });
  };

  // 删除规格组
  const handleRemoveSpecGroup = (groupIndex: number) => {
    const newSpecGroups = formData.specGroups.filter((_, i) => i !== groupIndex);
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 更新规格组名称
  const handleSpecGroupNameChange = (groupIndex: number, name: string) => {
    const newSpecGroups = [...formData.specGroups];
    newSpecGroups[groupIndex] = { ...newSpecGroups[groupIndex], name };
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 添加规格值
  const handleAddSpecValue = (groupIndex: number) => {
    const newSpecGroups = [...formData.specGroups];
    newSpecGroups[groupIndex].values.push({ value: '' });
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 删除规格值
  const handleRemoveSpecValue = (groupIndex: number, valueIndex: number) => {
    const newSpecGroups = [...formData.specGroups];
    newSpecGroups[groupIndex].values = newSpecGroups[groupIndex].values.filter((_, i) => i !== valueIndex);
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 更新规格值
  const handleSpecValueChange = (groupIndex: number, valueIndex: number, value: string) => {
    const newSpecGroups = [...formData.specGroups];
    newSpecGroups[groupIndex].values[valueIndex] = { value };
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 根据规格组合生成SKU
  const generateSkuCombinations = () => {
    // 过滤掉无效的规格组和规格值
    const validGroups = formData.specGroups
      .filter(group => group.name && group.values && group.values.some(v => v.value))
      .map(group => ({
        name: group.name,
        values: group.values.filter(v => v.value)
      }));
    if (validGroups.length === 0) {
      // 如果没有有效规格组，创建一个默认SKU
      return [{
        specValueIds: [],
        retailPrice: 0,
        wholesalePrice: 0,
        memberPrice: 0,
        stock: 0,
        code: generateSKUCode(formData.categoryId, 0),
        unit: '',
        weight: 0,
        dimensions: '',
        isDefault: true
      }];
    }
    // 计算所有规格值的组合
    const groups = validGroups.map(group =>
      group.values.map(value => ({
        groupName: group.name,
        value: value.value,
        id: value.id || `${group.name}-${value.value}`
      }))
    );
    // Cartesian product utility
    function cartesian(arr) {
      if (arr.length === 0) return [];
      if (arr.length === 1) return arr[0].map(item => [item]);
      return arr.reduce((a, b) => a.flatMap(d => b.map(e => [].concat(d, e))));
    }
    const allCombinations = groups.length > 0 ? cartesian(groups) : [];
    return allCombinations.map((combination, index) => ({
      specValueIds: combination.map(item => item.id),
      specValueNames: combination.map(item => `${item.groupName}:${item.value}`).join(', '),
      retailPrice: 0,
      wholesalePrice: 0,
      memberPrice: 0,
      stock: 0,
      code: generateSKUCode(formData.categoryId, index),
      unit: '',
      weight: 0,
      dimensions: '',
      isDefault: index === 0
    }));
  };
  // 当规格组变化时，重新生成SKU
  const handleSpecGroupsChange = () => {
    const newSkus = generateSkuCombinations();
    setFormData({ ...formData, skus: newSkus });
  };

const [chooseImgType, setChooseImgType] = useState('image');
const handleOpenModal = (type:string) => {
    setChooseImgType(type);
    setImageModalOpen(true);
}
   
  
  return (
    <>

      <form className="mt-5" method="POST" onSubmit={(e) => {
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
         <TreeSelect
              allowClear
              placeholder="请选择父级分类"
              treeDefaultExpandAll
              treeData={list.map((category: ICategory) => ({
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
              onChange={(value) => setFormData({ ...formData, categoryId: value })}
            />
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
          <h3 className="text-lg font-medium mb-2">商品主图</h3>
          <div className="flex flex-wrap gap-5 mb-2">
              <div className="relative w-24 h-24">
                <AntImage
                  src={formData.thumb}
                  alt={`商品主图`}
                  className="w-full h-full object-cover"
                />
              </div>
          </div>
          <Button type="primary" onClick={() => handleOpenModal('thumb')}>
            选择图片
          </Button>
        </div>
        {/* 添加图片选择区域 */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">商品图片</h3>
          <div className="flex flex-wrap gap-5 mb-2">
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
          <Button type="primary" onClick={() => handleOpenModal('images')}>
            选择图片
          </Button>
        </div>
        {/* 规格组管理 */}

        {/* 规格组管理 */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">商品规格设置</h3>
            <Button type="primary" onClick={handleAddSpecGroup}>添加规格组</Button>
          </div>

          {formData.specGroups?.map((group, groupIndex) => (
            <div key={groupIndex} className="border p-4 rounded-md mb-4 relative">
              {/* 规格组名称和规格值设置 */}
              <Button
                type="text"
                danger
                className="absolute top-1 right-2"
                onClick={() => handleRemoveSpecGroup(groupIndex)}
              >
                删除规格组
              </Button>

              <div className="mb-4">
                <label className={labelCssStyles}>规格组名称</label>
                <input
                  type="text"
                  placeholder="如：颜色、尺寸等"
                  value={group.name}
                  onChange={(e) => handleSpecGroupNameChange(groupIndex, e.target.value)}
                  className={inputCssStyles}
                  required
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className={labelCssStyles}>规格值</label>
                  <Button size="small" onClick={() => handleAddSpecValue(groupIndex)}>添加规格值</Button>
                </div>

                {group.values?.map((value, valueIndex) => (
                  <div key={valueIndex} className="flex items-center mb-2">
                    <input
                      type="text"
                      placeholder="规格值"
                      value={value.value}
                      onChange={(e) => handleSpecValueChange(groupIndex, valueIndex, e.target.value)}
                      className={`${inputCssStyles} flex-1 mr-2`}
                      required
                    />
                    {group.values.length > 1 && (
                      <Button
                        size="small"
                        danger
                        onClick={() => handleRemoveSpecValue(groupIndex, valueIndex)}
                      >
                        删除
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* 生成SKU按钮 */}
          <div className="mb-4">
            <Button
              type="default"
              onClick={handleSpecGroupsChange}
              disabled={formData.specGroups.length === 0}
            >
              根据规格组合生成SKU
            </Button>
          </div>
        </div>

        {/* SKU价格和库存设置 */}
        <div className="mt-4">
          <h3 className="text-lg font-medium">SKU价格库存设置</h3>
          {formData.skus?.map((sku, index) => (
            <div key={index} className="border p-4 rounded-md mb-4">
              <div className="mb-2">
                <strong>规格组合：</strong>
                {sku.specValueNames || '默认规格'}
              </div>

              {/* 是否默认规格 */}
              <div className="mb-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={sku.isDefault}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, unit: e.target.value } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className="mr-2"
                  />
                  设为默认规格
                </label>
              </div>

              {/* 基本信息 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCssStyles}>单位</label>
                  <input
                    type="text"
                    placeholder="如：件、个、盒等"
                    value={sku.unit}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, unit: e.target.value } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
                <div>
                  <label className={labelCssStyles}>重量(kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="商品重量"
                    value={sku.weight}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, weight: Number(e.target.value) } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
              </div>

              {/* 尺寸 */}
              <div className="mb-4">
                <label className={labelCssStyles}>尺寸规格</label>
                <input
                  type="text"
                  placeholder="如：长x宽x高(cm)"
                  value={sku.dimensions}
                  onChange={(e) => {
                    const newSkus = formData.skus.map((sku, i) =>
                      i === index ? { ...sku, dimensions: e.target.value } : { ...sku }
                    );
                    setFormData({ ...formData, skus: newSkus });
                  }}
                  className={inputCssStyles}
                />
              </div>

              {/* 价格设置 */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={labelCssStyles}>零售价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sku.retailPrice}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, retailPrice: Number(e.target.value) } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
                <div>
                  <label className={labelCssStyles}>批发价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sku.wholesalePrice}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, wholesalePrice: Number(e.target.value) } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
                <div>
                  <label className={labelCssStyles}>会员价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sku.memberPrice}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, memberPrice: Number(e.target.value) } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
                <div>
                  <label className={labelCssStyles}>库存</label>
                  <input
                    type="number"
                    value={sku.stock}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((sku, i) =>
                        i === index ? { ...sku, stock: Number(e.target.value) } : { ...sku }
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
              </div>

              {/* SKU编码 */}
              <div className="mb-4">
                <label className={labelCssStyles}>SKU编码</label>
                <input
                  type="text"
                  placeholder="自动生成或手动输入"
                  value={sku.code}
                  onChange={(e) => {
                    const newSkus = formData.skus.map((sku, i) =>
                      i === index ? { ...sku, code: e.target.value } : { ...sku }
                    );
                    setFormData({ ...formData, skus: newSkus });
                  }}
                  className={inputCssStyles}
                />
              </div>
            </div>
          ))}
        </div>
        {/* tags */}
       <label htmlFor="tags" className={labelCssStyles}>标签（可多个，用逗号分隔）</label>
        <input
          type="text"
          name="tags"
          placeholder="如：新品,热卖,限时"
          value={formData.tags ? formData.tags.join('，') : ''}
          onChange={e => setFormData({ ...formData, tags: e.target.value.split('，').map(tag => tag.trim()).filter(Boolean) })}
          className={inputCssStyles}
        />

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
        <div>
          <Checkbox.Group style={{ width: '100%' }} onChange={onImageChange}>
            <Row>
              {imageList.map((item) => (
                <Col span={8} key={item.url}>
                  <Checkbox value={item.url}>
                    <div
                      className={`relative cursor-pointer border-2 ${selectedImages.includes(item.url) ? 'border-blue-500' : 'border-transparent'}`}

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
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination
            current={page}
            total={imageData?.total || 0}
            pageSize={SIZE}
            onChange={(page) => setPage(page)}
          />
        </div>
      </Modal >
    </>
  );
};



export default CreateProductDrawer;
      
