import React, { useState } from 'react'
import ProductCards from './ProductCards'
import { useGetProductsQuery } from '../../redux/features/products/productsApi';

const TrendingProducts = () => {
    const [visibleProducts, setVisibleProducts] = useState(8);
    const { data: products = [], error, isLoading, refetch } = useGetProductsQuery();
    
    const loadMoreProducts = () => {
        setVisibleProducts(prevCount => prevCount + 4)
    }
    return (
        <section className='section__container product__container '>
            <h2 className='section__header'>Trending Products</h2>
            <p className='section__subheader mb-12'>
                Discover the Hottest Picks: Elevate Your Style with Our Curated Collection of Trending Kid's Fashion Products.
            </p>

            {/* products card */}
            <div className='mt-12 mx-20'>
            <ProductCards products={products.slice(0, visibleProducts)}/>
            </div>

            {/* load more products btn */}
            <div className='product__btn'>
                {
                    visibleProducts < products.length && (
                        <button className='btn' onClick={loadMoreProducts}>Load More</button>
                    )
                }
            </div>
        </section>
    )
}

export default TrendingProducts