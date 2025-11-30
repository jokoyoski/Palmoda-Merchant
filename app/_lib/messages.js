import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const getMessages = async () => {
   try {
     const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
      };
    }
    const res = await axios.get(`${backendUrl}/message/all`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data;
   } catch (error) {
      return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
   }   
}