import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "No token found" };

    const res = await axios.post(
      `${backendUrl}/vendor/add-products`,
      {
        name: productData.name,
        images: productData.images,
        cost_price: productData.cost_price,
        description: productData.description,
        genders: productData.genders,
        sizes: productData.sizes,
        look_after_me: productData.look_after_me,
        colors: productData.colors,
        fabrics: productData.fabrics,
        discounted_price: productData.discounted_price,
        countries: productData.countries,
        quantity: productData.quantity,
        sub_categories: productData.sub_categories,
        categories: productData.categories,
      },
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

export const fetchProducts = async (page_number, page_size) => {
    try {
        const token = localStorage.getItem("token");
    if (!token) return console.log("No token found");
      const res = await axios.get(`${backendUrl}/vendor/get-products`, {
        params: {page_number, page_size},
        headers:{
            Authorization: `Bearer ${token}`
        }
      })
     return  res.data;
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
}

export const updateProduct = async (productData, id) => {
   try {
      const token = localStorage.getItem("token");
    if (!token) return { success: false, message: "No token found" };
    const res = await axios.put(`${backendUrl}/vendor/update-product/${id}`, {
    name:productData.name,
    images:productData.images,
    cost_price: productData.cost_price,
    description: productData.description,
    genders: productData.genders,
    sizes: productData.sizes,
    look_after_me: productData.look_after_me,
    colors: productData.colors,
    fabrics: productData.fabrics,
    discounted_price: productData.discounted_price,
    countries: productData.countries,
        quantity: productData.quantity,
        sub_categories: productData.sub_categories,
        categories: productData.categories,
}, {
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

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
    }
   
}

