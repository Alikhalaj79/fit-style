const expire = token =>  {
    const expirationDate = new Date(token).toString();
    return expirationDate;
}

const setCookie = token =>{
    document.cookie = `refreshToken=${token.refreshToken}; max-age=${expire(
      token.otp.expiresIn
    )}`;
}

export {setCookie}