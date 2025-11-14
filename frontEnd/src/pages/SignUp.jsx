import React, { useState } from 'react'

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import axios from 'axios'
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from "react-spinners"
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
const SignUp = () => {
    const primaryColor = '#28A853';
    const hoverColor = '#e64323';
    const bgColor = '#E8E8FF';
    const borderColor = '#ddd';

    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState("user");
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [mobile, setMobile] = useState("")
    const [password, setPassword] = useState("")
    const [err, setErr] = useState("")
    const [loader, setLaoder] = useState(false)
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleSinup = async () => {
        setLaoder(true)

        try {

            const result = await axios.post(`${serverUrl}/api/auth/signup`,
                { fullName, email, mobile, role, password },
                { withCredentials: true })

            setLaoder(false)
            dispatch(setUserData(result.data))

            console.log(result);
            alert(result.data.message)


        } catch (error) {
            console.log(error);
            setLaoder(false)
            setErr(error.response.data.message)
            alert(error.response.data.message)


        }

    }

    const handleGoogleAuth = async () => {

        if (!mobile) {
            return setErr("Mobile number is required")
        }

        const provider = new GoogleAuthProvider()
        const result = await signInWithPopup(auth, provider);
        // console.log(result)

        try {
            const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
                fullName: result.user.displayName,
                email: result.user.email,
                role,
                mobile
            }, { withCredentials: true })
            console.log(data)
            dispatch(setUserData(data))

            setErr("")
        } catch (error) {
            console.log(error)
            setErr(error.response.data.message)
        }

    }

    return (
        <div className='flex min-h-screen p-4 justify-center items-center w-full' style={{ backgroundColor: bgColor }}>
            <div className={`bg-white  rounded-xl shadow-lg w-full p-8 max-w-md border-[1px] 
           `} style={{ border: `1px solid ${borderColor}` }}>
                <h1 className={`text-3xl mb-2 font-bold `} style={{ color: `${primaryColor}` }}>
                    FoodieExpress
                </h1>
                <p className='text-gray-500 mb-8'>Create Your account to get started with delicious food deliveries</p>

                {/* fullName */}

                <div className="mb-4">
                    <label className='block text-gray-700 font-medium mb-1' htmlFor="fullName">Full Name</label>
                    <input className='w-full rounded-lg border px-3 py-2 focus:outline-none'
                        type="text" placeholder='Enter Your Full Name'
                        style={{ border: `1px solid ${borderColor}` }}
                        value={fullName}
                        required
                        onChange={(e) => setFullName(e.target.value)} />
                </div>

                {/* email */}

                <div className="mb-4">
                    <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
                    <input className='w-full rounded-lg border px-3 py-2 focus:outline-none'
                        type="email" placeholder='Enter Your valid EmailId'
                        style={{ border: `1px solid ${borderColor}` }}
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Mobile */}

                <div className="mb-4">
                    <label className='block text-gray-700 font-medium mb-1' htmlFor="mobile">Mobile</label>
                    <input className='w-full rounded-lg border px-3 py-2 focus:outline-none '
                        type="text" placeholder='Enter Your Valid Mobile Number'
                        style={{ border: `1px solid ${borderColor}` }}
                        value={mobile}
                        required
                        onChange={(e) => setMobile(e.target.value)}
                    />
                </div>

                {/* Password */}

                <div className="mb-4">
                    <label className='block text-gray-700 font-medium mb-1' htmlFor="password">Password</label>
                    <div className="relative">
                        <input className='w-full rounded-lg border px-3 py-2 focus:outline-none '
                            type={`${showPassword ? "text" : "password"}`} placeholder='Enter Your Password'
                            style={{ border: `1px solid ${borderColor}` }}
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button className='absolute right-3 top-[14px] textgray-500 cursor-pointer '
                            onClick={() => setShowPassword(!showPassword)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
                    </div>
                </div>

                {/* Role  */}

                <div className="mb-4">
                    <label className='block text-gray-700 font-medium mb-1' htmlFor="role">Role</label>
                    <div className="flex gap-2">
                        {["user", "owner", "deliveryBoy"].map((r) => (
                            <button className='flex-1 cursor-pointer border border-gray-400 rounded-lg px-3 py-2 text-center font-medium transition-colors'
                                onClick={() => setRole(r)}
                                style={
                                    role == r ? { backgroundColor: primaryColor, color: 'white' } : { border: `1px solid ${primaryColor}`, color: primaryColor }

                                }>{r}</button>
                        ))}
                    </div>

                </div>

                <button className='w-full font-semibold py-2 rounded-lg transition duration-200 text-white cursor-pointer
                    bg-[#28A853] hover:bg-[#2b8f4c] '
                    onClick={handleSinup}
                    disabled={loader}
                >
                    {loader?<ClipLoader color='white'  size={20}/>:'Sign Up'}
                </button>
                <p className='text-red-600 text-center my-[10px]' >{err && `*${err}`}</p>

                <div className="flex items-center my-2">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-3 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button className="w-full flex mt-4 justify-center items-center gap-2 rounded-lg px-4 py-2
                 transition duration-200 border border-gray-400 hover:bg-gray-100 cursor-pointer"
                    onClick={handleGoogleAuth}>
                    <FcGoogle size={20} />
                    <span>Sign Up With Google</span>
                </button>
                <p className='text-center mt-6 '>Already have an account ?<span onClick={() => { navigate("/signin") }} className='cursor-pointer  hover:border-b text-[#1a8a3f]'> Sign In</span></p>



            </div>


        </div>
    )
}

export default SignUp
