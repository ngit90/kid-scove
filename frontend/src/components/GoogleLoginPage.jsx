import React, { useState } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export default function GoogleLoginPage({setMessage}) {
  const [user, setUserdata] = useState({});
  const disptach = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = (response) => {
    //console.log(response);
    const token = response.credential; // Updated to use 'credential'
    fetch('http://localhost:5000/auth/google/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log('data',data.user)
        if(data.message === "User Blocked. Contact Cust. Care" ){
          setMessage("User Blocked. Contact Cust. Care");
          navigate("/login");
        }else{
          setUserdata(data);
          disptach(setUser(data));
          navigate("/");
          //localStorage.setItem('jwtToken', data.token);
          //console.log('Login successful, JWT Token stored:', data.token);
        }
       
      })
      .catch((err) => console.error('Login error:', err));
  };
    
      const handleError = () => {
        console.log('Google Sign-In Error');
      };

  return (
    <div>
        <GoogleOAuthProvider clientId = '158035231393-nfdbjqikmc44l8j6ts6o344tdd6upr29.apps.googleusercontent.com' >
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </GoogleOAuthProvider>
    </div>
  )
}
