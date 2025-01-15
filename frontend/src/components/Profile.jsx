import useGetUserProfile from "@/hooks/useGetUserProfile";
import React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { Badge } from "./ui/badge";

const Profile = () => {
  const params = useParams();
  const [activeTab, setActiveTab] = React.useState("posts");
  
  console.log("params", params);
  useGetUserProfile(params.id);
  const { userProfile,user } = useSelector((store) => store.auth);
  console.log("userProfile", userProfile);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const isLoggedInUserProfile = user?._id===userProfile?._id;
  const isFollowing = true;
  
  const displayPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="">{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                  <Link to="/account/edit">
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Edit Profile
                    </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className="h-8">
                      UnFollow
                    </Button>
                    <Button variant="secondary" className=" h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095F6] hover:bg-[#3192d2] h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div>
                <p className="">
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.posts?.length || 0}
                  </span>
                  posts
                </p>
                <p className="">
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.followers?.length || 0}
                  </span>
                  followers
                </p>
                <p className="">
                  {" "}
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.following?.length || 0}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here.."}
                </span>
                <Badge className="w-fit" variant="secondary">
                  <span className="pl-1">
                    <AtSign />
                  </span>
                  {userProfile?.username}
                </Badge>
                <span className="">😎Learn code with me </span>
                <span className="">😄Turning code with fun</span>
                <span className="">😊DM for collaboration </span>
              </div>
            </div>
          </section>
        </div>
        {/* <div className=" border-t-gray-200 grid grid-cols-3 gap-1">
          {userProfile?.posts?.map((post) => (
            <img
              key={post._id}
              src={post.imageUrl}
              alt={post.caption}
              className="w-full h-32 object-cover"
            />
          ))}
          </div> */}
        <div className="border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm ">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              } `}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span
              className="py-3 cursor-pointer "
              onClick={() => handleTabChange("")}
            >
              REELS
            </span>
            <span className="py-3 cursor-pointer ">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayPosts?.map((post) => (
              <div className="relative group cursor-pointer" key={post?._id}>
                <img
                  src={post?.image}
                  alt="post Image"
                  className="rounded-sm w-full my-2 aspect-square  object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
                  <div className="flex items-center text-white space-x-4">
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <Heart />
                      <span>{post?.likes?.length}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-gray-300">
                      <MessageCircle />
                      <span>{post?.comments?.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
