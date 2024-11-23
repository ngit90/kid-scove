import React from 'react'
import { useGetCategoriesQuery } from '../../redux/features/products/productsApi';

import { Link } from 'react-router-dom'

const Categories = () => {
    const { data: categories = [],  refetch } = useGetCategoriesQuery();
    
  return (
    <>
    <div className='product__grid'>
        {
            categories.map((category,index) => (
                <Link key={index} to={`/categories/${category.value}`} className='categories__card'>
                    <img src={category.image} alt={category.name} />
                    <h4>{category.label}</h4>
                </Link>
            ))
        }
    </div>
    </>
  )
}

export default Categories