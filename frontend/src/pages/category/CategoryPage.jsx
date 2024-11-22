import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

//import products from "../../data/products.json"
import ProductCards from '../shop/ProductCards';
import { useGetProductsQuery } from '../../redux/features/products/productsApi';

const CategoryPage = () => {
    const {categoryName} = useParams();
   const [filteredProducts, setFilteredProducts] = useState([]);
   const { data: products = [], error, isLoading, refetch } = useGetProductsQuery();

   useEffect(() =>{
    const filtered = products.filter((product) => product.category === categoryName.toLowerCase());
    console.log('filters', products);
    setFilteredProducts(filtered);
   } , [categoryName])

   useEffect(() => {
    window.scrollTo(0, 0)
   })

  return (
    <>
    <section className='section__container bg-primary-light'>
            <h2 className='section__header capitalize'>{categoryName}</h2>
            <p className='section__subheader'>Browse a diverse range of categories, from chic dresses to versatile accessories. Elevate your style today!</p>
    </section>

    {/* products card */}
    <div className='section__container'>
        <ProductCards products={filteredProducts}/>
    </div>
    </>
  )
}

export default CategoryPage