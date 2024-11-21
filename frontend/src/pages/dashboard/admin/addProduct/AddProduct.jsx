import React, { useState } from 'react';
import {useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Dress-Boys', value: 'dress-boys' },
    { label: 'Dress-Girls', value: 'dress-girls' },
    { label: 'Footwear-Boys', value: 'footwear-boys' },
    { label: 'Footwear-Girls', value: 'footwear-girls' },
    { label: 'Toys', value: 'toys' }
];

const agegroup = [
    { label: 'Select Agegroup', value: '' },
    { label: 'Newborn', value: 'Newborn' },
    { label: '3to12_Months', value: '3to12_Months' },
    { label: '1to2_Years', value: '1to2_Years' },
    { label: '3to5_Years', value: '3to5_Years' },
    { label: '5to10_Years', value: '5to10_Years' },
];

const AddProduct = () => {
    const { user } = useSelector((state) => state.auth);

    const [product, setProduct] = useState({
        name: '',
        category: '',
        agegroup: '',
        price: '',
        description: ''
    });
    const [images, setImages] = useState([]);

    const [AddProduct, {isLoading, error}] = useAddProductMutation()
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });


    };

    const navigate = useNavigate();

    const handleImagesChange = (newImages) => {
        setImages(newImages); // Update the images state with an array of uploaded images
      };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!product.name || !product.category || !product.price || !product.description || !product.agegroup || images.length === 0) {
            alert('Please fill all the required fields');
            return;
        }

        try {
            await AddProduct({...product, images, author: user?._id}).unwrap();
            alert('Product added successfully');
            setProduct({ name: '',
                category: '',
                agegroup: '',
                price: '',
                description: ''})
                setImages([]);
                navigate("/shop")
        } catch (error) {
            console.log("Failed to submit product", error);
        }
    }

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Add New Product</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Product Name"
                    name="name"
                    placeholder="Ex: Diamond Earrings"
                    value={product.name}
                    onChange={handleChange}
                />
                <SelectInput
                    label="Category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    options={categories}
                />
                <SelectInput
                    label="agegroup"
                    name="agegroup"
                    value={product.agegroup}
                    onChange={handleChange}
                    options={agegroup}
                />
                <TextInput
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
   
                <UploadImage
                name="images"
                id="images"
                value={images}
                placeholder='Images'
                setImages={handleImagesChange}
                />
                <div>
                <label htmlFor="description" className='block text-sm font-medium text-gray-700'>Description</label>
                <textarea name="description" id="description"
                className='add-product-InputCSS'
                value={product.description}
                placeholder='Write a product description'
                onChange={handleChange}
                ></textarea>
                </div>

                <div>
                    <button type='submit'
                    className='add-product-btn'
                   
                    >Add Product</button>
                </div>

            </form>

           
        </div>
    );
};

export default AddProduct;