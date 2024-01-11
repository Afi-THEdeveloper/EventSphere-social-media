import React from 'react'

function Myh1({title,...props}) {
  return (
    <h1 {...props} className='myTextColor uppercase text-2xl font-bold'>{title}</h1>
  )
}

export default Myh1 