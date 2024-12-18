import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RatingStars from '../../components/RatingStars'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart } from '../../redux/features/cart/cartSlice'

const ProductCards = ({products}) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const handleAddToCart = (product) => {
        if(!user){
            navigate('/login');
        }
        else{
            if(product.stock <= 0){
                alert("Sorry.... Out of Stock")
            }
            else{
                dispatch(addToCart(product))
            }

        }
       
    }
 
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mx-20'>
        {
            products.map((product, index) => (
                <div key={index} className='product__card'>
                    <div className='relative'>
                        <Link to={`/shop/${product._id}`}>
                        <img src={product.images[0]} alt="product image" className='max-h-40 md:h-40 w-45 object-cover hover:scale-105 transition-all duration-300' />
                        </Link>

                        <div className='hover:block absolute top-3 right-3'>
                            <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(product)
                            }}
                            >
                            <i className="ri-shopping-cart-2-line bg-primary p-1.5 text-white hover:bg-primary-dark"></i>
                            </button>
                        </div>
                    </div>

                    {/* product description */}
                    <div className='product__card__content'>
                        <h4>{product.name}</h4>
                        <p>Rs.{product.price} /- {product?.oldPrice ? <s>Rs.{product?.oldPrice} /-</s> : null}</p>
                        <RatingStars rating={product.rating}/>
                    </div>

                </div>
            ))
        }
    </div>
  )
}

export default ProductCards