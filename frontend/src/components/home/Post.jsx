import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "../ui/badge";
const Post = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      console.log("inputText===",inputText)
      setText(inputText);
    } else {
      setText("");
    }
  };
console.log("text======",text)
  const [isOpen, setIsOpen] = useState(false);
  const [postLiked, setPostLiked] = useState(post?.likes?.length || 0);
  const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
  const [comment, setComment] = useState(post?.comments);
  const dispatch = useDispatch();

  const deletePost = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts?.filter((item) => item?._id !== post?._id);
        dispatch(setPosts(updatedPosts));

        toast.success(res.data.message);
      }
    } catch (e) {
      toast.error(e.response.data.message);
      console.log(e);
    }
  };

  const handleLikeDislike = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8080/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLiked - 1 : postLiked + 1;

        setPostLiked(updatedLikes);

        setLiked(!liked);

        const updatedPostsData = posts?.map((item) =>
          item?._id === post._id
            ? {
                ...item,
                likes: liked
                  ? item.filter((id) => id !== user._id)
                  : [...item.likes, user._id],
              }
            : item
        );
        dispatch(setPosts(updatedPostsData));

        toast.success(res.data.success);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostsData = posts?.map((item) =>
          item?._id === post._id
            ? { ...item, comments: updatedCommentData }
            : item
        );
        dispatch(setPosts(updatedPostsData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 ">
          <Avatar className="w-6 h-6">
            <AvatarImage
              src={
                post?.auther?.profilePicture || "https://github.com/shadcn.png"
              }
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
          <h1 className="text-sm">{post?.author?.username || "Username"}</h1>
           {user?._id === post?.author?._id &&  <Badge variant="secondary">Author</Badge> }

          </div>
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
            {user && user?._id === post?.author?._id && (
              <Button
                onClick={deletePost}
                variant="ghost"
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        src={post?.image || "https://github.com/shadcn.png"}
        alt=""
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />
      <div className="flex items-center justify-between my-2">
        <div className=" flex  items-center gap-3">
          {liked ? (
            <FaHeart
              size={"22px"}
              onClick={handleLikeDislike}
              className="cursor-pointer text-red-500 hover:text-red-600"
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              onClick={handleLikeDislike}
              className="cursor-pointer hover:text-gray-600"
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setIsOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2"> {postLiked}k likes</span>
      <p className="">
        <span className="font-medium mr-2">
          {post?.author?.username || "username"}
        </span>
        {post?.caption || "caption here"}
      </p>
      {comment?.length > 0 && (
        <span
          className="cursor-pointer text-sm text-gray-400"
          onClick={() => {
            dispatch(setSelectedPost(post));
            setIsOpen(true);
          }}
        >
          View all {comment?.length || 0} comments
        </span>
      )}
      <CommentDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            className="text-[#38ADF8] cursor-pointer"
            onClick={commentHandler}
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
};

function CommentDialog({ isOpen, setIsOpen }) {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState(selectedPost?.comments || []);
  useEffect(()=>{
    if(selectedPost){
      setComment(selectedPost?.comments)
    }
  },[selectedPost])

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  // const sendMessageHandler = async () => {
  //   try {
  //     commentHandler(selectedPost?._id, text);
  //   } catch (e) {
  //     console.log(e.response.data.message);
  //   }
  // };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/v1/post/${selectedPost._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostsData = posts?.map((item) =>
          item?._id === selectedPost._id
            ? { ...item, comments: updatedCommentData }
            : item
        );
        dispatch(setPosts(updatedPostsData));
        setText("");
        setIsOpen(false)
        toast.success(res.data.message);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };
  return (
    <Dialog open={isOpen} onInteractOutside={() => setIsOpen(false)}>
      <DialogContent className="max-w-5xl p-0 flex flex-col">
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              src={selectedPost?.image || null}
              alt=""
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between ">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {" "}
                    {selectedPost?.username}
                  </Link>
                  {/* <span className="text-gray-600 text-sm">Bio here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className=" flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full  text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full ">Add to favorites</div>
                  {/* <Button variant="ghost" className="cursor-pointer w-fit ">
                      Add to favorites
                    </Button>
                    <Button variant="ghost" className="cursor-pointer w-fit ">
                      Delete
                    </Button> */}
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment?.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
              comments here
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment... "
                  className="w-full outline-none border border-gray-300 text-sm p-2 rounded"
                />
                <Button
                  disabled={!text.trim()}
                  variant="outline"
                  onClick={commentHandler}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Comment({ comment }) {
  return (
    <div className="my-2 flex gap-2 items-center">
      <Avatar>
        <AvatarImage src={comment?.author?.profilePicture} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <h1 className="font-bold text-sm">
        {comment?.author?.username}{" "}
        <span className="font-normal pl-1">{comment?.text}</span>
      </h1>
    </div>
  );
}
export default Post;
