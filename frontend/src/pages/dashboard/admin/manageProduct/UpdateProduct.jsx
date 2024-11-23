import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
//import axios from 'axios';
//import { getBaseUrl } from "../../../../utils/baseURL";
import { useFetchProductByIdQuery, useUpdateProductMutation, useImageDeleteMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UploadImage from '../addProduct/UploadImage';

const categories = [
    { label: 'Select Category', value: '' },
    { label: 'Accessories', value: 'accessories' },
    { label: 'Dress-Boys', value: 'dressboys' },
    { label: 'Dress-Girls', value: 'dressgirls' },
    { label: 'Footwear-Boys', value: 'footwearboys' },
    { label: 'Footwear-Girls', value: 'footweargirls' },
    { label: 'Toys', value: 'toys' }
];

const agegroups = [
    { label: 'Select Agegroup', value: '' },
    { label: 'Newborn', value: 'Newborn' },
    { label: '3to12_Months', value: '3to12_Months' },
    { label: '1to2_Years', value: '1to2_Years' },
    { label: '3to5_Years', value: '3to5_Years' },
    { label: '5to10_Years', value: '5to10_Years' },
];


const UpdateProduct = () => {
    const [imageDelete ] = useImageDeleteMutation();
    const {id} = useParams();
    const navigate =  useNavigate();
    const {user} = useSelector((state) => state.auth)
    const [product, setProduct] = useState({
        name: '',
        category: '',
        agegroup: '',
        price: '',
        stock:'',
        description: '',
        images: []
    })

    const {data: productData, isLoading: isProductLoading, error: fetchError, refetch} = useFetchProductByIdQuery(id);

    const [newImages, setNewImages] = useState([])
    const {name, category, agegroup, description, images, price, stock } = productData?.product || {};

    const [updateProduct, {isLoading:isUpdating, error: updateError}] = useUpdateProductMutation();

    useEffect(()=> {
        if(productData){
            setProduct({
                name: name || '',
                category: category || '',
                agegroup: agegroup || '',
                price: price || '',
                stock: stock || '',
                description: description || '',
                images: images || []
            })
        }
    }, [productData])

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });


    };

    const deleteImage = async (url) => {
        
          // Delete image from the database
          //console.log('product is',id);
          const datas = {
            id,
            url
          }
          try {
          //const response = await axios.post(`${getBaseUrl()}/api/products/deleteImage`, { id, url });
          const response = await imageDelete(datas).unwrap();
          //console.log(response);
          alert(response.message);
          //await refetch();
          setProduct({
            name: name || '',
            category: category || '',
            agegroup: agegroup || '',
            price: price || '',
            stock: stock || '',
            description: description || '',
            images: response.updatedProduct.images || []
        })
        } catch (error) {
          console.error('Failed to delete image URL:', error);
          alert('Failed to delete image');
        }
    }
    const handleImageChange= (imgs) => {
        setNewImages(imgs);
        //console.log('handleimagechange',images);
    }

    const handleSubmit =  async (e) => {
        e.preventDefault();

        const updatedProduct = {
            ...product,
            images: images.concat(newImages), 
            author: user?._id
        };

        try {
            await updateProduct({id: id, ...updatedProduct}).unwrap();
            alert('Product updated successfully');
            await refetch();
            navigate("/dashboard/manage-products")
        } catch (error) {
            console.error('Failed to update product:', error);
        }

    }

    if(isProductLoading) return <div>Loading....</div>
    if(fetchError) return <div>Error fetching product!...</div>
  return (
    <div className='container mx-auto mt-8'>
        <h2 className='text-2xl font-bold mb-6'>Update Product </h2>
        <form  className='space-y-4'>
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
                    options={agegroups}
                />
                <TextInput
                    label="Price"
                    name="price"
                    type="number"
                    placeholder="50"
                    value={product.price}
                    onChange={handleChange}
                />
                <TextInput
                    label="Stock"
                    name="stock"
                    type="number"
                    placeholder="10"
                    value={product.stock}
                    onChange={handleChange}
                />
                 <UploadImage
                name="images"
                id="images"
                value={newImages}
                placeholder='Images'
                setImages={handleImageChange}
                />
                <div className="mt-4 flex gap-2 flex-wrap">
                {images.map((url, index) => (
                <div key={index}>
                <button onClick={() => deleteImage(url)} className='ml-14'> X </button>
                <img  src={url} alt={`Uploaded ${index + 1}`} className="w-20 h-20 object-cover rounded" />
                </div>
                ))}
                </div>
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
                    <button onClick={handleSubmit}
                    className='add-product-btn'
                   
                    >{isUpdating ? 'Updating...' : 'Update Product'}</button>
                </div>

        </form>
    </div>
  )
}

export default UpdateProduct