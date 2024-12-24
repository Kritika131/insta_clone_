import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";

const LeftSidebar = () => {
  
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth)
  const sidebarItems = [
    {
      icon: <Home />,
      text: "Home",
    },
    {
      icon: <Search />,
      text: "Search",
    },
    {
      icon: <TrendingUp />,
      text: "Explore",
    },
    {
      icon: <MessageCircle />,
      text: "Message",
    },
    {
      icon: <Heart />,
      text: "Notifications",
    },
    {
      icon: <PlusSquare />,
      text: "Create",
    },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage
            src={user?.profilePicture || "https://github.com/shadcn.png"}
          />
          <AvatarFallback>{user?.username?.slice(0,2)}</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    {
      icon: <LogOut />,
      text: "Logout",
    },
  ];




  
  const logout = async()=>{
    try{
       const res = await axios.get("http://localhost:8080/api/v1/user/logout",{withCredentials:true})
       if(res.data.success){
        navigate("/auth")
        toast.success(res.data.message)
       }

    }catch(e){
        console.log(e)
        toast.error(e.response.data.message)
    }
  }


  const sidebarHandler=(text)=>{
    alert(text)
    if(text==="Logout"){
        logout()
    }

  }
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
        <div className="flex flex-col">
            <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
            <div className="">

      {sidebarItems?.map((item, i) => (
        <div onClick={()=>sidebarHandler(item.text)} key={i} className="flex items-center gap-4 relative hover:bg-gray-100 curser-pointer rounded-lg p-3 m-3">
          {item.icon}
          <span>{item.text}</span>
        </div>
      ))}
        </div>
    </div>
    </div>
  );
};

export default LeftSidebar;
