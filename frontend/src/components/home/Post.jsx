import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import {
  Bookmark,
  BookMarked,
  MessageCircle,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "../ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
const Post = () => {
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Avatar className="w-6 h-6">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1 className="text-sm">Username</h1>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
            {/* <Button variant="outline">Edit Profile</Button> */}
          </DialogTrigger>
          <DialogContent className=" flex flex-col items-center text-sm text-center">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        src="https://github.com/shadcn.png"
        alt=""
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />
      <div className="flex items-center justify-between my-2">
        <div className=" flex  items-center gap-3">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <MessageCircle
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">1k likes</span>
      <p className="">
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span
        className="cursor-pointer text-sm text-gray-400"
        onClick={() => setIsOpen(true)}
      >
        View all 10 comments
      </span>
      <CommentDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={(e) => changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && <span className="text-[#38ADF8">Post</span>}
      </div>
    </div>
  );
};

function CommentDialog({ isOpen, setIsOpen }) {
  const [text,setText] = useState("")

  const changeEventHandler=(e)=>{
    const inputText = e.target.value;
    if(inputText.trim()){
      setText(inputText)
    }else{
      setText("")
    }
  }

  const sendMessageHandler =async()=>{
    try{ 
      alert(text)

    }catch(e){
      console.log(e.response.data.message)
    }
  }
  return (
    <Dialog open={isOpen} onInteractOutside={() => setIsOpen(false)}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src="https://github.com/shadcn.png"
              alt=""
              className="w-full h-full object-cover rounded-l-lg"
              />
              </div>
            <div className="w-1/2 flex flex-col justify-between ">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs"> username</Link>
                    {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className=" flex flex-col items-center text-sm text-center">

                    
                    <div
                      className="cursor-pointer w-full  text-[#ED4956] font-bold"
                    >
                      Unfollow
                    </div>
                    <div  className="cursor-pointer w-full ">
                      Add to favorites
                    </div>
                    {/* <Button variant="ghost" className="cursor-pointer w-fit ">
                      Add to favorites
                    </Button>
                    <Button variant="ghost" className="cursor-pointer w-fit ">
                      Delete
                    </Button> */}
                  </DialogContent>
                </Dialog>
              </div>
              <hr/>
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                comments here
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input type="text" value={text} onChange={changeEventHandler} placeholder="Add a comment... " className = 'w-full outline-none border border-gray-300 p-2 rounded'/>
                  <Button disabled={!text.trim()} variant="outline" onClick={sendMessageHandler}>Send</Button>
                </div>
              </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Post;
