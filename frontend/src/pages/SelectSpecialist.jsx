import React from 'react'
import specialists from '../components/SpecialistList'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const SelectSpecialist = () => {
  const {setSpecialist}=useAuth()
  const navigate=useNavigate()
  const handleClick=(specialist)=>{
    setSpecialist(specialist)
    navigate("/health-bot")
  }
  return (
    <div className='w-screen h-[100%] border-black border-2 border-solid flex justify-center items-center' >
      <div className='flex justify-center items-center gap-16 flex-wrap p-20 w-[90%]'>
        {specialists.map((item,index)=>{
        return(
          <div className='bg-[#5CF7F8] h-72 w-1/5 border-none rounded-2xl px-3 py-1 border-l border-gray-300 box-border cursor-pointer transition-transform duration-300 hover:scale-105' 
          key={index} onClick={()=>handleClick(item.name)}>
            <h1 className='font-semibold text-gray-800 text-xl'>{item.name}</h1>
            <p className='text-white text-sm py-2'>{item.desc}</p>
            <div className='w-[100%] flex justify-center '>
              <img src={item.imgsrc} alt="image" className='h-48 w-48 ' />
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}

export default SelectSpecialist