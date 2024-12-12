import { Authform } from '@/components/shared/Authform'
import React from 'react'

const page = () => {
  return (
    <div className=' w-full min-h-screen flex justify-center items-center ' >
      <Authform
      type='SignUp'
      />
    </div>
  )
}

export default page