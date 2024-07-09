import React from 'react'

const Forcaste = ({title, data}) => {

  return (
   
    <div>
      <div className='flex justify-start items-center mt-6'>
        <p className='font-medium uppercase'>{title}</p>
      </div>
      <hr className='my-1' />

      <div className='flex items-center justify-between'>
      {data.map((data,index)=>(
        <div
        key={index}
        className='flex flex-col items-center justify-center'
        >
            <p>{data.title}</p>
            <img 
            src={data.icon}
             alt="Wearther icon " 
             className='w-12 my-1'
             />
             <p className='font-medium'>{`${data.temp.toFixed()}°`}</p>

        </div>
      ))}

      </div>
    </div>
  )
}

export default Forcaste
