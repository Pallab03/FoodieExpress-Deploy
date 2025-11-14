import React, { useEffect, useRef, useState } from 'react'

import { useSelector } from 'react-redux';
import Nav from './nav';
import { categories } from '../category';
import CategoryCard from './CategoryCard';
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router';

function UserDashBoard() {


  const { itemsInMyCity, shopsInMyCity, currentCity,searchItems } = useSelector(state => state.user)
  // console.log("serch Items:",searchItems)
  const catScrollRef = useRef();
  const shopScrollRef = useRef();
  const navigate=  useNavigate()

  const [showRightCateButton, setShowRightCateButton] = useState(true)
  const [showLeftCateButton, setShowLeftCateButton] = useState(false)
  const [showRightShopButton, setShowRightShopButton] = useState(true)
  const [showLeftShopButton, setShowLeftShopButton] = useState(false)
  const [updatedItemsList,setUpadtedItemsList]=useState([])

  const handleFilterByCategory = (category)=>{

    if(category == "All"){
      setUpadtedItemsList(itemsInMyCity)
    }else{
    const filteredList = itemsInMyCity.filter(i=>i.category===category)
      setUpadtedItemsList(filteredList)
    }
  }
  useEffect(()=>{
      setUpadtedItemsList(itemsInMyCity)
  },[itemsInMyCity])

  const updateButton = (ref, setLeftButton, setRightButton) => {
    const element = ref.current;
    if (element) {
      setLeftButton(element.scrollLeft > 0)
      setRightButton(element.scrollLeft + element.clientWidth + 2 < element.scrollWidth)
    }

  }
  const scrollhandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth"
      })
    }

  }

  useEffect(() => {

    if (catScrollRef.current) {
      updateButton(catScrollRef, setShowLeftCateButton, setShowRightCateButton)
      updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)


      catScrollRef.current.addEventListener('scroll', () => {
        updateButton(catScrollRef, setShowLeftCateButton, setShowRightCateButton)
      })
      shopScrollRef.current.addEventListener('scroll', () => {
        updateButton(shopScrollRef, setShowLeftShopButton, setShowRightShopButton)
      })
    }
  }, [categories, shopsInMyCity]);
  // console.log(categories)
  return (


    <div className="w-screen min-h-screen bg-[#fafff6] flex flex-col gap-5 items-center overflow-Y-auto">
      <Nav />

      {searchItems && searchItems.length>0 && (
        <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md
        rounded-xl mt-4">
          <h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200  pb-2'>
            Search Results</h1>
            <div className="w-full h-auto flex flex-wrap gap-6 justify-center">
              {searchItems.map((item)=>(
                <FoodCard data={item} key={item._id}/>
              ))}
            </div>
        </div>
      )}

      {/* categories */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-2xl sm:text-3xl text-gray-700'>Inspiration for your first oreder</h1>
        <div className="w-full relative">
          {showLeftCateButton && <button className='absolute -left-5 top-1/2 -translate-y-1/2 bg-[#28A853] text-white 
          p-2 rounded-full shadow-lg hover:bg-[#1f7e3f] z-10 cursor-pointer'
            onClick={() => scrollhandler(catScrollRef, "left")}>
            <FaChevronCircleLeft size={20} />
          </button>}

          <div className="w-full overflow-x-auto flex gap-4 pb-2 " ref={catScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index}
               onClick={()=>handleFilterByCategory(cate.category)} />
            ))}
          </div>

          {showRightCateButton && <button className='absolute -right-5 top-1/2 -translate-y-1/2 bg-[#28A853] text-white 
          p-2 rounded-full shadow-lg hover:bg-[#1f7e3f] z-10 cursor-pointer'
            onClick={() => scrollhandler(catScrollRef, "right")}>
            <FaChevronCircleRight size={20} />
          </button>}


        </div>
      </div>

      {/* Shops */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-2xl sm:text-3xl text-gray-700'>Best Shop in {currentCity}</h1>
        <div className="w-full relative">
          {showLeftShopButton && <button className='absolute -left-5 top-1/2 -translate-y-1/2 bg-[#28A853] text-white 
          p-2 rounded-full shadow-lg hover:bg-[#1f7e3f] z-10 cursor-pointer'
            onClick={() => scrollhandler(shopScrollRef, "left")}>
            <FaChevronCircleLeft size={20} />
          </button>}

          <div className="w-full overflow-x-auto flex gap-4 pb-2 " ref={shopScrollRef}>
            {shopsInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} 
              onClick={()=>navigate(`/shop/${shop._id}`)} />
            ))}
          </div>

          {showRightShopButton && <button className='absolute -right-5 top-1/2 -translate-y-1/2 bg-[#28A853] text-white 
          p-2 rounded-full shadow-lg hover:bg-[#1f7e3f] z-10 cursor-pointer'
            onClick={() => scrollhandler(shopScrollRef, "right")}>
            <FaChevronCircleRight size={20} />
          </button>}


        </div>
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className='text-2xl sm:text-3xl text-gray-700'>Suggested Food Items</h1>
        <div className="w-full h-auto justify-center flex flex-wrap gap-[20px]">
          {updatedItemsList?.map((item, index) => (
            <FoodCard key={index} data={item} />
          ))}
        </div>
      </div>
    </div>
  )

}

export default UserDashBoard
