import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const requestPayout = async (amount, narration) => {
  try {
    const token = localStorage.getItem("token");
    if (!token)
      if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }

    const res = await axios.post(
      `${backendUrl}/vendor/request-payout`,
      { amount, narration },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;

  } catch (error) {
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};


export const getTransactions = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }

    const res = await axios.get(`${backendUrl}/vendor/transactions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: res.data, // ensures res.data.transactions is accessible
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};



export const getTransactionById = async (id) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/transaction/${id}`  , {
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