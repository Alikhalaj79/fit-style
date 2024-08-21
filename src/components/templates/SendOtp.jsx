import React from "react";
import { sendOtp } from "../../services/auth";

const SendOtp = ({ mobile, setStep, setMobile }) => {
  const submitHandler = async (event) => {
    event.preventDefault();
    console.log(mobile);
    const {response , error} = await sendOtp({mobile});
    console.log(response , error);
  };
  return (
    <form onSubmit={submitHandler}>
      <h3>ورود از طریق رمز یکبار مصرف</h3>
      <label htmlFor="input">شماره موبایل خود را وارد کنید</label>
      <input
        type="text"
        name="mobile"
        placeholder="شماره تلفن همراه"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button type="submit">ثبت</button>
    </form>
  );
};

export default SendOtp;
