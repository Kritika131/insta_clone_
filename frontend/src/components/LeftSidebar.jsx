import axios from "axios";
import {
  Heart,
  Home,
  Loader2,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState,useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ImagePlus, MapPin, ChevronDown, Smile, Users, X } from "lucide-react";
import { readFileAsDataUrl } from "@/utils/readFileAsDataUrl";
import { setPosts } from "@/redux/postSlice";

const LeftSidebar = () => {
  
  const navigate = useNavigate();
  const {user} = useSelector(store=>store.auth)
  const dispatch = useDispatch()
  const [open,setOpen] = useState(false)
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
        dispatch(setAuthUser(null))
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
    else if(text==="Create"){
      setOpen(true)


    } else if(text==="Profile"){
      navigate(`/profile/${user?._id}`)
    } else if(text==="Home"){
      navigate("/")
    }

  }
  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div className="">
          {sidebarItems?.map((item, i) => (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={i}
              className="flex items-center gap-4 relative hover:bg-gray-100 curser-pointer rounded-lg p-3 m-3"
            >
              {item.icon}
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <CreatePost open={open} setOpen={setOpen} />
      {/* <CreatePostDialog2 open={open} setOpen={setOpen}/> */}
    </div>
  );
};  

function CreatePost({open,setOpen}){
  const {user} = useSelector(store=>store.auth);
  const dispatch = useDispatch()

  const [file,setFile] = useState("")
  const [caption,setCaption] = useState("")
  const [preview,setPreview] = useState("")
  const [loading,setLoading] = useState(false)
  const {posts} = useSelector(store=>store.post)

  const imageRef = useRef();
  const createPostHandler=async(e)=>{
    e.preventDefault()
    
    setLoading(true)
    try{

      const formData = new FormData()
      formData.append("caption",caption)
      if(preview) formData.append("image",file)
      
          const res = await axios.post("http://localhost:8080/api/v1/post/addpost",formData,{
            headers:{
              'Content-Type':"multipart/form-data"
            },
            withCredentials:true
          })
          if(res.data.success){
            dispatch(setPosts([res.data.post,...posts]))
            
            toast.success(res.data.message)
            setOpen(false)
            setCaption("")
            setFile("")
            setPreview("")
          }

    }catch(e){
      console.log("error======",e)
      toast.error(e.response.data.message)
    } finally{
      setLoading(false)
    }
  }

  

  const fileChangeHandler=async(e)=>{
    const file = e?.target?.files[0] || null
    if(file){
      setFile(file)
      const dataUri = await readFileAsDataUrl(file)
      console.log("datauir--------",dataUri)
      // setPreview(dataUrl)

      const dataUrl = URL.createObjectURL(file)
      setPreview(dataUri);
      // setPreview(dataUrl)

      console.log("dataUrl====",dataUrl)
      
    }
  }
 return (
   <Dialog open={open}>
     <DialogContent onInteractOutside={() => setOpen(false)}>
       <DialogHeader className="text-center font-semibold ">
         Create New Post
       </DialogHeader>
       <div className="flex gap-3 items-center">
         <Avatar>
           <AvatarImage src={user?.profilePicture || ""} alt="img" />
           <AvatarFallback>UN</AvatarFallback>
         </Avatar>
         <div>
           <h1 className="font-semibold text-sm">{user?.username || "usernmae"}</h1>
           <span className="text-gray-600 text-sm">Bio here...</span>
         </div>
       </div>
       <Textarea
         placeholder="Write a caption..."
         value={caption}
         onChange={(e)=>setCaption(e.target.value)}
         className="resize-none focus-visible:ring-transparent  text-sm h-24 "
       />
       {preview && (
         <div className="w-full h-64 flex justify-center items-center">
           <img
             src={preview}
             alt="preview"
             className="w-full h-full rounded-md object-cover"
           />
         </div>
       )}
       <input
         ref={imageRef}
         type="file"
         className="hidden"
         onChange={fileChangeHandler}
       />
       <Button
         onClick={() => imageRef.current.click()}
         className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
       >
         Select from computer
       </Button>
       {preview && (
           loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
              Please wait...
            </Button>
           ) : (
              <Button type="submit" className="w-full" onClick={createPostHandler}>Post</Button>
           )
       )}
       {/* <Button>Post</Button> */}
     </DialogContent>
   </Dialog>
 );
}

