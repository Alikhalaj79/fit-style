import api from "../configs/api";

const getProducts = () => api.get("products/all");

const baseURL = import.meta.env.VITE_BASE_URL;
const getImageUrl = (relativePath) => {
  if (!relativePath) return null;

  if (Array.isArray(relativePath)) {
    return relativePath.map((path) => {
      if (!path) return null;
      if (path.startsWith("http")) return path;

      const formattedPath = path
        .replace(/\\/g, "/")
        .replace(/^.*[\\\/]upload[\\\/]/, "upload/")
        .replace(/^upload\//, "upload/");
      return `${baseURL}${formattedPath}`;
    });
  } else if (typeof relativePath === "string") {
    if (relativePath.startsWith("http")) return relativePath;

    const formattedPath = relativePath
      .replace(/\\/g, "/")
      .replace(/^.*[\\\/]upload[\\\/]/, "upload/")
      .replace(/^upload\//, "upload/");
    return `${baseURL}${formattedPath}`;
  }

  return null;
};

const convertPriceToPersian = (price) => {
  const englishNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

  if (price == null) {
    return "۰";
  }

  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedPrice.replace(
    /[0-9]/g,
    (digit) => persianNumbers[englishNumbers.indexOf(digit)]
  );
};

/**
 * Sends a PATCH request to update a product.
 * @param {string} id - The ID of the product to edit.
 * @param {object} updatedProduct - The product data to update.
 * @returns {Promise} - The axios response promise.
 */
const editProduct = async (id, updatedProduct) => {
  try {
    const response = await api.patch(`products/edit/${id}`, updatedProduct);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a single product by its ID.
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise} - The axios response promise containing the product data.
 */
const fetchProductById = async (id) => {
  try {
    const response = await api.get(`products/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches all categories from the API.
 * @returns {Promise} - The axios response promise containing the categories data.
 */
const fetchCategories = async () => {
  try {
    const response = await api.get("categories");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  getProducts,
  getImageUrl,
  convertPriceToPersian,
  editProduct,
  fetchProductById,
  fetchCategories,
};
