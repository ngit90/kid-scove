import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useLoginUserMutation, useLogoutUserMutation } from '../../redux/features/auth/authApi'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/features/auth/authSlice'
import { clearCart } from '../../redux/features/cart/cartSlice';

const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/profile', label: 'Profile'  },
    { path: '/dashboard/reviews', label: 'Reviews'  },
    { path: '/dashboard/orders', label: 'Order'  },
]

const UserDashboard = () => {
    const [logoutUser] = useLogoutUserMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate()

    

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            dispatch(clearCart());
            dispatch(logout())
            navigate('/')
        } catch (error) {
            console.error("Failed to log out", error)
        }
        
    }
    return (
        <div className='space-y-5 bg-white p-8 md:h-screen flex flex-col justify-between'>
            <div>
            <Link to="/" className='text-red-500 px-1 underline'>Back</Link>
                <div className='nav__logo'>
                    <Link to="/">Kid'sCove<span>.</span></Link>
                    <p className='text-xs italic'>User dashboard</p>
                </div>
                <hr className='mt-5' />
                <ul className='space-y-5 pt-5'>
                    {
                        navItems.map((item) =>(
                            <li key={item.path}>
                                <NavLink 
                                className={
                                    ({isActive}) => isActive ? "text-blue-600 font-bold" : 'text-black'} 
                                end
                                to={item.path}
                                >
                                    {item.label}
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className='mb-3'>
                <hr  className='mb-3'/>
                <button 
                onClick={handleLogout}
                className='text-white bg-primary font-medium px-5 py-1 rounded-sm'>Logout</button>
            </div>
        </div>
    )
}

export default UserDashboard