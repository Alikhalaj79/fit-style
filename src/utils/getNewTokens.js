import api from "../configs/api";

let requestCounter = 0;
const maxRequest = 5;

const getNewTokens = async () => {
  if(requestCounter >= maxRequest){
    console.log("تعداد درخواست ها به حداکثر خود رسیده است");
    return;
  }
  try {
    requestCounter ++;
    const res = await api.post(
      "auth/refresh-token",
      {},
      { withCredentials: true }
    );
    requestCounter = 0;
    // console.log(res);
    return res.data; 
  } catch (error) {
     if (error.response && error.response.status === 401) {
       console.log("No refresh token found. Please log in.");
       return null; 
     }
  }
};

export{ getNewTokens}
