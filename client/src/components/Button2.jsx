import React from 'react'

function Button2({text,...props}) {
  return (
    <button {...props} type='button' className="text-[0.5rem] sm:text-sm rounded-md bg-[#969696] p-2 font-semibold text-white shadow-sm hover:bg-[#0f1015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {text}
    </button>
  )
}

export default Button2