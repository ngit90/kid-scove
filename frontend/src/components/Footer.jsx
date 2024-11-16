import React from 'react'

//import { assets } from '../assets/assets';
import logo from "../assets/logo.png"

const Footer = () => {
    return (
        <>
           <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-20 text-sm'>
            <div>
                <img className='ml-4 mb-5 w-32' src={logo} alt="" />
                <p className='md:w-2/3 text-gray-600 ml-4'>
                Kid's Cove the ultimate destination for kids' fashion, fun, and essentials! From trendy outfits to playful toys and comfy footwear, we’ve got everything to make your child’s day brighter.
                Explore Our Collection
                </p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5 ml-2'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600 ml-2'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5 ml-2'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600 ml-2'>
                    <li>+1-212-456-7890</li>
                    <li>Contact@kid'scove.com</li>
                </ul>
            </div>

            </div>

            <div className='footer__bar'>
                Copyright © 2024 by Kid's Cove . All rights reserved.
            </div>
        </>
    )
}

export default Footer