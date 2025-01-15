import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios"
const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    console.log("e=====",e)
 
     if (e) {
      setInput({ ...input, gender: e });
    }
  };
  const fileHandler = (e) => {
    console.log("e=====",e)
    const file = e?.target?.files?.[0] || null;
    console.log("file=====",file)
    if (file) {
      setInput({ ...input, profilePhoto: file });
    }
  };
console.log("input=====",input)
console.log("user====",user)
  const onSubmit = async () => {
    const formData = new FormData();
    console.log("input======",input)
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input?.profilePhoto) {
      formData.append("profilePicture", input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("res==",res)
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user.bio,
          profilePicture: res.data.user.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message)
      }
    } catch (e) {
      console.log(e);
      toast.error(e.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col w-full gap-6 my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={user?.profilePicture || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="">
              <h1 className="text-sm font-bold">
                {user?.username || "Username"}
              </h1>
              <span className="text-gray-600 ">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            // accept=".jpeg"
            type="file"
            onChange={fileHandler}
            className="hidden"
          />
          <Button
            className="bg-[#0095F6] h-8 hover:bg-[#318bc7]"
            onClick={() => imageRef?.current.click()}
          >
            Change Photo
          </Button>
        </div>
        <div className="">
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div className="">
          <h1 className="font-semibold text-sm mb-2">Gender</h1>
          <Select onValueChange={onChangeHandler}>
            <SelectTrigger className="w-[180px]">
              <SelectValue value={input?.gender} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <Button
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
              disabled={loading}
            >
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
              onClick={onSubmit}
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
