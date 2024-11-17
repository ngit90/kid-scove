import React, { useEffect, useState } from 'react'

//import productsData from "../../data/products.json"
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';

const filters = {
    categories: ['all', 'accessories', 'dress-boys','dress-girls', 'footwear-boys','footwear-girls', 'toys'],
    agegroup: ['all', 'Newborn', '3to12_Months', '1to2_Years', '3to5_Years', '5to10_Years'],
    priceRanges: [
        { label: 'Under 500', min: 0, max: 500 },
        { label: '501 - 1000', min: 501, max: 1000 },
        { label: '1001 - 2000', min: 1001, max: 2000 },
        { label: '2001 and above', min: 2001, max: Infinity }
    ]
};


const ShopPage = () => {
    const [filtersState, setFiltersState] = useState({
        category: 'all',
        agegroup: 'all',
        priceRange: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(8);

    const { category, agegroup, priceRange } = filtersState;
    const [minPrice, maxPrice] = priceRange.split('-').map(Number);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'all' ? category : '',
        cagegroup: agegroup !== 'all' ? agegroup : '',
        minPrice: isNaN(minPrice) ? '' : minPrice,
        maxPrice: isNaN(maxPrice) ? '' : maxPrice,
        page: currentPage,
        limit: ProductsPerPage,
    })

    // clear the filters
    const clearFilters = () => {
        setFiltersState({
            category: 'all',
            agegroup: 'all',
            priceRange: ''
        })
    }

    // handle page change
    const handlePageChange = (pageNumber) => {
        if(pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber)
        }
    }

    if (isLoading) return <div>Loading....</div>
    if (error) return <div>Error loading products.</div>

    const startProduct = (currentPage - 1) * ProductsPerPage + 1;
    const endProduct = startProduct + products.length - 1;

    return (
        <>
            <section className='section__container bg-primary-light'>
                <h2 className='section__header capitalize'>Shop Page</h2>
                <p className='section__subheader'>Discover the Hottest Picks: Elevate Your Style with Our Curated Collection of Trending Women's Fashion Products.</p>
            </section>

            <section className='section__container'>
                <div className='flex flex-col md:flex-row md:gap-12 gap-8'>
                    {/* left side */}
                    <ShopFiltering
                        filters={filters}
                        filtersState={filtersState}
                        setFiltersState={setFiltersState}
                        clearFilters={clearFilters}
                    />

                    {/* right side */}
                    <div>
                        <h3 className='text-xl font-medium mb-4'>
                            Showing {startProduct} to {endProduct} of {totalProducts} products
                        </h3>
                        <ProductCards products={products} />

                        {/* pagination controls */}
                        <div className='mt-6 flex justify-center'>
                            <button 
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2'>Previous</button>

                            {
                                [...Array(totalPages)].map((_, index) => (
                                    <button key={index}
                                    onClick={() => handlePageChange(index + 1)}
                                        className={`px-4 py-2 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}
                                        rounded-md mx-1
                                        `}
                                    >{index + 1}</button>
                                ))
                            }

                            <button 
                            disabled={currentPage === totalPages}
                             onClick={() => handlePageChange(currentPage + 1)}
                            className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md ml-2'>Next</button>

                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ShopPage