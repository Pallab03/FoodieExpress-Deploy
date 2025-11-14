import React, { useEffect } from 'react'
import Nav from './nav'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'
import { useState } from 'react'
import DeliveryBoyTracking from './DeliveryBoyTracking'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { ClipLoader } from 'react-spinners'

function DeliveryBoyDashboard() {
  const { userData, socket } = useSelector(state => state.user)
  // console.log(userData)
  const [avilableAssignment, setAvilableAssignment] = useState([])
  const [currentOrder, setCurrentOrder] = useState()
  const [showOtpBox, setShowOtpBox] = useState(false)
  const [otp, setOtp] = useState("")
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [todayDeliveries, setTodayDeliveries] = useState([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!socket || userData.user.role !== "deliveryBoy")
      return

    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        setDeliveryBoyLocation({ lat: latitude, lon: longitude })
        socket.emit('updateLocation', {
          longitude,
          latitude,
          userId: userData.user._id
        })
      },
        (error) => {
          console.log(error)
        },
        {
          enableHighAccuracy: true
        }
      )
    }
    return () => {
      if (watchId)
        navigator.geolocation.clearWatch(watchId)
    }

  }, [socket, userData])

  const ratePerDelivery = 35;
  const totalEarning = todayDeliveries.reduce((sum, d) => sum + d.count * ratePerDelivery, 0)

  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, { withCredentials: true })
      // console.log(result.data)
      setAvilableAssignment(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`, { withCredentials: true })
      console.log(result.data)
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  // const handleSendOtp = () => {
  // }

  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accepet-order/${assignmentId}`, { withCredentials: true })
      console.log(result.data)
      await getCurrentOrder()

    } catch (error) {
      console.log(error)
    }
  }

  const sendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(`${serverUrl}/api/order/send-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id
        }, { withCredentials: true })
      setLoading(false)
      setShowOtpBox(true)

      console.log(result.data)

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }


  const verifyOtp = async () => {
    setMessage("")
    try {
      setLoading(true)
      const result = await axios.post(`${serverUrl}/api/order/send-verify-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp
        }, { withCredentials: true })
      setLoading(false)
      setMessage(result.data.message)
      console.log(result.data)
      location.reload()

    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleTodayDeliveries = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-today-deliveries`,
        { withCredentials: true })
      console.log(result.data)

      setTodayDeliveries(result.data)

    } catch (error) {
      console.log(error)
    }
  }




  useEffect(() => {
    socket?.on('newAssignment', (data) => {
      if (data.sentTo == userData.user._id) {
        setAvilableAssignment(prev => [data, ...prev])
      }
    })

    return () => {
      socket?.off('newAssignment')
    }
  }, [socket])


  useEffect(() => {
    getAssignments();
    getCurrentOrder();
    handleTodayDeliveries();
  }, [userData])
  return (
    <div className='w-full min-h-screen bg-[#fafff6] flex flex-col gap-5 overflow-y-auto items-center'>
      <Nav />

      <div className=" w-full max-w-[800px] flex flex-col gap-5 items-center">

        <div className="bg-white rounded-xl gap-2 flex-col shadow-md p-5 flex justify-start items-center
        w-[90%] border border-green-50 text-center ">

          <h1 className='text-xl font-bold text-[#28A853]'>Welcome, {userData.user.fullName} </h1>
          <p className='text-[#f91e0a]'>
            <span className='font-semibold'>Latitude:</span> {deliveryBoyLocation?.lat || userData.user.location.coordinates[1]}, <span className='font-semibold'>Longitude: </span>{deliveryBoyLocation?.lon || userData.user.location.coordinates[0]}</p>
        </div>

        {todayDeliveries.length > 0 &&
          <div className="bg-white rounded-2xl shadow-md p-5 w-[90%] mb-6 border border-green-100">
            <h1 className='text-lg font-bold mb-3 text-[#28A853] text-center'>Today deliveries</h1>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={todayDeliveries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={label => `${label}:00`} />
                <Bar dataKey="count" fill='#28A853' />
              </BarChart>
            </ResponsiveContainer>
            <div className="max-w-sm mx-auto mt-6 p-6 bg-white rounded-xl shadow-lg text-center">
              <h1 className='text-xl font-semibold text-gray-800 mb-2'>Today's Earning</h1>
              <span className='text-3xl font-bold text-[#28A853]'>₹{totalEarning}</span>
            </div>
          </div>
        }


        {!currentOrder && <div className="bg-white rounded-xl p-5 shadow-md w-[90%] border border-green-50">
          <h1 className='text-lg flex items-center font-bold gap-2 mb-4'>Available Orders</h1>

          <div className="space-y-4">
            {avilableAssignment.length > 0
              ? (
                avilableAssignment.map((a, index) => (
                  <div className="border rounded-lg justify-between flex p-4 items-center" key={index}>
                    <div className="">
                      <p className='text-sm font-semibold'>{a?.shopName}</p>
                      <p className='text-gray-600 text-sm'><span className='font-semibold'>Delivery address : </span>{a?.deliveryAddress?.text}</p>
                      <p className='text-xs text-gray-500'>{a?.items.length} Items | {a.subTotal}</p>
                    </div>
                    <button className='bg-green-500 text-white px-4 py-1 rounded-lg 
                    text-sm hover:bg-green-600 cursor-pointer'
                      onClick={() => acceptOrder(a.assignmentId)}>
                      Accept
                    </button>
                  </div>
                ))
              ) : <p className='text-gray-500 text-sm text-center'>No Avilable Orders</p>}
          </div>
        </div>}

        {currentOrder && <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-green-100">
          <h2 className='text-lg font-bold mb-3'>🍱 Current Order Details</h2>
          <div className="border rounded-lg p-4 mb-3">
            <p className='font-semibold text-sm'>{currentOrder?.shopOrder.shop.name}</p>
            <p className='text-sm text-gray-500'>{currentOrder?.deliveryAddress.text}</p>
            <p className='text-xs text-gray-400'>{currentOrder?.shopOrder.shopOrderItems.length} Items | {currentOrder?.shopOrder.subTotal}</p>

          </div>

          <DeliveryBoyTracking data={{
            deliveryBoyLocation: deliveryBoyLocation || {
              lat: userData.user.location.coordinates[1],
              lon: userData.user.location.coordinates[0]
            },
            customerLocation: {
              lat: currentOrder.deliveryAddress.latitude,
              lon: currentOrder.deliveryAddress.longitude
            }
          }} />
          {!showOtpBox ?
            <button className='mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 
          rounded-md cursor-pointer shadow-md hover:bg-green-600 active:scale-95 duration-200 
          transition-all' onClick={sendOtp} disabled={loading}>
              {loading ? <ClipLoader size={20} color='white' /> : "Mark As Delivered"}
            </button>
            :
            <div className="mt-4 p-4 border rounded-xl text-center bg-gray-50">
              <p className='text-md font-semibold mb-4'>Enter Otp Send to <span className='text-green-600'>{currentOrder.user.fullName}</span></p>
              <input type="text" className='w-full border border-gray-400 px-3 py-2 rounded-lg mb-3
               focus:outline-none  focus:outline-2 focus:ring-2  focus:ring-green-400' placeholder='Enter OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)} />
              {message&&<p className='text-center text-green-500 text-2xl mb-2'>{message}</p>}

              <button className=' w-full bg-green-500 text-white py-2 rounded-md cursor-pointer
                hover:bg-green-600 font-semibold duration-200 transition-all' onClick={verifyOtp} >Submit OTP
              </button>
            </div>
          }

        </div>
        }



      </div>

    </div>
  )
}

export default DeliveryBoyDashboard
