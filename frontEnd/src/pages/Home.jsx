import React from 'react'
import { useSelector } from 'react-redux'
import UserDashBoard from '../components/UserDashBoard'
import OwnerDashboard from '../components/OwnerDashboard'
import DeliveryBoyDashboard from '../components/DeliveryBoyDashboard'

function Home() {
      const {userData}= useSelector(state=>state.user)
        // console.log("home=",userData)
  return (
    <div className=' w-full min-h-screen pt-[100px] flex flex-col items-center bg-[#fafff6]'>
      {userData.user.role=="user"&&<UserDashBoard/>}
      {userData.user.role=="owner"&&<OwnerDashboard/>}
      {userData.user.role=="deliveryBoy"&&<DeliveryBoyDashboard/>}
    </div>
  )
}

export default Home
