import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const vendorSignUp = async (
  business_name,
  contact_person_name,
  email,
  phone_number,
  password,
  confirm_password
) => {
  try {
    const res = await axios.post(`${backendUrl}/user/register-vendor`, {
      business_name,
      contact_person_name,
      email,
      phone_number,
      password,
      confirm_password
    });
    return res.data;
  } catch (error) {
    // backend responded with a validation error
    if (error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }

    // fallback for unknown errors
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const vendorLogin = async (email, password) => {
    try {
        const res = await axios.post(`${backendUrl}/user/login`, {email, password}, {
            params: {
                user_type: "vendor"
            }
        });
        return res.data;
    } catch (error) {
      const msg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    throw new Error(msg);
    }
}

export const validateVendorCode = async (email, code) => {
  try {
    const res = await axios.put(
      `${backendUrl}/user/validate_code/${email}`,
      { code },        
      {
        params: {
          user_type: "vendor",
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

export const completeKyc = async (
  business_registration_document,
  valid_owner_id,
  bank_statement,
  business_type,
  registration_number,
  tax_identification_number,
  address_line_one,
  address_line_two,
  city,
  state,
  country,
  postal_code,
  bank_name,
  account_number,
  account_holder_name
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

    const res = await axios.post(
      `${backendUrl}/vendor/complete-kyc`,
      {
        business_registration_document,
        valid_owner_id,
        bank_statement,
        business_type,
        registration_number,
        tax_identification_number,
        address_line_one,
        address_line_two,
        city,
        state,
        country,
        postal_code,
        bank_name,
        account_number,
        account_holder_name,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.data;
  } catch (error) {
    // if backend sends a custom message
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
    };
  }
};

export const getKycDetails = async (params) => {
    try {
      const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/vendor/get-kyc-information`, {
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
    };
  }
    } 


  export  const fetchAnalytics = async () => {
         try {
            const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/order/analytics`, {
      headers:{
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
    };
  }
      }


      export const getOrders = async () => {
        try {
            const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/order/all`, {
      headers:{
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

 export const activateWallet = async (bvn) => {
    try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.post(`${backendUrl}/vendor/activate-wallet`, {bvn}, {
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


 export const getWallet = async () => {
   try {
       const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.get(`${backendUrl}/vendor/wallet`, {
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