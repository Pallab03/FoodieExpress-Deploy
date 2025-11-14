import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";
import { useNavigate } from 'react-router';

function OrderPlaced() {
    const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#fafff6] flex flex-col justify-center items-center 
    px-4 text-center overflow-hidden relative'>
      <FaCircleCheck className='text-green-500 text-6xl mb-4'/>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully .</h1>
      <p className="text-gray-600 max-w-md mb-6">Thank you for purchased. Your order in being prepared.
        You can track your oredr in the "My Order" Sexction.
      </p>
      <button className=" bg-[#28A853] hover:bg-[#248f48] text-white rounded-xl px-6 py-3
      transition text-lg font-medium cursor-pointer duration-200 "
      onClick={()=>navigate('/my-orders')}>
        Back to my orders</button>
    </div>
  )
}

export default OrderPlaced
