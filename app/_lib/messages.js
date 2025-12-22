import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const getMessages = async () => {
   try {
     const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
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

export const messageCount = async () => {
   try {
      const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return { data: { unread_count: 0 } };
    }
    const res = await axios.get(`${backendUrl}/message/unread-count`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
   } catch (error) {
      if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    }
   } 
}

export const readMessage = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/message/read/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.data
    } catch (error) {
        if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    }
    }
}