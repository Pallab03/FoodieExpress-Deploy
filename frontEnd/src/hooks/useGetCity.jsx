import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import {  setCurrentAddress, setCurrentCity, setCurrentState } from '../redux/userSlice'
import { setAddress, setLocation } from '../redux/mapSlice'


const useGetCity = () => {
    const dispatch = useDispatch()
    const {userData}= useSelector(state=>state.user)
    const apikey = import.meta.env.VITE_GEOAPI_KEY
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (position) => {
            // console.log(position)
            const latitued = position.coords.latitude
            const longitude = position.coords.longitude
            dispatch(setLocation({lat:latitued,lon:longitude}))
            const result =  await axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitued}&lon=${longitude}&format=json&apiKey=${apikey}`)
            // console.log(result.data)
            dispatch(setCurrentCity(result?.data?.results[0].city))
            dispatch(setCurrentState(result?.data?.results[0].state))
            dispatch(setCurrentAddress(result?.data?.results[0].address_line2||result?.data?.results[0].address_line1))
            // console.log(result?.data?.results[0])
            dispatch(setAddress (result?.data?.results[0].address_line2))
        })


    }, [userData])


}

export default useGetCity
