import React from 'react'
import Nav from './nav'
import { useSelector } from 'react-redux'
import { IoRestaurant } from "react-icons/io5";
import { useNavigate } from 'react-router';
import { TbHomeEdit } from "react-icons/tb";
import OwnerItemCard from './ownerItemCard';

function OwnerDashboard() {
  const { myShopData } = useSelector(state => state.owner)
  console.log(myShopData)
  const navigate = useNavigate()
  return (
    <div className='w-full min-h-screen bg-[#fafff6] flex flex-col items-center'>
      <Nav />
      {!myShopData &&
        <div className="flex  justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border
          border-gray-100 hover:shasow-xl transition-shadow duration-300 cursor-pointer">
            <div className="flex flex-col text-center items-center">
              < IoRestaurant className='text-[#e64c25] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
              <h2 className=' text-xl sm:text-2xl  font-bold text-gray-800 mb-2'>Add Your Restaureat</h2>
              <p className='text-gray-600 mb-4 text-sm sm:text-base'> Partner with us and expand your reach — deliver your food to thousands of customers in just a
                few clicks!</p>
              <button className="bg-[#28A853] text-white px-5 sm:px-6 py-2 rounded-full
                font-medium shadow-md hover:bg-[#178b40] cursor-pointer transition-all duration-200"
                onClick={() => navigate("/create-edit-shop")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      }

      {myShopData &&
        <div className="w-full flex flex-col items-center px-4 gap-6 sm:px-6">
          <h1 className='text-2xl sm:text-3xl text-gray-800 flex items-center gap3 mt-8
        text-center'> < IoRestaurant className='text-[#e64c25] w-12 h-12 mr-2 ' />Welcome to {myShopData.name}</h1>


          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-green-100
              hover:shadow-2xl transition-all w-full duration-300 max-w-3xl relative ">


            <div className="absolute top-4 right-4 bg-[#e62525] text-white p-2 rounded-full
            shadow-md hover:bg-[#cb2323] transition-all cursor-pointer hover:scale-110 duration-300"
              onClick={() => navigate("/create-edit-shop")}>
              <TbHomeEdit size={20} />
            </div>

            <img src={myShopData?.image} alt={myShopData.name} className='w-full h-48 sm:h-64 object-cover' />


            <div className="p-4 sm:p-6">
              <h1 className='text-xl sm:text-2xl font-bold text-gray-800 mb-2'>{myShopData.name}</h1>
              <p className='text-gray-500 '>{myShopData.city},{myShopData.state}</p>
              <p className='text-gray-500 mb-4'>{myShopData.address}</p>
            </div>
          </div>

          {myShopData.items.length == 0 &&
            <div className="flex  justify-center items-center p-4 sm:p-6">
              <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border
              border-gray-100 hover:shasow-xl transition-shadow duration-300 cursor-pointer">
                <div className="flex flex-col text-center items-center">
                  < IoRestaurant className='text-[#e64c25] w-16 h-16 sm:w-20 sm:h-20 mb-4' />
                  <h2 className=' text-xl sm:text-2xl  font-bold text-gray-800 mb-2'>Add Your Food Items</h2>
                  <p className='text-gray-600 mb-4 text-sm sm:text-base'>From your kitchen to customer’s plate — add your food today!</p>
                  <button className="bg-[#28A853] text-white px-5 sm:px-6 py-2 rounded-full
                    font-medium shadow-md hover:bg-[#178b40] cursor-pointer transition-all duration-200"
                    onClick={() => navigate("/add-item")}>
                    Add Food
                  </button>
                </div>
              </div>
            </div>
          }
          {myShopData.items.length > 0 && 
          <div className="flex flex-col items-center mb-4  gap-4 w-full max-w-3xl">
            {myShopData.items.map((item,index)=>(
             <OwnerItemCard data={item} key={index}/> 
            ))}
          </div>
          }


        </div>
      }

    </div>
  )
}

export default OwnerDashboard
