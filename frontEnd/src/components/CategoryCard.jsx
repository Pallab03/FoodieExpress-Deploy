import React from 'react'

function CategoryCard({ name,image,onClick }) {
  return (
    <div className='w-[100px] h-[100px] md:w-[160px] md:h-[160px] rounded-2xl border-2
    border-[#28A853] overflow-hidden shrink-0 bg-white shadow-xl shadow-gray-200 
    hover:shadow-2xl transition-shadow cursor-pointer relative' onClick={onClick}>
      <img className=' w-full h-full object-cover transform hover:scale-110 transition-transform duration-200' 
      src={image} alt={name} />
      <div className="absolute bottom-0 w-full left-0 bg-[#ffffff96] bg-opacity-95
      px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium backdrop-blur text-gray-800 truncate">{name}</div>
    
    </div>
  )
}

export default CategoryCard
