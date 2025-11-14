import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { serverUrl } from '../App'
import { IoIosArrowRoundBack } from 'react-icons/io'
import DeliveryBoyTracking from '../components/DeliveryBoyTracking'
import { useSelector } from 'react-redux'

function TrackOrderPage() {
    const { orderId } = useParams()
    const [currentOrder, setCurrentOrder] = useState()
    const [liveLocations,setLiveLocations]= useState({})
    const {userData,socket}= useSelector(state=>state.user)
    const navigate = useNavigate()



    const handleGetOrder = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/order/get-order-by-id/${orderId}`, { withCredentials: true })
            // console.log(result.data)
            setCurrentOrder(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        socket.on('updateDeliveryLocation',({deliveryBoyId,latitude,longitude})=>{
            setLiveLocations(prev=>({
                ...prev,
                [deliveryBoyId]:{lat:latitude,lon:longitude}
            }))
        })
    },[socket])

    useEffect(() => {
        handleGetOrder()
    }, [orderId])


    return (
        <div className='max-w-4xl flex flex-col mx-auto p-4 gap-6'>
            <div className="relative flex items-center gap-4 top-[20px] left-[20px] z-[10] mb-[10px] cursor-pointer"
                onClick={() => navigate('/home')}>
                <IoIosArrowRoundBack size={40} className='text-[#28A853]' />
                <h1 className='text-2xl md:text-center font-bold'>Track Order</h1>
            </div>
            {currentOrder?.shopOrders?.map((shopOrder, index) => (
                <div key={index} className="bg-white p-4 rounded-2xl shadow-md border border-green-200
                space-y-4">
                    <div className="">
                        <p className='text-lg font-bold mb-2 text-[#28A853]'>{shopOrder.shop.name}</p>
                        <p className='font-semibold'><span>Items : </span>{shopOrder.shopOrderItems.map(i => i.name).join(",")}</p>
                        <p ><span className='font-semibold'>Subtotal : </span>{shopOrder.subTotal}</p>
                        <p className='mt-6'><span className='font-semibold'>Delivery Address : </span>{currentOrder?.deliveryAddress.text}</p>
                    </div>
                    {shopOrder.status != "delivered" ?
                        <>
                            {shopOrder.assignedDeliveryBoy ?
                                <div className="text-sm text-gray-700">
                                    <p className='font-semibold'><span>Delivery Boy Name : </span>{shopOrder.assignedDeliveryBoy.fullName}</p>
                                    <p className='font-semibold'><span>Delivery Boy Contac No. : </span>{shopOrder.assignedDeliveryBoy.mobile}</p>
                                </div>
                                :
                                <div className="font-bold">Delivery boy is not assigned Yet</div>
                            }
                        </>
                        : <p className='text-green-600 font-semibold text-lg'>Delivered</p>}

                    {(shopOrder.assignedDeliveryBoy && shopOrder.status !== "delivered") && 
                        <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                            <DeliveryBoyTracking data={{
                                deliveryBoyLocation: liveLocations[shopOrder.assignedDeliveryBoy._id] || {
                                    lat: shopOrder.assignedDeliveryBoy.location.coordinates[1],
                                    lon: shopOrder.assignedDeliveryBoy.location.coordinates[0]
                                },
                                customerLocation: {
                                    lat: currentOrder.deliveryAddress.latitude,
                                    lon: currentOrder.deliveryAddress.longitude
                                }
                            }} />
                        </div>}


                </div>
            ))}
        </div>
    )
}

export default TrackOrderPage
