import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const protectedRoutes = ({children}) => {
    const {user} = useSelector(store=>store.auth)
    const navigate = useNavigate()
    useEffect(()=>{
        if(!user){
            navigate('/auth')
        }

    },[])
  return (
    <>
    {children}
      
    </>
  )
}

export default protectedRoutes
