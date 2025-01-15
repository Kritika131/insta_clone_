import { setSuggestedUsers, setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  console.log("userId==",userId)
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchGetUserProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (response.data.success) {
          console.log("response========", response);
          dispatch(setUserProfile(response.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchGetUserProfile();
  }, [userId]);
};

export default useGetUserProfile;
