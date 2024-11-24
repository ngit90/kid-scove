import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useFetchCategoryByIdQuery, useUpdateCategoryMutation} from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import axios from 'axios';
import { getBaseUrl } from "../../../../utils/baseURL";

const UpdateCategory = () => {
    
    const {id} = useParams();
    const navigate =  useNavigate();
    const [newimage, setNewImage] = useState('');
    const {user} = useSelector((state) => state.auth)
    const [cat, setCat] = useState({
        label: '',
        value: '',
    })

    const {data: catData, isLoading: isCatLoading, error: fetchError, refetch} = useFetchCategoryByIdQuery(id);
    const {label, value, image } = catData?.cat || {};
    const [updateCategory, {isLoading:isUpdating, error: updateError}] = useUpdateCategoryMutation();
    //console.log('catdata',label, value, image);
    useEffect(()=> {
        if(catData){
            setCat({
                label: label || '',
                value: value || '',
            })
            setNewImage(image || '')
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
        //console.log('files',files);
        if (files.length === 0) {
        return;
        }
        try {
            const base64 = await convertBase64(files[0]);
            const imageUrl = await uploadSingleImage(base64); // Upload each image
            setNewImage(imageUrl); // Pass the URLs to the parent component
            alert('Images uploaded successfully!');
        }catch (error) {
        console.error('Error uploading images:', error);
        }
        };

    const handleSubmit =  async (e) => {
        e.preventDefault();

        const updatedCat = {
            ...cat,
            image: newimage || image, 
            author: user?._id
        };
        //console.log('updated cat',updatedCat);
        try {
            await updateCategory({id: id, ...updatedCat}).unwrap();
            alert('Category updated successfully');
            await refetch();
            navigate("/dashboard/manage-categories")
        } catch (error) {
            console.error('Failed to update Category:', error);
        }

    }

    if(isCatLoading) return <div>Loading....</div>
    if(fetchError) return <div>Error fetching product!...</div>
  return (
    <div className='container mx-auto mt-8'>
        <h2 className='text-2xl font-bold mb-6'>Update Category </h2>
        <form  className='space-y-4'>
                <TextInput
                label="Category Name"
                name="label"
                placeholder=""
                value={cat?.label}
                onChange={handleChange}
                />
               
                <TextInput
                    label="Category Value"
                    name="value"
                    placeholder=""
                    value={cat?.value}
                    onChange={handleChange}
                />
               <div>
                    <label htmlFor={newimage}>Upload Image</label>
                    <input type="file"
                        name={newimage}
                        id={newimage}
                        onChange={uploadImage}
                        className='add-product-InputCSS' />

                    <div className="mt-4 flex gap-2 flex-wrap">
                        <img src={newimage} alt="" className="w-20 h-20 object-cover rounded" />
                    </div>
                </div>
                

                <div>
                    <button onClick={handleSubmit}
                    className='add-product-btn'
                   
                    >{isUpdating ? 'Updating...' : 'Update Category'}</button>
                </div>

        </form>
    </div>
  )
}

export default UpdateCategory;