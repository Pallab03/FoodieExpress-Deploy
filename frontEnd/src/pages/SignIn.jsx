import React, { useState } from 'react'

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router";
import axios from 'axios'
import { serverUrl } from '../App';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../firebase';
import { ClipLoader } from 'react-spinners';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const SignIn = () => {
  const primaryColor = '#28A853';
  const hoverColor = '#e64323';
  const bgColor = '#E8E8FF';
  const borderColor = '#ddd';

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [err, setErr] = useState("")
  const [loader, setLoader] = useState(false)
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSinin = async () => {
    setLoader(true)
    try {
      const result = await axios.post(`${serverUrl}/api/auth/signin`, { email, password },
        { withCredentials: true })
      setLoader(false)
      dispatch(setUserData(result.data))
      console.log(result);
      setErr("")

    } catch (error) {
      setErr(error.response.data.message)
      setLoader(false)
      console.log(error);

    }

  }

  const handleGoogleAuth = async () => {


    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider);
    // console.log(result)

    try {
      const { data } = await axios.post(`${serverUrl}/api/auth/google-auth`, {
        email: result.user.email

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
        <p className='text-gray-500 mb-8'>Sgin In to get started with delicious food deliveries</p>


        {/* email */}

        <div className="mb-4">
          <label className='block text-gray-700 font-medium mb-1' htmlFor="email">Email</label>
          <input className='w-full rounded-lg border px-3 py-2 focus:outline-none'
            type="email" placeholder='Enter Your valid EmailId'
            style={{ border: `1px solid ${borderColor}` }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button className='absolute right-3 top-[14px] textgray-500 cursor-pointer '
              onClick={() => setShowPassword(!showPassword)}>{!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}</button>
          </div>
        </div>

        <div className="mb-4 text-right"><span onClick={() => navigate("/forgot-password")} className="cursor-pointer duration-150 hover:text-[#0d632a] text-[#25a951] hover:border-b">Forgot Password</span></div>


        <button className='w-full font-semibold py-2 rounded-lg transition duration-200 text-white cursor-pointer 
        bg-[#28A853] hover:bg-[#2b8f4c] '
          disabled={loader}
          onClick={handleSinin}
        >
          {loader ? <ClipLoader color='white'  size={20} /> : 'Sign In'}

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
          <span>Continue With Google</span>
        </button>
        <p className='text-center mt-6 '>If you dont have an Account?<span onClick={() => { navigate("/signup") }} className='cursor-pointer  hover:border-b text-[#1a8a3f]'> Sign UP</span></p>



      </div>


    </div>
  )
}

export default SignIn
