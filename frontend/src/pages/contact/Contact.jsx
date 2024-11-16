import React from 'react'
import contact_img from "../../assets/contact_img.png"

const Contact = () => {
  return (
    <div>

      <div className='text-center text-2xl pt-8 border-t'>
      <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>Contact <span className='text-gray-700 font-medium'>Us</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
    </div>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[400px]' src={contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-12 ml-10'>
          <p className=' font-semibold text-xl text-gray-800 ml-3'>Our Store</p>
          <p className=' text-gray-500 ml-3'>3rd Fllor, Kasa marina Comples  <br /> Near AKG Hospital,<br/>  Kannur - 670002</p>
          <p className=' text-gray-500 ml-3 mb-10'>Tel: (91)  9988776655<br /> Email: kid'scove@gmail.com</p>
        </div>
      </div>


    </div>
  )
}

export default Contact
