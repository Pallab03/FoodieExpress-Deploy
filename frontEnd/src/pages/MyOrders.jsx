import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import UserOrderCard from '../components/userOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { setMyorders, updateRealTimeOrderStatus } from '../redux/userSlice';

function MyOrders() {
  const { userData, myOrders, socket } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (socket) {
      socket?.on('newOrder', (data) => {

        if (data.shopOrders.owner._id == userData.user._id) {
          // console.log(data)
          dispatch(setMyorders([data, ...myOrders]))

        }

      })

      socket?.on('update-status',({orderId,shopId,status,userId})=>{
        if(userId==userData.user._id){
          dispatch(updateRealTimeOrderStatus({orderId,shopId,status}))
        }
      })

      return () => {
        socket?.off('newOrder')
        socket?.off('update-status')
      }

    }
  }, [socket])

  return (
    <div className='w-full min-h-screen bg-[#fafff6] flex justify-center px-4 '>
      <div className="w-full max-w-[800px] p-4">

        <div className="flex items-center mb-6 gap-[20px] ">
          <div className=" z-[10] cursor-pointer"
            onClick={() => navigate('/home')}>
            <IoIosArrowRoundBack size={40} className='text-[#28A853]' />
          </div>
          <h1 className='text-2xl text-start font-bold'>Your Orders</h1>

        </div>

        <div className="space-y-6">
          {myOrders.map((order, index) => (
            userData.user.role == "user" ?
              (
                <UserOrderCard data={order} key={index} />
              ) : userData.user.role == "owner" ?
                (
                  <OwnerOrderCard data={order} key={index} />
                ) :
                null

          ))}

        </div>
      </div>
    </div>
  )
}

export default MyOrders
