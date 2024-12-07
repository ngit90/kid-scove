import React, {useState} from 'react';

export default function AddressSelect() {

    const [address, setAddress] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: ''
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setFormData(data => ({ ...data, [name]: value }))
    }
    const handlesubmit = ()=>{
        setAddress(true);
    console.log("Address added");
    }

  return (
    <div>
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px] ml-10'>

<div className='text-xl sm:text-2xl my-3'>
      <div className='inline-flex gap-2 items-center mb-3'>
      <p className='text-gray-500'>DELIVERY <span className='text-gray-700 font-medium'>INFORMATION</span></p>
      <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700'></p>
      </div>
</div>
{!address && 
<form onSubmit={handlesubmit}>
<div className='flex gap-3'>
    <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='First name' />
    <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Last name' />
</div>
<input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='Email address' />
<input required onChange={onChangeHandler} name='street' value={formData.street} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Street' />
<div className='flex gap-3'>
    <input required onChange={onChangeHandler} name='city' value={formData.city} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='City' />
    <input onChange={onChangeHandler} name='state' value={formData.state} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='State' />
</div>
<div className='flex gap-3'>
    <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Zipcode' />
    <input required onChange={onChangeHandler} name='country' value={formData.country} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='Country' />
</div>
<input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="number" placeholder='Phone' />
<button className='bg-green-600 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center' type='submit'> Add Address</button>
</form> }
{address && <h3> Delivery address added suceessful... Move to checkout</h3>}
</div>

    </div>
  )
}

