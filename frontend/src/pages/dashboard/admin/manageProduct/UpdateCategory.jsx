import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage'; // Helper function for cropping
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchCategoryByIdQuery, useUpdateCategoryMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import axios from 'axios';
import { getBaseUrl } from "../../../../utils/baseURL";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [newImage, setNewImage] = useState('');
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const { data: catData, isLoading: isCatLoading, error: fetchError, refetch } = useFetchCategoryByIdQuery(id);
  const {label, value, image } = catData?.cat || {};
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [cat, setCat] = useState({
    label: '',
    value: '',
});

useEffect(()=> {
    if(catData){
        setCat({
            label: label || '',
            value: value || '',
        })
    }
}, [catData])


  const handleChange = (e) => {
    const { name, value } = e.target;
    //console.log('name value', name, value);

    setCat({
        ...cat,
        [name]: value
    });
    //console.log('handle',cat);

};


  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const showCroppedImage = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImg);
      setNewImage(croppedImg); // Update the state with the cropped image
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


  const handleSubmit = async (e) => {
    e.preventDefault();
      // Upload the cropped image to the backend
      try {
        if(croppedImage){
            const imageUrl = await uploadSingleImage(croppedImage);
        }
        const updatedCat = {
          ...cat,
          image: newImage || cat?.image, // Use the URL of the uploaded image
          author: user?._id,
        };

        await updateCategory({ id, ...updatedCat }).unwrap();
        alert('Category updated successfully');
        await refetch();
        navigate("/dashboard/manage-categories");
      } catch (error) {
        console.error('Failed to update Category:', error);
      }
  };

  if (isCatLoading) return <div>Loading....</div>;
  if (fetchError) return <div>Error fetching product!...</div>;

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Update Category</h2>
      <form className="space-y-4">
        <TextInput
          label="Category Name"
          name="label"
          value={cat?.label || ''}
          onChange={handleChange}
        />
        <TextInput
          label="Category Value"
          name="value"
          value={cat?.value || ''}
          onChange={handleChange}
        />

        <div>
          <label htmlFor="image">Upload Image</label>
          <input
            type="file"
            name="image"
            id="image"
            onChange={uploadImage}
            className="add-product-InputCSS"
          />
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
          <img src={croppedImage || catData.cat?.image} alt="" className="w-20 h-20 object-cover rounded" />
        </div>

        </div>

        <div>
          <button
            onClick={handleSubmit}
            className="add-product-btn"
          >
            {isUpdating ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateCategory;
