import React from 'react'
import { IoIosArrowRoundBack } from 'react-icons/io'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import CartItemCard from '../components/CartItemCard'

function CartPage() {
    const navigate = useNavigate()
    const { cartItems, totalAmount } = useSelector(state => state.user)
    console.log(cartItems)
    return (
        <div className='flex min-h-screen justify-center p-6 bg-[#fafff6]'>
            <div className="w-full max-w-[800px]">
                <div className="flex items-center mb-6 gap-[20px] ">
                    <div className=" z-[10] cursor-pointer"
                        onClick={() => navigate('/home')}>
                        <IoIosArrowRoundBack size={40} className='text-[#28A853]' />
                    </div>
                    <h1 className='text-2xl text-start font-bold'>Your Cart</h1>

                </div>
                {cartItems?.length == 0 ? (
                    <p className='text-gray-500 text-center text-lg'>No Items Added</p>
                ) : (
                    <>
                        <div className="space-y-4">
                            {cartItems?.map((item, index) => (
                                <CartItemCard data={item} key={index} />
                            ))}
                        </div>
                        <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between 
                            items-center border">
                            <h1 className='text-lg font-semibold'> Total Amount</h1>
                                <span className='text-xl font-bold text-[#e62525]'> ₹ {totalAmount}</span>

                        </div>
                        <div className="mt-4 flex justify-end">

                            <button className='bg-[#28A853] hover:bg-[#2b8f4c] text-white 
                            px-6 py-3 rounded-lg text-lg font-medium transition duration-200 cursor-pointer' 
                            onClick={()=>navigate('/checkout')}>Proceed to CheckOut 
                            </button>
                        </div>
                    </>
                )
                }
            </div>
        </div>
    )
}

export default CartPage
