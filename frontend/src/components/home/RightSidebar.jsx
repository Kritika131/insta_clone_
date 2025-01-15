import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RightSidebar = () => {

  const {user} = useSelector(store=>store.auth)
  return (
    <div className="w-fit my-10 pr-32  ">
      <div className="flex items-center gap-4 ">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={user?.profilePicture || "https://github.com/shadcn.png"}
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="">
          <h1 className="text-sm font-semibold">
            <Link to ={`/profile/${user._id}`}>{user?.username || "Username"}</Link>
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers/>
    </div>
  );
}


const SuggestedUsers =()=>{
  const {suggestedUsers} = useSelector(store=>store.auth)
  return (
    <div className="my-10 w-full ">
      <div className="flex items-center justify-between  text-sm">
        <h1 className="font-semibold text-sm text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers?.map((user) => (
        <div className="flex items-center justify-between my-5" key={user._id}>
          <div className="flex items-center gap-2 ">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src={user?.profilePicture || "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            <div className="">
              <h1 className="text-sm font-semibold">
                <Link to={`/profile/${user._id}`}>
                  {user?.username || "Username"}
                </Link>
              </h1>
              <span className="text-gray-600 text-sm">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#3495d6]">Follow</span>
        </div>
      ))}
    </div>
  );
}

export default RightSidebar
