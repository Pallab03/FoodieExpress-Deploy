import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import getCurrentUser from './hooks/getCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import getMyShop from './hooks/getMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import getShopByCity from './hooks/getShopByCity'
import getItemsByCity from './hooks/getItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import getMyOrders from './hooks/getMyOrders'
import updateLocation from './hooks/udateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice'
import EditUpdateProfile from './pages/EditUpdateProfile'
import LandingPage from './pages/LandingPage'
export const serverUrl = 'http://localhost:3000'
const App = () => {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()
  getCurrentUser()
  updateLocation()
  useGetCity()
  getMyShop()
  getShopByCity()
  getItemsByCity()
  getMyOrders()

  useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true })
    dispatch(setSocket(socketInstance))
    socketInstance.on('connect', () => {
      if (userData) {
        socketInstance.emit('identity', { userId: userData.user._id })
      }
    })

    return ()=>{
      socketInstance.disconnect()
    }
  }, [userData?.user?._id])

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />

      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={'/home'} />} />

      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to={'/home'} />} />

      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to={'/home'} />} />

      <Route path='/home' element={userData ? <Home /> : <Navigate to={'/signin'} />} />

      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to={'/signin'} />} />

      <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to={'/signin'} />} />

      <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to={'/signin'} />} />

      <Route path='/cart' element={userData ? <CartPage /> : <Navigate to={'/signin'} />} />

      <Route path='/checkout' element={userData ? <CheckOut /> : <Navigate to={'/signin'} />} />

      <Route path='/order-placed' element={userData ? <OrderPlaced /> : <Navigate to={'/signin'} />} />

      <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to={'/signin'} />} />

      <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to={'/signin'} />} />

      <Route path='/shop/:shopId' element={userData ? <Shop /> : <Navigate to={'/signin'} />} />

      <Route path='/edit-update-profile' element={userData ? <EditUpdateProfile /> : <Navigate to={'/signin'} />} />

    </Routes>
  )
}

export default App
