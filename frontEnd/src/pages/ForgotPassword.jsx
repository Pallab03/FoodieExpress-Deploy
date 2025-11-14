import axios from 'axios';
import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from 'react-router';
import { serverUrl } from '../App';
import { ClipLoader } from 'react-spinners';

const ForgotPassword = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [err, setErr] = useState("")
    const [loader, setLoader] = useState(false)

    const navigate = useNavigate();


    const handleSendOtp = async () => {
        setLoader(true)
        try {
            const results = await axios.post(`${serverUrl}/api/auth/send-otp`, { email },
                { withCredentials: true }
            )
            setLoader(false)
            setErr("")
            console.log(results);
            setStep(2)


        } catch (error) {
            setErr(Error.response.data.message)
            setLoader(false)
        }
    }

    const handleVerifyOtp = async () => {
        setLoader(true)
        try {
            const results = await axios.post(`${serverUrl}/api/auth/verify-otp`, { email, otp },
                { withCredentials: true }
            )
            setErr("")
            setLoader(false)
            console.log(results);
            setStep(3)


        } catch (error) {
            setErr(Error.response.data.message)
            setLoader(false)
            console.log(error)
        }
    }

    const handleResetPassword = async () => {
        if (newPassword != confirmPassword)
            return alert("New password and Confirm password should be same")
        setLoader(true)
        try {
            const results = await axios.post(`${serverUrl}/api/auth/reset-password`, { email, newPassword },
                { withCredentials: true }
            )
            setLoader(false)
            setErr("")
            console.log(results);
            navigate('/signin')


        } catch (error) {
            setLoader(false)
            setErr(Error.response.data.message)

        }
    }

    return (
        <div className='flex items-center justify-center min-h-screen p-4 w-full bg-[#E8E8FF]'>
            <div className="bg-white max-w-md w-full shadow-lg rounded-xl p-8">
                <div className=" flex items-center gap-4 mb-4">
                    <IoIosArrowRoundBack size={30} className='text-[#28A853] cursor-pointer ' onClick={() => navigate('/signin')} />
                    <h1 className='text-xl font-bold text-center text-[#28A853]'>Forgot Password</h1>
                </div>

                {/* step1 */}
                {step == 1 &&
                    <div className="">
                        {/* email */}

                        <div className="mb-4">
                            <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
                            <input className='w-full rounded-lg border-[1px] border-gray-300 px-3 py-2 focus:outline-none'
                                type="email" placeholder='Enter Your valid EmailId'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <button className='w-full font-semibold py-2 rounded-lg 
                        transition duration-200 text-white cursor-pointer bg-[#28A853] hover:bg-[#2b8f4c] '
                            onClick={handleSendOtp}
                            disabled={loader}
                        >
                            {loader ? <ClipLoader color='white' size={20} /> : 'Send Otp'}

                        </button>
                        <p className='text-red-600 text-center my-[10px]' >{err && `*${err}`}</p>

                    </div>
                }
                {/* Step 2 */}
                {step == 2 &&
                    <div className="">
                        {/* email */}

                        <div className="mb-4">
                            <label className='block text-gray-700 font-medium mb-1' htmlFor="otp"> OTP</label>
                            <input className='w-full rounded-lg border-[1px] border-gray-300 px-3 py-2 focus:outline-none'
                                type="" placeholder='Enter Your Valid OTP'
                                value={otp}
                                required
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                        <button className='w-full font-semibold py-2 rounded-lg 
                        transition duration-200 text-white cursor-pointer bg-[#28A853] hover:bg-[#2b8f4c] '
                            onClick={handleVerifyOtp}
                            disabled={loader}
                        >
                            {loader ? <ClipLoader color='white'  size={20} /> : 'Verify Otp'}

                        </button>
                        <p className='text-red-600 text-center my-[10px]' >{err && `*${err}`}</p>

                    </div>

                }
                {/* Step 3 */}
                {step == 3 &&
                    <div className="">
                        {/* password */}

                        <div className="mb-4">
                            <label className='block text-gray-700 font-medium mb-1' htmlFor="newPassword">New Password</label>
                            <div className="relative">
                                <input className='w-full rounded-lg border-[1px] border-gray-300 px-3 py-2 focus:outline-none '
                                    type={`${showPassword ? "text" : "password"}`} placeholder='Enter Your New Password'
                                    value={newPassword}
                                    required
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />

                                <button className='absolute right-3 top-[14px] textgray-500 cursor-pointer '
                                    onClick={() => setShowPassword(!showPassword)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className='block text-gray-700 font-medium mb-1' htmlFor="confirmPassword">Confirm Password</label>
                            <div className="relative">
                                <input className='w-full rounded-lg border-[1px] border-gray-300 px-3 py-2 focus:outline-none '
                                    type='text' placeholder=' Confirm Password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />

                            </div>
                        </div>
                        <button className='w-full font-semibold py-2 rounded-lg 
                        transition duration-200 text-white cursor-pointer bg-[#28A853] hover:bg-[#2b8f4c] '
                            onClick={handleResetPassword}
                            disabled={loader}
                        >
                            {loader ? <ClipLoader color='white' size={20} /> : 'Reset Password'}

                        </button>
                        <p className='text-red-600 text-center my-[10px]' >{err && `*${err}`}</p>

                    </div>

                }


            </div>
        </div>
    )
}

export default ForgotPassword
