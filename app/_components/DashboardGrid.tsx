import React from 'react'
import { FaShirt } from "react-icons/fa6";

function DashboardGrid() {
    const array = [
        {
            text: "Total Products",
            keyword: "128",
            percentage: "12%",
            icon: <FaShirt color='black' size={20}/>
        },
        {
            text: "Total Products",
            keyword: "128",
            percentage: "12%",
            icon: <FaShirt color='black' size={20}/>
        },
        {
            text: "Total Products",
            keyword: "128",
            percentage: "12%",
            icon: <FaShirt color='black' size={20}/>
        }, {
            text: "Total Products",
            keyword: "128",
            percentage: "12%",
            icon: <FaShirt color='black' size={20}/>
        }

    ]
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4'>
      {array.map((item, index) => (
        <div key={index} className='bg-white py-2 px-4 border border-gray-200'>
           <div className='flex justify-between items-center'>
            <p className='text-gray-500 text-xs'>{item?.text}</p>
            {item?.icon}
           </div>
           <h3 className='text-lg font-semibold text-black'>{item?.keyword}</h3>
           <p className='text-green-500 font-semibold text-xs'>{item?.percentage}</p>
        </div>
      ))}
    </div>
  )
}

export default DashboardGrid
