import React from 'react'

function Button2({text,...props}) {
  return (
    <button {...props} type="button" class="rounded-md bg-[#1F2937] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
        {text}
    </button>
  )
}

export default Button2