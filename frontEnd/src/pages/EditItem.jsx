import React, { useEffect, useRef, useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { IoRestaurant } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { setMyShopData } from '../redux/ownerSlice';
import { ClipLoader } from 'react-spinners';

function EditItem() {
    const navigate = useNavigate()
    const { myShopData } = useSelector(state => state.owner)
    const { itemId } = useParams()
    const [currentItem, setCurrentItem] = useState(null)

    const [name, setName] = useState("")
    const [frontendImage, setFrontendImage] = useState(null)
    const [backendImage, setBackendImage] = useState(null)
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState("")
    const [foodType, setFoodType] = useState("")
    const [loading, setLoading] = useState(false)

    const categories = ["Snacks",
        "Main Course",
        "Deserts", "Pizza",
        "Burgers",
        "Sandwiches",
        "North Indian",
        "South Indian",
        "Chinese",
        "Fast Food",
        "Others"
    ]

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
            formData.append("category", category)
            formData.append("price", price)
            formData.append("foodType", foodType)


            if (backendImage) {
                formData.append("image", backendImage)
            }
            // formData.forEach((value, key) => {
            //     console.log(key, value);
            // });
            const result = await axios.post(`${serverUrl}/api/item/edit-item/${itemId}`, formData, { withCredentials: true });
            setLoading(false)
            // console.log(result.data.shop)
            dispatch(setMyShopData(result.data.shop))
            navigate('/home')

        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {

        const handleGetItemById = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/item/get-item-by-id/${itemId}`, { withCredentials: true })
                setCurrentItem(result.data);
                console.log(result.data)
            } catch (error) {
                console.log(error)
            }
        }
        handleGetItemById();


    }, [itemId])

    useEffect(() => {
        setName(currentItem?.name || "")
        setPrice(currentItem?.price || 0)
        setFrontendImage(currentItem?.image || "")
        setCategory(currentItem?.category || "")
        setFoodType(currentItem?.foodType || "")

    }, [currentItem])

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
                        Edit Food Items
                    </div>
                </div>

                <form className='space-y-5' onSubmit={handleSubmit}>

                    <div className="">
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Food Name</label>
                        <input type="text" placeholder='Enter your food name' className='w-full px-4 py-2
                            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                            value={name}
                            onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="">
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Food Image</label>
                        <input type="file" accept='image/*' className='w-full px-4 py-2
                            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                            onChange={handleImage}
                        />
                        {frontendImage && <div className="mt-4">
                            <img src={frontendImage} className='w-full h-48 rounded-lg object-cover border' alt="" />
                        </div>}

                    </div>

                    <div className="">
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Price</label>
                        <input type="text" placeholder='₹ 0' className='w-full px-4 py-2
                            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)} />
                    </div>
                    <div className="">
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Select Category</label>
                        <select className='w-full px-4 py-2
                            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}>

                            <option value="">Select Category</option>
                            {categories.map((cate, index) => (
                                <option key={index} value={cate}>{cate}</option>

                            ))}


                        </select>
                    </div>
                    <div className="">
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Select food type</label>
                        <select className='w-full px-4 py-2
                            border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300'
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                        >

                            <option value="veg">Veg</option>
                            <option value="non veg">Non Veg</option>



                        </select>
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

export default EditItem
