import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/(components)/Header";
import { NewProduct } from "@/types/product";
import { useUploadImageMutation } from "../state/api"


type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (product: NewProduct) => void;
}
const CreateProductModal = (props: CreateProductModalProps) => {
  const [image, setImage] = useState<string>('');
  const { isOpen, onClose, onCreate } = props;
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    rating: 0,
    stockQuantity: 0,
    image: '',
  })
  const [uploadImage] = useUploadImageMutation();
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('image', file);
        // const response = await fetch(process.env.NODE_ENV + '/upload', {
        //   method: 'POST',
        //   body: formData,
        // });
        const { data } = await uploadImage({ image: formData });
        console.log('成功', data)
        if (data?.code === 200) {
          // const data = await response.json();
          setFormData({ ...formData, image: data.data.url })
          console.log('成功', data)
        }


      } catch (error) {
        console.error('Error reading file:', error);
      }
      // const reader = new FileReader();
      // reader.onloadend = () => {
      //   setImage(reader.result as string);
      // };
      // reader.readAsDataURL(file);
      // setFormData({ ...formData, image: file.name });
    }
  }
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData, [name]: name === "price" || name === "stockQuantity" || name === "rating"
        ? parseFloat(value)
        : value,
    })
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
    onClose()
  }
  if (!isOpen) return null;
  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20" >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" >
        <Header name="Create New Product" />
        <form className="mt-5" onSubmit={handleSubmit}>
          <label htmlFor="productName" className={labelCssStyles}>Product Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={inputCssStyles}
            required
          />

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            className={inputCssStyles}
            required
          />

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            className={inputCssStyles}
            required
          />

          {/* RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating
          </label>
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            className={inputCssStyles}
            required
          />
          {/* image */}
          <label htmlFor="image" className={labelCssStyles}>
            Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            name="image"
            placeholder="image"
            required
          />
          <div>
            {formData.image && <img src={formData.image} alt="Product" className="w-20 h-20 object-cover" />}
          </div>

          {/* CREATE ACTIONS */}
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Create
          </button>
          <button
            onClick={onClose}
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )

}

export default CreateProductModal