import React from 'react'

import category1 from "../../assets/category-1.jpg"
import category2 from "../../assets/category-2.jpg"
import category3 from "../../assets/category-3.jpg"
import category4 from "../../assets/category-4.jpg"
import category5 from "../../assets/category-5.jpg"
import category6 from "../../assets/category-6.jpg"
import { Link } from 'react-router-dom'

const Categories = () => {
    const categories = [
        {name: 'Accessories', path: 'accessories', image: category4},
        {name: 'Dress-Girls', path: "dressgirls", image: category1},
        {name: 'Dress-Boys', path: "dressboys", image: category5},
        {name: 'Steps-Girls', path: 'footweargirls', image: category6},
        {name: 'Steps-Boys', path: 'footwearboys', image: category2},
        {name: 'Toys', path: 'toys', image: category3},
    ]
  return (
    <>
    <div className='product__grid'>
        {
            categories.map((category) => (
                <Link key={category.name} to={`/categories/${category.path}`} className='categories__card'>
                    <img src={category.image} alt={category.name} />
                    <h4>{category.name}</h4>
                </Link>
            ))
        }
    </div>
    </>
  )
}

export default Categories