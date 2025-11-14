import React from 'react'
import { MdOutlineDeliveryDining } from "react-icons/md";
import { FaCreditCard, FaMobileAlt } from "react-icons/fa";
import { IoIosArrowRoundBack } from 'react-icons/io'
import { IoLocationSharp, IoSearch } from 'react-icons/io5'
import { TbCurrentLocation } from 'react-icons/tb'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import 'leaflet/dist/leaflet.css'
import { useState } from 'react'
import { useEffect } from 'react'
import { setAddress, setLocation } from '../redux/mapSlice'
import axios from 'axios'
import { serverUrl } from '../App';
import { addMyOrder } from '../redux/userSlice';

function RecenterMap({ location }) {
    // console.log(location)
    if (location.lat && location.lon) {
        const map = useMap()
        map.setView([location.lat, location.lon], 18, { animate: true })
    }
    return null;
}

function CheckOut() {
    const navigate = useNavigate()
    const apikey = import.meta.env.VITE_GEOAPI_KEY

    const [addressInput, setAddressInput] = useState("")
    const [paymentMethod, setPaynebtMethod] = useState("cod")
    const { location, address } = useSelector(state => state.map)
    const { cartItems, totalAmount, userData } = useSelector(state => state.user)
    const dispatch = useDispatch()
    const deliveryFee = totalAmount > 500 ? 0 : 40
    const AmountWithDeliveryFee = deliveryFee + totalAmount

    const onDrangEnd = (e) => {
        const { lat, lng } = e.target._latlng
        dispatch(setLocation({ lat: lat, lon: lng }))
        getAddressbyLatLng(lat, lng)
    }

    const getAddressbyLatLng = async (lat, lng) => {

        try {

            const result = await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apikey}`)
            // console.log(result?.data?.results[0])
            dispatch(setAddress(result?.data?.results[0].address_line2))
            setAddressInput(result?.data?.results[0].address_line2)

        } catch (error) {
            console.log(error)
        }
    }

    const getCurrentLocation = async () => {
        try {
            //to get currentlocation
            const latitued = userData.user.location.coordinates[1]
            const longitude = userData.user.location.coordinates[0]
            dispatch(setLocation({ lat: latitued, lon: longitude }))
            getAddressbyLatLng(latitued, longitude)

        } catch (error) {
            console.log(error)
        }
    }

    const getLatLngByAddress = async () => {
        try {
            const result = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&format=json&apiKey=${apikey}`)
            const { lat, lon } = result.data.results[0]
            // console.log(lat,lon)
            dispatch(setLocation({ lat, lon }))

        } catch (error) {
            console.log(error)
        }
    }

    const handlePlaceOreder = async () => {
        try {
            const result = await axios.post(`${serverUrl}/api/order/place-order`, {
                cartItems, paymentMethod,
                deliveryAddress: {
                    text: addressInput,
                    latitude: location.lat,
                    longitude: location.lon
                },
                totalAmount:AmountWithDeliveryFee

            }, { withCredentials: true })

            if (paymentMethod == "cod") {
                dispatch(addMyOrder(result.data))
                navigate('/order-placed')
            } else {
                const orderId = result.data.orderId
                const razorOrder = result.data.razorOrder
                openRazorpayWindow(orderId, razorOrder)
            }


        } catch (error) {
            console.log(error)
        }
    }

    const openRazorpayWindow = (orderId, razorOrder) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_API_KEY, // Replace with your actual Key ID from Razorpay Dashboard
            amount: razorOrder.amount,      // Amount in paise (e.g., 50000 for INR 500)
            currency: "INR",
            name: "Food Delivery",
            description: "Test Transaction",
            order_id: razorOrder.id, // This should be generated on your server-side
            handler: async function (response) {

                try {
                    const result = await axios.post(`${serverUrl}/api/order/verify-paymet`, {
                        razorpay_payment_id: response.razorpay_payment_id,
                        orderId
                    }, { withCredentials: true })
                    dispatch(addMyOrder(result.data))
                    navigate('/order-placed')
                } catch (error) {
                    console.log(error)
                }
            },
            theme: {
                color: "#3399cc" // Customize the theme color
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    }

    useEffect(() => {
        setAddressInput(address)
    }, [address])

    return (
        <div className='min-h-screen flex items-center justify-center bg-[#fafff6] p-6'>
            <div className="absolute top-[20px] left-[20px] z-[10] cursor-pointer"
                onClick={() => navigate('/cart')}>
                <IoIosArrowRoundBack size={40} className='text-[#28A853]' />
            </div>
            <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
                <h1 className='text-2xl text-gray-800 font-bold'>Checkout</h1>

                {/* map */}
                <section>
                    <h2 className='text-lg font-semibold mb-2 flex items-center gap-2 text-gray-800'>
                        <IoLocationSharp size={20} className='text-[#ff2929]' />Delivery Loacation</h2>
                    <div className="flex gap-2 mb-3">
                        <input type="text" className='flex flex-1 border border-gray-300 rounded-lg p-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-[#28A853]' placeholder='Please enter Your Delivery address..'
                            value={addressInput} onChange={(e) => setAddressInput(e.target.value)} />
                        <button className='bg-[#ff2929] hover:bg-[#d42828] text-white px-3 py-2 rounded-lg
                            flex items-center justify-center cursor-pointer transition-all duration-200' onClick={getLatLngByAddress}><IoSearch size={20} />
                        </button>
                        <button className='bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg
                            flex items-center justify-center cursor-pointer transition-all duration-200'
                            onClick={getCurrentLocation}><TbCurrentLocation size={20} /></button>
                    </div>
                    <div className="rounded-xl overflow-hidden border">
                        <div className="h-64 w-full flex items-center justify-center">
                            <MapContainer className={'w-full h-full'}
                                center={[location.lat, location.lon]}
                                zoom={18}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                <RecenterMap location={location} />

                                <Marker position={[location?.lat, location?.lon]} draggable
                                    eventHandlers={{ dragend: onDrangEnd }} />
                            </MapContainer>
                        </div>
                    </div>
                </section>

                {/* payment method */}
                <section>
                    <h2 className='text-lg font-semibold mb-3 text-gray-800'>Payment Method</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={`flex items-center gap-3 rounded-xl border p-4 
                        text-left transition ${paymentMethod === "cod" ? "border-[#ff4d2a] bg-orange-50 shadow" :
                                "border-gray-200 hover:border-gray-300"} cursor-pointer`} onClick={() => setPaynebtMethod("cod")}>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100'>
                                <MdOutlineDeliveryDining className='text-green-600 text-xl' />
                            </span>
                            <div className="">
                                <p className=' font-medium text-gray-800'>Cash On Delivery</p>
                                <p className=' text-xs text-gray-500'>Pay When your food arives</p>
                            </div>

                        </div>
                        <div className={`flex items-center gap-3 rounded-xl border p-4 
                        text-left transition ${paymentMethod === "online" ? "border-[#ff4d2a] bg-orange-50 shadow" :
                                "border-gray-200 hover:border-gray-300"} cursor-pointer`} onClick={() => setPaynebtMethod("online")}>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                                <FaMobileAlt className='text-purple-600 text-xl' />
                            </span>
                            <span className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100'>
                                <FaCreditCard className='text-blue-600 text-xl' />
                            </span>
                            <div className="">
                                <p className=' font-medium text-gray-800'>UPI / Debit / Credit Card</p>
                                <p className=' text-xs text-gray-500'>Pay Scurely Online</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-lg  font-semibold mb-3 text-gray-800'>
                        Order Summery
                    </h2>
                    <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
                        {cartItems.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm text-gray-700">
                                <span>{item.name} x {item.quantity}</span>
                                <span>₹ {item.price * item.quantity}</span>
                            </div>

                        ))}
                        <hr className='text-gray-300 my-2' />
                        <div className="flex justify-between text-gray-800 font-medium">
                            <span>Subtotal</span>
                            <span>{totalAmount}</span>
                        </div>
                        <div className="flex justify-between text-gray-700 ">
                            <span>Delivery Fee</span>
                            <span>{deliveryFee == 0 ? "Free" : deliveryFee}</span>
                        </div>
                        <hr className='text-gray-300 my-2' />

                        <div className="flex justify-between text-lg text-[#e62525] font-bold pt-2">
                            <span>Total</span>
                            <span>{AmountWithDeliveryFee}</span>
                        </div>

                    </div>
                </section>
                <button className='w-full bg-[#28A853] hover:bg-[#248f48] text-white py-3
                rounded-lg cursor-pointer text-xl transition-all duration-200 font-semibold '
                    onClick={handlePlaceOreder}>{paymentMethod === "cod" ? "Place Order" : "Pay & Place Order"}</button>

            </div>
        </div>
    )
}

export default CheckOut
