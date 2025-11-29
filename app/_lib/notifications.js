import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const getNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/notification/all`, {
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

export const getNotificationDetails = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/notification/${id}`, {
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


export const readNotification = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.put(`${backendUrl}/notification/read/${id}`, {}, {
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


export const deleteNotification = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.delete(`${backendUrl}/notification/delete/${id}`, {
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