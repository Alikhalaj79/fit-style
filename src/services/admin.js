import api from "../configs/api";

const getCategories = () => api.get("category");
const createCategory = (data) => api.post("category" , data);
const deleteCategory = (id) => api.delete(`category/${id}`);
const deleteProduct = (id) => api.delete(`products/remove/${id}`)

export { getCategories , createCategory  , deleteCategory , deleteProduct };
