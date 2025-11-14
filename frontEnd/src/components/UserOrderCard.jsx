import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import { serverUrl } from '../App'
import { FaRegStar, FaStar } from 'react-icons/fa'

function UserOrderCard({ data }) {
    const navigate = useNavigate()

    const [selectedRating,setSelectedRating]= useState({})

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-GB', {
            day: "2-digit",
            month: 'short',
            year: 'numeric'
        })
    }

    const handleRating= async(itemId,rating)=>{
        try {
            const result= await axios.post(`${serverUrl}/api/item/rating`,{itemId,rating},{withCredentials:true})

            setSelectedRating (prev=>({
                ...prev,
                [itemId]:rating
            }))
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='bg-white shadow rounded-lg p-4 space-y-4'>
            <div className="flex justify-between border-b pb-2">
                <div className="">
                    <p className='font-semibold'>Order #{data._id.slice(-6)}</p>
                    <p className='text-sm text-gray-500'>
                        Date: {formatDate(data.createdAt)}
                    </p>
                </div>
                <div className="text-right">
                    {data.paymentMethod=="cod"?
                    <p className='text-sm text-gray-500 font-semibold' >{data.paymentMethod?.toUpperCase()} / Payment : {data.payment?"Done":"Due"}</p>
                    :<p className='text-sm text-gray-500 font-semibold'>{data.paymentMethod?.toUpperCase()} / Payment : {data.payment?"Done":"Due"}</p>
                    }
                    <p>
                        <p className='font-medium text-blue-600'>{data.shopOrders[0]?.status}</p>
                    </p>
                </div>
            </div>
            {data.shopOrders.map((shopOrder, index) => (
                <div className=" rounded-lg p-3 bg-[#fafff6] space-y-3" key={index}>
                    <p>{shopOrder.shop.name}</p>
                    
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {shopOrder.shopOrderItems.map((item, index) => (
                            <div className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white" key={index}>
                                <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                                <p className='text-sm font-semibold mt-1 truncate'>{item.name}</p>
                                <p className='text-xs text-gray-500'>Qty {item.quantity} x ₹ {item.price}</p>

                                {shopOrder.status=="delivered" && 
                                <div className="flex space-x-1 mt-2">
                                    {[1,2,3,4,5].map((star)=>(
                                        <button className={`text-lg cursor-pointer ${selectedRating[item.item._id]>=star?
                                            'text-yellow-400':'text-gray-400'}`}
                                        onClick={()=>handleRating(item.item._id,star)}>
                                            <FaStar /></button>
                                    ))}
                                </div> }

                            </div>
                        ))}

                    </div>
                    <div className="flex justify-between items-center border-t pt-2">
                        <p className='font-semibold'>Subtotal : ₹ {shopOrder.subTotal}</p>
                        <span className='text-sm font-medium text-blue-600'> {shopOrder.status}</span>
                    </div>
                </div>
            ))}

            <div className="flex justify-between items-center pt-2 border-t">
                <p className='font-semibold'>Total Amount : ₹ {data.totalAmount}</p>
                <button className="bg-[#28A853] hover:bg-[#248f48] text-white rounded-lg px-4 py-2
                transition text-sm cursor-pointer duration-200" onClick={()=>navigate(`/track-order/${data._id}`)}>Track Order</button>
            </div>

        </div>
    )
}

export default UserOrderCard
