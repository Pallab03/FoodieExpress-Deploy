import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setMyorders } from '../redux/userSlice'


const getMyOrders = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)
    useEffect(() => {
        const fetchOrders = async () => {

            try {
                const result = await axios.get(`${serverUrl}/api/order/my-orders`,
                    { withCredentials: true })
                console.log(result.data)
                dispatch(setMyorders(result.data))


            } catch (error) {
                console.log(error)
            }

        }

        fetchOrders();
    }, [userData])

}

export default getMyOrders
