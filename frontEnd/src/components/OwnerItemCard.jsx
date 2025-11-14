import axios from 'axios';
import React from 'react'
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setMyShopData } from '../redux/ownerSlice';
function OwnerItemCard({ data }) {

    const navigate = useNavigate()
    const dispatch= useDispatch()


    const handleDeleteItem = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/item/delete/${data._id}`,{withCredentials:true});
            console.log(result)
            dispatch(setMyShopData(result.data.shop))
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='flex bg-white rounded-lg shadow-md overflow-hidden border border-[#28A853]
    w-full max-w-2xl'>
            <div className="w-36  flex-shrink-0 bg-gray-50">
                <img src={data.image} alt={data.name} className='h-full w-full object-cover' />
            </div>
            <div className="flex flex-col justify-between p-3 flex-1">
                <div className="">
                    <h2 className='text-base font-semibold text-[#e62525]'>{data.name}</h2>
                    <p><span className='font-medium text-gray-800'>Category:</span> {data.category}</p>
                    <p><span className='font-medium text-gray-800'>Food type:</span> {data.foodType}</p>
                </div>
                <div className="flex items-center justify-between">
                    <div className="font-bold text-[#e62525]">₹ {data.price}</div>
                    <div className="flex items-center gap-2">

                        <div className="p-2 rounded-full hover:bg-[#e62525]/10 hover:scale-150 cursor-pointer text-[#e62525]
                        transition-all duration-200" onClick={() => navigate(`/edit-item/${data._id}`)}>
                            <MdEdit size={16} />
                        </div>
                        <div className="p-2 rounded-full hover:bg-[#e62525]/10 hover:scale-150 cursor-pointer text-[#e62525]
                        transition-all duration-200" onClick={handleDeleteItem}>
                            <MdDelete size={16} />
                        </div>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default OwnerItemCard
