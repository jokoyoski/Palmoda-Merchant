import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const vendorSignUp = async (
  business_name,
  first_name,
  last_name,
  email,
  phone_number,
  password,
  confirm_password
) => {
  try {
    const contact_person_name = `${first_name} ${last_name}`.trim();
    const res = await axios.post(`${backendUrl}/user/register-vendor`, {
      business_name,
      first_name,
      last_name,
      contact_person_name,
      email,
      phone_number,
      password,
      confirm_password,
      first_name,
      last_name,
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
    const res = await axios.post(
      `${backendUrl}/user/login`,
      { email, password },
      {
        params: {
          user_type: "vendor",
        },
      }
    );
    return res.data;
  } catch (error) {
    const msg =
      error.response?.data?.message || error.message || "Something went wrong";

    throw new Error(msg);
  }
};

export const validateVendorCode = async (email, code) => {
  try {
    const res = await axios.put(
      `${backendUrl}/user/validate_code/${email}`,
      { code },
      {
        params: { user_type: "vendor" },
      }
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
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
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }

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

export const updateKyc = async (
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
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null,
      };
    }

    const res = await axios.put(
      `${backendUrl}/vendor/update-kyc`,
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

export const getKycDetails = async (params) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }
    const res = await axios.get(`${backendUrl}/vendor/get-kyc-information`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};

export const fetchAnalytics = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }
    const res = await axios.get(`${backendUrl}/order/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};

export const getOrders = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }
    const res = await axios.get(`${backendUrl}/vendor/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};

export const getOrderDetails = async (id) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }
    const res = await axios.get(`${backendUrl}/vendor/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};

export const activateWallet = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }
    const res = await axios.post(
      `${backendUrl}/vendor/activate-wallet`,
      {},
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const getWallet = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
        data: null, // always include data field
      };
    }
    const res = await axios.get(`${backendUrl}/vendor/wallet`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
};

export const fetchBanks = async (options) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No token found", data: null };
    }

    const { search = "", page_number = 1, page_size = 100 } =
      typeof options === "string" ? { search: options } : options || {};

    const res = await axios.get(`${backendUrl}/user/banks`, {
      // <-- notice the added slash
      params: { search, page_number, page_size },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = res.data;

    const mapBank = (b) => {
      const id = b?._id ?? b?.id ?? b?.code;
      const name = b?.bank_name ?? b?.name;
      const code = b?.bank_code ?? b?.code;

      return {
        _id: id != null ? String(id) : "",
        bank_name: name != null ? String(name) : "",
        bank_code: code != null ? String(code) : "",
      };
    };

    let banks;

    if (Array.isArray(payload?.data)) {
      banks = payload.data.map(mapBank).filter((b) => b._id && b.bank_name);
    } else if (Array.isArray(payload?.data?.banks)) {
      banks = payload.data.banks.map(mapBank).filter((b) => b._id && b.bank_name);
    } else if (Array.isArray(payload?.banks)) {
      banks = payload.banks.map(mapBank).filter((b) => b._id && b.bank_name);
    } else {
      banks = [];
    }

    const normalizedData =
      payload?.data && !Array.isArray(payload.data)
        ? {
            ...payload.data,
            banks,
            page_number: payload.data?.page_number ?? page_number,
            page_size: payload.data?.page_size ?? page_size,
            total_pages: payload.data?.total_pages,
            total_items: payload.data?.total_items,
            has_more: payload.data?.has_more ?? false,
          }
        : {
            banks,
            page_number,
            page_size,
            total_pages: 1,
            total_items: banks.length,
            has_more: false,
          };

    return { ...payload, data: normalizedData };
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
};

export const resolveAccount = async (account_number, bank_code) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { success: false, message: "No token found", data: null };
    }
    const res = await axios.post(
      `${backendUrl}/user/resolve-account`,
      { account_number, bank_code },
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const updatePassword = async (email, password) => {
  try {
    const res = await axios.post(
      `${backendUrl}/user/update_password/${email}`,
      { password },
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const changePassword = async (email, password, old_password) => {
  try {
    const res = await axios.post(
      `${backendUrl}/user/change_password/${email}`,
      { password, old_password },
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

    // fallback message
    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};

export const resendCode = async (email) => {
  try {
    const res = await axios.put(
      `${backendUrl}/user/resend_code/${email}`,
      {},
      {
        params: { user_type: "vendor" },
      }
    );

    return res.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const validateCode = async (email, code) => {
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
};
