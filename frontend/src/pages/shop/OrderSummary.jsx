import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearCart } from '../../redux/features/cart/cartSlice';
import {useNavigate} from 'react-router-dom'
import { getBaseUrl } from '../../utils/baseURL';
import { useCreateOrderMutation } from '../../redux/features/orders/orderApi';
import PaymentSuccess from '../../components/PaymentSuccess';


const OrderSummary = ({isCheckout, selectedAddress}) => {
    const dispatch = useDispatch()
    const {user} = useSelector(state => state.auth)
    const navigate = useNavigate();
    const products = useSelector((store) => store.cart.products);
    const { selectedItems, totalPrice, tax, taxRate, grandTotal } = useSelector((store) => store.cart);
    const [CreateOrder, {isLoading, error}] = useCreateOrderMutation();
    const [order, setOrder] = useState(null);

    const handleClearCart = () => {
        dispatch(clearCart())
    }
    
    // payment integration
    const makePayment = async (e) => {
        const neworder = {
            products: products,
            userId: user?._id,
            address: selectedAddress,
            amount: totalPrice,
        }
        if(isCheckout){
            try {
       
                const response = await CreateOrder(neworder);
                const order = response.data.order;
                console.log('orderis',response.data.order);
                setOrder(order);
                dispatch(clearCart())
                alert("Order created ");
                //await refetch();
                //console.log("id",order._id);
                navigate(`/success/${order._id}`);
                //console.log(selectedAddress);
            } catch (error) {
                console.log("Failed to submit order", error);
            }
        }
    }

    return (
        <div className='bg-primary-light mt-5 rounded text-base md:w-1/2 w-full ml-10'>
            <div className='px-6 py-4 space-y-5'>
                <h2 className='text-xl text-text-dark'>Order Summary</h2>
                <p className='text-text-dark mt-2'>SelectedItems: {selectedItems}</p>
                <p>Total Price: Rs. {totalPrice.toFixed(2)}</p>
                <p>Tax ({taxRate * 100}%): Rs. {tax.toFixed(2)}</p>
                <h3 className='font-bold'>GrandTotal: Rs. {grandTotal.toFixed(2)}</h3>
                <div className='px-4 mb-6'>
                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClearCart();
                    }}
                        className='bg-red-500 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center mb-4'>
                        <span className='mr-2'>Clear cart</span> 
                        <i className="ri-delete-bin-7-line"></i>
                    </button>
                    {isCheckout && 
                    <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        makePayment();
                    }}
                    className='bg-green-600 px-3 py-1.5 text-white  mt-2 rounded-md flex justify-between items-center'><span className='mr-2'>Proceed Checkout</span><i className="ri-bank-card-line"></i></button>}
                </div>
            </div>
            {order &&  <PaymentSuccess order = {order} />}
        </div>
    )
}

export default OrderSummary