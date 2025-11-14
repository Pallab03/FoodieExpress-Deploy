import React, { useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { IoRestaurant } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function CreateEditShop() {
  const navigate = useNavigate()
  const { myShopData } = useSelector(state => state.owner)
  const { currentCity, currentAddress, currentState } = useSelector(state => state.user)
  const [name, setName] = useState(myShopData?.name || "")
  const [address, setAddress] = useState(myShopData?.address || currentAddress || "")
  const [state, setState] = useState(myShopData?.state || currentState || "")
  const [city, setCity] = useState(myShopData?.city || currentCity || "")
  const [frontendImage, setFrontendImage] = useState(myShopData?.image || null)
  const [backendImage, setBackendImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const handleImage = (e) => {
    const file = e.target.files[0]
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append("name", name)
      formData.append("city", city)
      formData.append("state", state)
      formData.append("address", address)
      if (backendImage) {
        formData.append("image", backendImage)
      }

      const result = await axios.post(`${serverUrl}/api/shop/crate-edit`, formData, { withCredentials: true });
      // console.log(result.data)
      setLoading(false)

      dispatch(setMyShopData(result.data.shop))
      navigate('/home')

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <div className='flex justify-center flex-col items-center p-6  bg-gradient-to-br from-green-50
    relative to-white min-h-screen' >

      <div className="absolute top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer"
        onClick={() => navigate('/home')}>
        <IoIosArrowRoundBack size={40} className='text-[#28A853]' />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl p-8 rounded-2xl border border-green-100">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <IoRestaurant className='text-[#28A853] w-16 h-16' />

          </div>
          <div className="text-3xl font-extrabold text-gray-800">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        <form className='space-y-5' onSubmit={handleSubmit}>
          <div className="">
            <label className='block text-sm font-medium text-gray-500 mb-1'>Shop Name</label>
            <input type="text" placeholder='Enter your shop name' className='w-full px-4 py-2
            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
              value={name}
              onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="">
            <label className='block text-sm font-medium text-gray-500 mb-1'>Shop Image</label>
            <input type="file" accept='image/*' className='w-full px-4 py-2
            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
              onChange={handleImage}
            />
            {frontendImage && <div className="mt-4">
              <img src={frontendImage} className='w-full h-48 rounded-lg object-cover border' alt="" />
            </div>}

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="">
              <label className='block text-sm font-medium text-gray-500 mb-1'>City</label>
              <input type="text" placeholder='City' className='w-full px-4 py-2
            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                value={city}
                onChange={(e) => setCity(e.target.value)} />


            </div>

            <div className="">
              <label className='block text-sm font-medium text-gray-500 mb-1'>State</label>
              <input type="text" placeholder='State' className='w-full px-4 py-2
            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                value={state}
                onChange={(e) => setState(e.target.value)} />

            </div>

          </div>

          <div className="">
            <label className='block text-sm font-medium text-gray-500 mb-1'>Address</label>
            <input type="text" placeholder='Enter your shop Address' className='w-full px-4 py-2
            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
              value={address}
              onChange={(e) => setAddress(e.target.value)} />
          </div>

          <button className='w-full text-xl bg-[#28A853] text-white px-6 py-3 rounded-lg font-semibold
          shadow-md hover:bg-[#1f7f3f] hover:shadow-lg cursor-pointer duration-200 transition-all'
            disabled={loading}>
            {loading ? <ClipLoader size={20} color='white' /> : "Save"}</button>
        </form>
      </div>

    </div>
  )
}

export default CreateEditShop
