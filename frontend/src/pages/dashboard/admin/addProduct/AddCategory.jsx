import React, { useState } from 'react';
import {useSelector } from 'react-redux';
import TextInput from './TextInput';
import axios from 'axios';
import { getBaseUrl } from "../../../../utils/baseURL";
import { useAddCategoryMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';


const AddCategory = () => {
    const { user } = useSelector((state) => state.auth);
    const [image, setImage] = useState('');
    const [category, setCategory] = useState({
        label: '',
        value: ''
    });
    const [AddCategory, {isLoading, error}] = useAddCategoryMutation();
  

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
        });


    };

    const navigate = useNavigate();

    // base64 functionality
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    // Upload a single Base64 image to the server
    const uploadSingleImage = async (base64) => {
        try {
            const res = await axios.post(`${getBaseUrl()}/uploadImage`, { image: base64 });
            return res.data; // Assuming the server returns the uploaded image URL
          } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
          }
        };


// Handle file selection and upload
const uploadImage = async (event) => {
    const files = event.target.files;
    console.log('files',files);
    if (files.length === 0) {
      return;
    }
    try {
        const base64 = await convertBase64(files[0]);
        const imageUrl = await uploadSingleImage(base64); // Upload each image
        setImage(imageUrl); // Pass the URLs to the parent component
        alert('Images uploaded successfully!');
      }catch (error) {
      console.error('Error uploading images:', error);
    }
  };


    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!category.label || !category.value || !image) {
            alert('Please fill all the required fields');
            return;
        }

        try {
            await AddCategory({...category, image, author: user?._id}).unwrap();
            alert('Category added successfully');
            setCategory({ label: '',
                value: ''})
            setImage('');
                navigate("/")
        } catch (error) {
            console.log("Failed to submit category", error);
        }
    }

    return (
        <div className="container mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput
                    label="Category Label"
                    name="label"
                    placeholder="Accessories"
                    value={category.label}
                    onChange={handleChange}
                />
                <TextInput
                    label="Category Name"
                    name="value"
                    placeholder="accessories"
                    value={category.value}
                    onChange={handleChange}
                />
                <div>
                    <label htmlFor={image}>Upload Image</label>
                    <input type="file"
                        name={image}
                        id={image}
                        onChange={uploadImage}
                        className='add-product-InputCSS' />

                    <div className="mt-4 flex gap-2 flex-wrap">
                        <img src={image} alt="" className="w-20 h-20 object-cover rounded" />
                    </div>
                </div>
                <div>
                    <button type='submit'
                    className='add-product-btn'
                   
                    >Add Category</button>
                </div>

            </form>

           
        </div>
    );
};

export default AddCategory;