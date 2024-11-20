import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSendOtpMutation,useVerifyOtpMutation  } from '../redux/features/auth/authApi';

const Register = () => {
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState('');
    const [otp, setOtp] = useState('');
    const [resendCooldown, setResendCooldown] = useState(false);
    const [timer, setTimer] = useState(0);

    const [sendOtp, {isLoading: loginLoading}] = useSendOtpMutation()
    const [verifyOtp, {isLoading: loginLoad}] = useVerifyOtpMutation()
    const navigate = useNavigate();

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        const data = {
            email,
            username,
            password
        }
        try {
            setErrors('');
            const response =  await sendOtp(data).unwrap();
            setMessage('OTP sent to your email!');
            setStep(2); // Move to OTP verification step
        } catch (error) {
            console.log(error);
            setErrors(error.data.message || 'Failed to send OTP');
        }
    };

    // Step 2: Verify OTP and Complete Registration
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const userdata = {
            email,
            username,
            password,
            otp
        }
        try {
            const response =  await verifyOtp(userdata).unwrap();
            console.log(response);
                alert('Registration successful!');
                navigate('/login');
        } catch (error) {
            setErrors('Invalid OTP. Please try again.');
        }
    };

    // Handle Resend OTP
    const handleResendOtp = async () => {
        if (resendCooldown) return; // Prevent resending if cooldown is active
        const data = {
            email,
            username,
            password
        }
        try {
            const response =  await sendOtp(data).unwrap();
            setMessage('OTP sent to your email!');
            setOtp('');
            setResendCooldown(true); // Start cooldown
            setTimer(10); // Set cooldown time (e.g., 10 seconds)
        } catch (error) {
            setErrors(error.data.message || 'Failed to resend OTP');
        }
    };

    // Start timer for cooldown
    useEffect(() => {
        let interval;
        if (resendCooldown && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000); // Update every second
        } else if (timer === 0) {
            setResendCooldown(false); // Reset cooldown after timer reaches 0
        }
        return () => clearInterval(interval);
    }, [resendCooldown, timer]);

    return (
        <section className='h-screen flex items-center justify-center'>
            <div className='max-w-sm border shadow bg-white mx-auto p-8'>
                <h2 className='text-2xl font-semibold pt-5'>Please Register</h2>
                {step === 1 && (
                <form onSubmit={handleSendOtp} className='space-y-5 max-w-sm mx-auto pt-8'>
                    <input type="text" name="username" id="username"
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder='Username' required
                        className='w-full bg-gray-100 focus:outline-none px-5 py-3'
                    />
                    <input type="email" name="email" id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Email Address' required
                        className='w-full bg-gray-100 focus:outline-none px-5 py-3'
                    />
                    <input type="password" name="password" id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Password' required
                        className='w-full bg-gray-100 focus:outline-none px-5 py-3'
                    />
                    {message && <p className='text-red-500'>{message}</p>}
                    {errors && <p className='text-red-500'>{errors}</p>}
                    <button type='submit' className='w-full mt-5 bg-primary text-white hover:bg-indigo-500 font-medium py-3 rounded-md'>
                        Send OTP
                    </button>
                </form>
                )}
                {step === 2 && (
                    <>
                        <form onSubmit={handleVerifyOtp} className="space-y-5 pt-8">
                            <p>Enter OTP:</p>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                required
                                className="w-full bg-gray-100 focus:outline-none px-5 py-3"
                            />
                            {errors && <p className="text-red-500">{errors}</p>}
                            <button
                                type="submit"
                                className="w-full mt-5 bg-primary text-white hover:bg-indigo-500 font-medium py-3 rounded-md"
                            >
                                Verify OTP
                            </button>
                        </form>
                        <div className="text-center mt-5">
                            {resendCooldown ? (
                                <p className="text-sm text-gray-500">
                                    Please wait {timer} seconds to resend OTP.
                                </p>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    className="text-blue-600 hover:underline"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>
                    </>
                )}
                <p className='my-5 italic text-sm text-center'>Have an account? Please
                    <Link to="/login" className='text-red-700 px-1 underline'>Login</Link>.
                </p>
            </div>
        </section>
    );
}

export default Register;
