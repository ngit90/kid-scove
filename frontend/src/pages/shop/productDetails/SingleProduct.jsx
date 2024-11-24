import React, {useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingStars from '../../../components/RatingStars';
import ProductCards from '../ProductCards';
import {useDispatch} from "react-redux"
import { useFetchProductByIdQuery, useFetchRelatedProductsQuery } from '../../../redux/features/products/productsApi';
import { addToCart } from '../../../redux/features/cart/cartSlice';
import ReviewsCard from '../reviews/ReviewsCard';

const SingleProduct = () => {
    const {id} = useParams();

    const dispatch =  useDispatch();
    const {data, error, isLoading} = useFetchProductByIdQuery(id);
    const {related = [], errors, isLoad} = useFetchRelatedProductsQuery(id);
    const singleProduct = data?.product || {};
    const productReviews = data?.reviews || [];
    const [selectedImage, setSelectedImage] = useState(null);   

    // Update selectedImage when singleProduct changes
    useEffect(() => {
        if (singleProduct?.images && singleProduct.images.length > 0) {
            setSelectedImage(singleProduct.images[0]); // Set to the first image
        }
    }, [singleProduct]);
    const handleAddToCart = (product) => {
        dispatch(addToCart(product))
    }
    const handleThumbnailClick = (image) => {
        setSelectedImage(image);
      };

    if(isLoading) return <p>Loading...</p>
    if(error) return <p>Error loading product details.</p>

    return (
        <>
            <section className='section__container'>
                <h2 className='section__header capitalize'>Single Product Page</h2>
                <div className='section__subheader space-x-2'>
                    <span className='hover:text-primary'><Link to="/">home</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'><Link to="/shop">shop</Link></span>
                    <i className="ri-arrow-right-s-line"></i>
                    <span className='hover:text-primary'>{singleProduct.name}</span>
                </div>
            </section>

            <section className='section__container mt-8'>
                <div className='flex flex-col items-center md:flex-row md:ml-35 ml-10'>
                    {/* product image */}
                    <div className="md:w-1/4 w-full md:grid flex md:grid-wrap gap-3 md:ml-20 ">
                        {singleProduct?.images.map((image, index) => (
                        <img 
                            key={index} 
                            src={image} 
                            alt={`Product ${index + 1}`} 
                            className={`rounded-md w-20 h-20 object-cover cursor-pointer border border-gray-300 ${
                                selectedImage === image ? 'border-blue-800' : 'hover:border-blue-800'
                              }`}
                            onClick={() => handleThumbnailClick(image)}
                        />
                        ))}
                    </div>
                    <div className='md:w-1/2 w-full mt-2 ml-2'>
                        <img src={selectedImage} alt="" 
                        className='rounded-md w-80 h-80'
                        />
                    </div>

                    <div className='md:w-1/2 w-1/2 mr-40'>
                        <h3 className='text-2xl font-semibold mb-4'>{singleProduct?.name}</h3>
                        <p className='text-xl text-primary mb-4 space-x-1'>
                            Rs.{singleProduct?.price} /-
                             {singleProduct?.oldPrice && <s className='ml-1'>Rs.{singleProduct?.oldPrice} /-</s>}
                            </p>
                        <p className='text-gray-400 mb-4'>{singleProduct?.description}</p>

                        {/* additional product info */}
                        <div className='flex flex-col space-y-2'>
                            <p><strong>Category:</strong> {singleProduct?.category}</p>
                            <p><strong>AgeGroup:</strong> {singleProduct?.agegroup}</p>
                            <div className='flex gap-1 items-center'>
                                <strong>Rating: </strong>
                                <RatingStars rating={singleProduct?.rating}/>
                            </div>
                                {singleProduct?.stock >= 10 && (
                                <p className="text-l text-primary mb-4">
                                    Available...
                                </p>
                                )}

                                {singleProduct?.stock >= 1 && singleProduct?.stock < 10 && (
                                <p className="text-l text-primary mb-4">
                                    Only {singleProduct?.stock} Left...
                                </p>
                                )}

                                {singleProduct?.stock <= 0 && (
                                <p className="text-l text-primary mb-4">
                                    Out of Stock...
                                </p>
                                )}
                           
                        </div>

                        <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(singleProduct)
                        }}
                        className='mt-6 px-6 py-3 bg-primary text-white rounded-md'>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </section>

            {/* display Reviews */} 
            <section className='section__container mt-8'>
                <ReviewsCard productReviews = {productReviews}/>
            </section>
            {/* products card */}
            <div className='mt-12 mx-20'>
            <ProductCards products={related}/>
            </div>
        </>
    )
}

export default SingleProduct