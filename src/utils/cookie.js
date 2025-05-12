// const expire = token =>  {
//     const expirationDate = new Date(token).toString();
//     return expirationDate;
// }

// const setCookie = tokens =>{
//     document.cookie = `refreshToken=${tokens.refreshToken}; max-age=${30 * 24 * 60 * 60}`;
// }

//  const getCookie = (cookieName) => {
//     return document.cookie
//     .split(";")
//     .find((token) => token.trim().split("=")[0] === cookieName)
//     ?.split("=")[0]
// }



// export { getCookie}

// const getCookie = (name) => {
//   const cookieString = document.cookie;
//   const cookies = cookieString.split("; ");

//   for (let cookie of cookies) {
//     const [cookieName, cookieValue] = cookie.split("=");
//     if (cookieName === name) {
//       return cookieValue; 
//     }
//   }

//   return null; 
// };

// export {getCookie};

