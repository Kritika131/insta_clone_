import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/button'
import AuthPages from './components/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './components/MainLayout'
import Home from './components/home/Home'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import ChatPage from './components/ChatPage'
import {io} from "socket.io-client"
import { useDispatch, useSelector } from 'react-redux'
import { setSocket } from './redux/socketSlice'
import { setOnlineUsers } from './redux/chatSlice'
import { setLikeNotification } from './redux/rtnSlice'


  const browserRouter = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <MainLayout />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/profile/:id",
          element: (
            <ProtectedRoutes>
              <Profile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/account/edit",
          element: (
            <ProtectedRoutes>
              <EditProfile />
            </ProtectedRoutes>
          ),
        },
        {
          path: "/chat",
          element: (
            <ProtectedRoutes>
              <ChatPage />
            </ProtectedRoutes>
          ),
        },
      ],
    },
    {
      path: "/auth",
      element: <AuthPages />,
    },
  ]);
function App() {

  const dispatch = useDispatch()

  const {user} = useSelector(store=>store.auth)
  const {socket} = useSelector(store=>store.socketio)

  useEffect(()=>{

    if(user){
      const socketio = io('http://localhost:8080',{
        query:{
          userId:user?._id
        },
        transports:['websocket']
      });

      dispatch(setSocket(socketio))

      socketio.on('getOnlineUsers',(onlineUsers)=>{
        dispatch(setOnlineUsers(onlineUsers))
      });
      socketio.on('notification',(notification)=>{
        dispatch(setLikeNotification(notification))
      })

      return ()=>{
      }
      
    }else if(socket){
      
      socket?.close()
      dispatch(setSocket(null))
    }

  },[user,dispatch])

  return (
    <>
   <RouterProvider router={browserRouter}/>
      </>
  )
}

export default App
