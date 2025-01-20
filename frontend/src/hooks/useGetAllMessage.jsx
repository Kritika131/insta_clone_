import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const {selectedUser} = useSelector(store=>store.auth)
  useEffect(() => {
    const fetchAllMessage = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/message/all${selectedUser?._id}`,
          { withCredentials: true }
        );
        if (response.data.success) {
          dispatch(setMessages(response.data.message));
        //   console.log("response========", response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllMessage();
  }, [selectedUser]);
};

export default useGetAllMessage;
