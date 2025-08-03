import api from "../configs/api";

const getCategories = () => api.get("category");
const createCategory = (data) => api.post("category" , data);
const deleteCategory = (id) => api.delete(`category/${id}`);
const deleteProduct = (id) => api.delete(`products/remove/${id}`);
const deleteMultipleProducts = async (productIds) => {
  // If bulk delete API doesn't exist, delete products one by one
  try {
    const promises = productIds.map(id => deleteProduct(id));
    await Promise.all(promises);
    return { success: true };
  } catch (error) {
    throw error;
  }
};

export { getCategories , createCategory  , deleteCategory , deleteProduct , deleteMultipleProducts };
