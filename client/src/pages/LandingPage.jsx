import React from 'react'
import Button1 from '../components/Button1'
import Myh1 from '../components/Myh1'
import { useNavigate } from 'react-router-dom'
import { ServerVariables } from '../utils/ServerVariables'

function LandingPage() {
  const navigate = useNavigate()
  return (
  <div className='min-h-screen flex items-stretch'>
    <div className='flex-1 hidden md:block' style={{backgroundImage:'url("/images/Es.png")', backgroundSize:'cover', backgroundPosition:'center center', backgroundRepeat:'no-repeat'}}/>
    <div className='flex-1 flex flex-col items-center justify-center bg-black'>
        <div className='flex flex-col max-w-[400px] items-center space-y-3'>
             <Myh1 title='Who are you ?'/>
             <Button1 text='User' onClick={()=> navigate(ServerVariables.Login)}  />
             <Button1 text='Event Manager' onClick={()=> navigate(ServerVariables.eventLogin)} />
        </div>
    </div>
  </div>
  )
}

export default LandingPage 