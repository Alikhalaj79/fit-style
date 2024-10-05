import api from "../configs/api";

const getCategories = () => api.get("category");
const createCategory = (data) => api.post("category" , data);

export { getCategories , createCategory };
