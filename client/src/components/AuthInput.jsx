import React from 'react'

function AuthInput({...props}) {
  return (
    <div className='py-2'>
        <input
            {...props}
            className="text-[#85ACEF] block w-full rounded-xl p-3 bg-[#1E1E1E] border-2  border-blue-950"
        />
    </div>
  )
}

export default AuthInput