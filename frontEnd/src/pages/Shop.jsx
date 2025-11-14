import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { serverUrl } from '../App';
import { FaArrowLeft, FaStore, FaUtensils } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import FoodCard from '../components/FoodCard';

function Shop() {
    const { shopId } = useParams();
    const [items, setItems] = useState([]);
    const [shop, setShop] = useState()
    const navigate = useNavigate()


    const handleShop = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`,
                { withCredentials: true })
            setShop(result.data.shop);
            setItems(result.data.items)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleShop()
    }, [shopId])
    return (
        <div className='min-h-screen bg-gray-100'>
            <button className='absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/20
            hover:bg-black/50 text-white px-3 py-2 cursor-pointer rounded-full shadow transition' onClick={()=>navigate('/home')}>
                <FaArrowLeft/>
                <span className='text-xl'>Back</span>
            </button>
            {shop &&
                <div className="relative w-full h-64px md:h-80 lg:h-96">
                    <img src={shop.image} alt="" className='w-full h-full object-cover' />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30
                    flex flex-col justify-center items-center text-center px-4">
                        <FaStore className='text-white text-4xl mb-3 drop-shadow-md' />
                        <h1 className='text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg'>{shop.name}</h1>

                        <div className="flex items-center gap-[10px] mt-[20px]">
                            <FaLocationDot size={22} color='red' />
                            <p className='text-lg font-medium text-gray-200 '>
                                {shop.address}
                            </p>
                        </div>
                    </div>
                </div>
            }

            <div className="max-w-7xl mx-auto px-6 py-10">
                <h2 className='flex items-center justify-center gap-3 text-3xl font-bold mb-10
                text-gray-800'><FaUtensils color='red' /> Our Menu</h2>

                {items.length > 0 ? (
                    <div className="flex flex-wrap justify-center gap-8">
                        {items.map((item) => (
                            <FoodCard data={item}/>
                        ))}
                    </div>
                ) :
                    <div className="w-full">
                        <p className='text-gray-700 text-lg text-center'>No Items Available</p>
                    </div>
                }
            </div>


        </div>
    )
}

export default Shop
