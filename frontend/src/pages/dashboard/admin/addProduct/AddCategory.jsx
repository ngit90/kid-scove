import React, { useState } from 'react';
import {useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../manageProduct/cropImage'; // Helper function for cropping
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
    //////////////
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
////////////////
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
        });


    };

    const navigate = useNavigate();

    const handleCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      };
    
      const showCroppedImage = async () => {
        try {
          const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
          setCroppedImage(croppedImg);
          setImage(croppedImg); // Update the state with the cropped image
        } catch (e) {
          console.error(e);
        }
      };
    
      const uploadSingleImage = async (base64) => {
        try {
          const res = await axios.post(`${getBaseUrl()}/uploadImage`, { image: base64 });
          return res.data; // Assuming the server returns the uploaded image URL
        } catch (error) {
          console.error('Error uploading image:', error);
          throw error;
        }
      };
    
      const uploadImage = async (event) => {
        const files = event.target.files;
        if (files.length === 0) return;
    
        const reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = () => {
          setImageSrc(reader.result); // Load the image to the cropper
        };
        reader.onerror = (error) => {
          console.error('Error loading image:', error);
        };
      };


    const handleSubmit = async(e) => {
        e.preventDefault();
        if(!category.label || !category.value || !image) {
            alert('Please fill all the required fields');
            return;
        }

        try {
            if(croppedImage){
                const imageUrl = await uploadSingleImage(croppedImage);
            }
            await AddCategory({...category, image, author: user?._id}).unwrap();
            alert('Category added successfully');
            setCategory({ label: '',
                value: ''})
            setImage('');
            //window.location.reload();
            await refetch();
                navigate("/dashboard/manage-categories")
        } catch (error) {
            alert(error.data.message);
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

{imageSrc && (
            <div className="relative w-80 h-80 bg-gray-200">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
              />
              <button
                type="button"
                onClick={showCroppedImage}
                className="absolute bottom-2 right-2 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Crop Image
              </button>
            </div>
          )}
         
          <div className="mt-4 flex gap-2 flex-wrap">
          <img src={croppedImage} alt="" className="w-20 h-20 object-cover rounded" />
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