import axios from 'axios'
import React from 'react'
import { MdPhone } from 'react-icons/md'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { updateOrderStaus } from '../redux/userSlice'
import { useState } from 'react'

function OwnerOrderCard({ data }) {
    const dispatch = useDispatch()
    const [availableBoys, setAvailableBoys] = useState([])
    const handleUpadteStatus = async (orderId, shopId, status) => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/update-status/${orderId}/${shopId}`, { status }, { withCredentials: true })
            dispatch(updateOrderStaus({ orderId, shopId, status }))
            console.log(result.data)
            setAvailableBoys(result.data.availableBoys)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='bg-white rounded-lg shadow p-4 space-y-4'>
            <div className="">
                <h2 className='text-lg font-semibold text-gray-800'>{data.user.fullName}</h2>
                <p className='text-sm text-gray-500'>{data.user.email}</p>
                <p className='flex items-center gap-2 text-sm text-gray-600 mt-1'><MdPhone /><span>{data.user.mobile}</span></p>
                
                {data.paymentMethod == "online"?<p className='text-sm text-gray-500'>payment : {data.payment?"Done":"Due"}</p>:
                <p className='text-sm text-gray-500'>Payment Method: {data.paymentMethod}</p>
                }
            </div>

            <div className="flex flex-col items-start gap-2 text-gray-600 text-sm">
                <p>{data?.deliveryAddress.text} </p>
                <p className='text-gray-500 text-xs'>Lat: {data?.deliveryAddress.latitude} , Lon: {data?.deliveryAddress.longitude}</p>

            </div>


            <div className="flex space-x-4 overflow-x-auto pb-2">
                {data.shopOrders.shopOrderItems.map((item, index) => (
                    <div className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white" key={index}>
                        <img src={item.item.image} alt="" className='w-full h-24 object-cover rounded' />
                        <p className='text-sm font-semibold mt-1 truncate'>{item.name}</p>
                        <p className='text-xs text-gray-500'>Qty {item.quantity} x ₹ {item.price}</p>
                    </div>
                ))}


            </div>

            <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-200">
                <span className='text-sm'>Status:<span className='font-semibold capitalize text-[#e62525]'> {data.shopOrders.status}</span>
                </span>

                <select className='rounded-md border px-3 py-1
                text-center cursor-pointer text-sm focus:outline-none focus:ring-2 border-[#e62525] text-[#e62525] focus:ring-[#e62525]'
                    onChange={(e) => handleUpadteStatus(data._id, data.shopOrders.shop._id, e.target.value)}>
                    <option value="">Changing status</option>

                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out of delivery">Out of delivery</option>
                </select>


            </div>
            {data.shopOrders.status == "out of delivery" &&
                <div className="mt-3 p-2 border rounded-lg text-sm bg-green-50">
                    {data.shopOrders.assignedDeliveryBoy?<p>Assigned Deliveryboys.</p>:<p>Availble Deliveryboys.</p>}
                    {availableBoys.length > 0 ? (
                        availableBoys.map((b, index) => (
                            <div key={index} className="text-gray-700">{b.fullName}-{b.mobile}</div>

                        ))
                    ) :data.shopOrders.assignedDeliveryBoy?
                    <div>Name : {data.shopOrders.assignedDeliveryBoy.fullName} | 
                    Contact : {data.shopOrders.assignedDeliveryBoy.mobile}</div>: 
                    <div className=""> waiting for Deliveryboys to acccept</div>
                    }
                </div>
            }

            <div className="text-right font-bold text-gray-800 text-sm">
                Total: ₹{data.shopOrders.subTotal}
            </div>

        </div>
    )
}

export default OwnerOrderCard
