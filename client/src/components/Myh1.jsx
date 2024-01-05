import React from 'react'

function Myh1({title,...props}) {
  return (
    <h1 {...props} className='uppercase text-2xl font-bold text-[#FFB992]'>{title}</h1>
  )
}

export default Myh1 