function CreatePostDialog ({open,setOpen}) {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log({ image, caption });
    // Add your submit logic here
  };

  return (
    <Dialog open={open}>
      {/* <DialogTrigger asChild>
        <button className="btn-primary">Create New Post</button>
      </DialogTrigger> */}
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-xl p-6 rounded-md shadow-lg"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create New Post
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Caption</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
              className="mt-1 block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <button
            className="btn-secondary mr-2"
            onClick={() => (setImage(null), setCaption(""))}
          >
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
            Post
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

function CreatePostDialog2({open,setOpen}){
    const [caption, setCaption] = useState("");
    const [location, setLocation] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [hideStats, setHideStats] = useState(false);
    const [disableComments, setDisableComments] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const file = e.dataTransfer.files[0];
      handleImageUpload(file);
    }, []);

    const handleImageUpload = (file) => {
      if (file && file.type.startsWith("image/")) {
        setImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      }
    };

    const handleFileInput = (e) => {
      const file = e.target.files[0];
      handleImageUpload(file);
    };

    const removeImage = () => {
      setImage(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl("");
      }
    };

    const handleSubmit = async () => {
      if (!image || !caption) return;

      setIsSubmitting(true);
      try {
        // Here you would typically:
        // 1. Upload the image to your server/storage
        // 2. Create the post with caption, location, and settings
        // 3. Handle the response

        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulated API call

        // Reset form
        setCaption("");
        setLocation("");
        setImage(null);
        setPreviewUrl("");
        setHideStats(false);
        setDisableComments(false);
        setOpen(false);
      } catch (error) {
        console.error("Error creating post:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          className="sm:max-w-[500px] p-0 gap-0"
        >
          <DialogHeader>
            <DialogTitle className="text-center py-4 font-semibold text-lg">
              Create new post
            </DialogTitle>
            <Separator />
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Image Upload Area */}
            {!image ? (
              <div
                className={`
                border-2 border-dashed rounded-xl h-[16.5rem]  p-12 text-center
                transition-all duration-200 ease-in-out
                ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                hover:border-gray-400 cursor-pointer
              `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input").click()}
              >
                <ImagePlus className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Drag photos and videos here
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Share your moments with your followers
                </p>
                <Input
                  id="file-input"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
                <Button
                  variant="secondary"
                  className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    document.getElementById("file-input").click();
                  }}
                >
                  Select from computer
                </Button>
              </div>
            ) : (
              <div className="relative rounded-xl h-68 overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <Button
                  variant="secondary"
                  className="absolute top-2 right-2 p-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Caption Input */}
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png"/>
                  <AvatarFallback>UN</AvatarFallback>
                </Avatar>
                {/* <img
                  src="https://github.com/shadcn.png"
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                /> */}
                <div className="flex-1 space-y-2 items-center">
                  <p className="font-semibold text-sm">username</p>
                  {/* <span className="font-gray-600 text-xs">Bio here...</span> */}
                </div>
              </div>
                  <Textarea
                    placeholder="Write a caption..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="resize-none border-none focus-visible:ring-0 p-0 text-sm h-24"
                    maxLength={2200}
                  />
            </div>

            <Separator />

            {/* Location Input */}
            {/* <div className="space-y-4">
              <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                <MapPin className="w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Add location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-none focus-visible:ring-0 p-0 text-sm"
                />
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </div>

            </div> */}

            {/* <Separator /> */}

            {/* Share Button */}
            <Button
              className="w-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
              disabled={!image || !caption || isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Sharing..." : "Share"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
};


export default LeftSidebar;
