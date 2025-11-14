import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setshopsInMyCity } from '../redux/userSlice'


const getShopByCity = () => {
        const dispatch = useDispatch()
        const{currentCity}= useSelector(state=>state.user)
    useEffect(() => {
        const fetchShops = async () => {

            try {
                const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${currentCity}`,
                    { withCredentials: true })
                dispatch(setshopsInMyCity(result.data))
                console.log(result.data)


            } catch (error) {
                console.log(error)
            }

        }

        fetchShops();
    }, [currentCity])

}

export default getShopByCity    
