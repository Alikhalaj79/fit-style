// const expire = token =>  {
//     const expirationDate = new Date(token).toString();
//     return expirationDate;
// }

const setCookie = tokens =>{
    document.cookie = `refreshToken=${tokens.refreshToken}; max-age=${30 * 24 * 60 * 60}`;
}

export {setCookie}