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
import { NewProduct, Product, Sku, SpecGroup, SpecValue, Image } from "@/types/product";
import { useGetImagePageQuery, useGetCategoriesQuery, useCreateProductMutation, useUpdateProductMutation, useGetProductDetailQuery } from "../../state/api";
import { Drawer, Modal, Image as AntImage, Select, Button, Pagination, } from "antd";
import { Checkbox, Col, Row } from 'antd';
import type { GetProp } from 'antd';
import { ICategory } from "@/types/category"
import { TreeSelect } from "antd";
import 'react-quill-new/dist/quill.snow.css';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

// Frontend-specific types for form state
interface FormSku extends Sku {
  specValueNames?: string;
}

type FormData = Product;

const CreateProductDrawer = () => {
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const router = useRouter()

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const SIZE = 100;
  const [selectedImages, setSelectImages] = useState<string[]>([]);
  const [imageList, setImageList] = useState<Image[]>([]);
  const { data: categoriesData, isLoading } = useGetCategoriesQuery("");
  const list = categoriesData?.list || [];
  // 获取图片列表
  const { data: imageData } = useGetImagePageQuery({
    page: 1,
    size: 100
  });
  const pagination = imageData?.pagination || { total: 0, page: 1, size: 10 };
  const [formData, setFormData] = useState<FormData>({
    productId: 0,
    tags: [],
    name: '',
    categoryId: 0,
    storageMethod: '',
    description: '',
    images: [],
    thumb: '',
    rating: 0,
    isPopular: false,
    isHot: false,
    isNew: false,
    isRecommend: false,
    specGroups: [
      {
        name: '',
        values: [
          { value: '' },
        ]
      }],
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
      specValues: []
    }]
  });
  // 获取图片库
  useEffect(() => {
    if (imageData?.list) {
      setImageList(imageData.list);
    }
  }, [imageData?.list, page])
  // 接口获取产品详情
  const { data: productDetail } = productId ? useGetProductDetailQuery({ id: Number(productId) }) : { data: null };
  useEffect(() => {
    if (productDetail) {
      setFormData(productDetail as FormData);
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
  const handleSubmit = async (productData: FormData) => {
    console.log('productData', productData);

    if (productData.productId) {
      await updateProduct(productData);

    } else {
      const res = await createProduct(productData as NewProduct);
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
    const newSkus = formData.skus.filter((_: Sku, i: number) => i !== index);
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
    newSpecGroups[groupIndex].values?.push({ value: '' });
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 删除规格值
  const handleRemoveSpecValue = (groupIndex: number, valueIndex: number) => {
    const newSpecGroups = [...formData.specGroups];
    newSpecGroups[groupIndex].values = newSpecGroups[groupIndex].values?.filter((_: SpecValue, i: number) => i !== valueIndex);
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 更新规格值
  const handleSpecValueChange = (groupIndex: number, valueIndex: number, value: string) => {
    const newSpecGroups = [...formData.specGroups];
    if (newSpecGroups[groupIndex].values) {
      newSpecGroups[groupIndex].values![valueIndex] = { value };
    }
    setFormData({ ...formData, specGroups: newSpecGroups });
  };

  // 根据规格组合生成SKU
  const generateSkuCombinations = () => {
    // 过滤掉无效的规格组和规格值
    const validGroups = formData.specGroups
      .filter(group => group && group.name && group.values && group.values.some(v => v && v.value))
      .map(group => ({
        ...group,
        values: group.values!.filter(v => v && v.value)
      }));

    if (validGroups.length === 0) {
      // 如果没有有效规格组，创建一个默认SKU
      return [{
        specValueIds: [],
        specValueNames: '默认规格',
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
      group.values.map((value, valueIndex) => ({
        groupName: group.name!,
        value: value.value!,
        id: value.id, // 保留已存在的ID
        tempId: `${group.name}_${valueIndex}` // 生成与后端匹配的临时ID
      }))
    );

    // Cartesian product utility
    function cartesian<T>(arr: T[][]): T[][] {
      if (arr.length === 0) return [];
      if (arr.length === 1) return arr[0].map((item: T) => [item]);
      return arr.reduce((a: T[][], b: T[]) => a.flatMap((d: T[]) => b.map((e: T) => [...d, e])), [[]] as T[][]);
    }

    const allCombinations = groups.length > 0 ? cartesian(groups) : [];

    return allCombinations.map((combination, index) => ({
      specValueIds: combination.map((item: any) => item.tempId),
      specValueNames: combination.map((item: any) => `${item.groupName}:${item.value}`).join(', '),
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
    // 备份旧的SKU数据，以便在重新生成时保留用户输入
    const oldSkusMap = new Map<string, FormSku>();
    const groupNameMap = new Map(formData.specGroups.map(g => [g.id, g.name]));

    formData.skus.forEach(sku => {
      let key;
      if (sku.specValues && sku.specValues.length > 0) {
        key = sku.specValues
          .map(v => `${groupNameMap.get(v.specGroupId) || ''}:${v.value}`)
          .sort()
          .join(',');
      } else if (sku.specValueNames) {
        key = sku.specValueNames.split(', ').sort().join(',')
      } else {
        key = '默认规格';
      }
      oldSkusMap.set(key, sku);
    });

    const newSkuCombos = generateSkuCombinations();

    const newSkus = newSkuCombos.map(combo => {
      const key = combo.specValueNames
        ? combo.specValueNames.split(', ').sort().join(',')
        : '默认规格';

      const oldSku = oldSkusMap.get(key);
      if (oldSku) {
        return { ...oldSku, specValues: combo.specValues, specValueNames: combo.specValueNames };
      }
      return { ...combo, specValues: [] } as FormSku;
    });

    if (newSkus.length === 0) {
      const defaultSku = oldSkusMap.get('默认规格') || {
        unit: '', retailPrice: 0, wholesalePrice: 0, memberPrice: 0, weight: 0,
        dimensions: '', stock: 0, code: '', isDefault: true, specValues: [],
        specValueIds: [], specValueNames: '默认规格'
      };
      setFormData({ ...formData, skus: [defaultSku] });
    } else {
      setFormData({ ...formData, skus: newSkus });
    }
  };

  const [chooseImgType, setChooseImgType] = useState('image');
  const handleOpenModal = (type: string) => {
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
            children: Array.isArray(category.children) && category.children.length > 0
              ? category.children.map((sub: ICategory) => ({
                title: sub.categoryName,
                value: sub.id,
                key: sub.id,
                children: Array.isArray(sub.children) && sub.children.length > 0
                  ? sub.children.map((sub2: ICategory) => ({
                    title: sub2.categoryName,
                    value: sub2.id,
                    key: sub2.id,
                    children: sub2.children // 可继续递归
                  }))
                  : undefined
              }))
              : undefined
          }))}
          onChange={(value) => setFormData({ ...formData, categoryId: Number(value) })}
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
        <ReactQuill 
          theme="snow"
          value={formData.description}
          onChange={(value) => setFormData({ ...formData, description: value })}
          className='bg-white mb-2'
        />
        {/* 添加图片选择区域 */}
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">商品主图</h3>
          <div className="flex flex-wrap gap-5 mb-2">
        {formData.thumb && (
          <div className="relative w-24 h-24">
            <AntImage
              src={formData.thumb}
              alt={`商品主图`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
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
              disabled={formData.specGroups?.length === 0}
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
                      const newSkus = formData.skus.map((s, i) => ({
                        ...s,
                        isDefault: i === index
                      }));
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
                      const newSkus = formData.skus.map((s, i) =>
                        i === index ? { ...s, unit: e.target.value } : s
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
                      const newSkus = formData.skus.map((s, i) =>
                        i === index ? { ...s, weight: Number(e.target.value) } : s
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
                    const newSkus = formData.skus.map((s, i) =>
                      i === index ? { ...s, dimensions: e.target.value } : s
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
                      const newSkus = formData.skus.map((s, i) =>
                        i === index ? { ...s, retailPrice: Number(e.target.value) } : s
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
                      const newSkus = formData.skus.map((s, i) =>
                        i === index ? { ...s, wholesalePrice: Number(e.target.value) } : s
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
              </div>

              {/* 会员价和库存 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCssStyles}>会员价</label>
                  <input
                    type="number"
                    step="0.01"
                    value={sku.memberPrice}
                    onChange={(e) => {
                      const newSkus = formData.skus.map((s, i) =>
                        i === index ? { ...s, memberPrice: Number(e.target.value) } : s
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
                      const newSkus = formData.skus.map((s, i) =>
                        i === index ? { ...s, stock: Number(e.target.value) } : s
                      );
                      setFormData({ ...formData, skus: newSkus });
                    }}
                    className={inputCssStyles}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <h3 className="text-lg font-medium">商品状态</h3>
          <div className="flex gap-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isHot"
                checked={formData.isHot}
                onChange={(e) => setFormData({ ...formData, isHot: e.target.checked })}
                className="mr-2"
              />
              热门
            </label>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isPopular"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="mr-2"
              />
              流行
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

        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">
          {productId ? '更新商品' : '创建商品'}
        </button>
      </form>

      <Modal
        title="选择图片"
        open={imageModalOpen}
        onOk={handleConfirmImages}
        onCancel={() => setImageModalOpen(false)}
        width={800}
      >
        <Checkbox.Group style={{ width: '100%' }} onChange={onImageChange}>
          <Row gutter={[16, 16]}>
            {imageList.map((image) => (
              <Col span={4} key={image.id}>
                <Checkbox value={image.url}>
                  <AntImage
                    src={image.url}
                    alt={image.name}
                    width="100%"
                    preview={false}
                  />
                </Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
        <Pagination
          current={page}
          pageSize={SIZE}
          total={imageData?.pagination?.total || 0}
          onChange={(page) => setPage(page)}
          className="mt-4 text-center"
        />
      </Modal>
    </>
  );
};

export default CreateProductDrawer;
      
