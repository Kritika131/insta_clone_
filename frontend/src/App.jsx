import { useState } from 'react'
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

function App() {
  const [count, setCount] = useState(0)

  const browserRouter = createBrowserRouter([
    {
      path:"/",
      element:<MainLayout/>,
      children:[
        {
          path:"/",
          element:<Home/>
        },
        {
          path:"/profile/:id",
          element:<Profile/>
        },
        {
          path:"/account/edit",
          element:<EditProfile/>
        },
        {
          path:"/chat",
          element:<ChatPage/>
        }
      ]
    },
    {
      path:'/auth',
      element:<AuthPages/>
    }
  ])

  return (
    <>
   <RouterProvider router={browserRouter}/>
      </>
  )
}

export default App
