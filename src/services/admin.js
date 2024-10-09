import api from "../configs/api";

const getCategories = () => api.get("category");
const createCategory = (data) => api.post("category" , data);
const deleteCategory = (id) => api.delete(`category/${id}`);

export { getCategories , createCategory  , deleteCategory};
