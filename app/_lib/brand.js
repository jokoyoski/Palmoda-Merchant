import axios from "axios"
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

export const setUpBrandProfile = async (
    brand_name,
    brand_description,
    brand_logo_black,
    brand_logo_white,
    brand_banner,
    instagram_handle,
    facebook_handle,
    twitter_handle,
    website_url,
    tiktok_handle,
    pinterest_handle
) => {
    try {
         const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
    const res = await axios.post(`${backendUrl}/vendor/setup-brand-profile`, {
        brand_name,
    brand_description,
    brand_logo_black,
    brand_logo_white,
    brand_banner,
    instagram_handle,
    facebook_handle,
    twitter_handle,
    website_url,
    tiktok_handle,
    pinterest_handle
    }, {
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
    };
    }
}

export const getBrandDetails = async (params) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");

    const res = await axios.get(`${backendUrl}/vendor/get-brand-profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    console.log(res.data);
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

export const updateBrandDetails = async (
  brand_name,
  brand_description,
  brand_logo_black,
  brand_logo_white,
  brand_banner,
  instagram_handle,
  facebook_handle,
  twitter_handle,
  website_url,
  tiktok_handle,
  pinterest_handle
) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        success: false,
        message: "No token found",
      };
    }
    const res = await axios.put(`${backendUrl}/vendor/update-brand-profile`, {
      brand_name,
      brand_description,
      brand_logo_black,
      brand_logo_white,
      brand_banner,
      instagram_handle,
      facebook_handle,
      twitter_handle,
      website_url,
      tiktok_handle,
      pinterest_handle
    }, {
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
    };
  }
}

