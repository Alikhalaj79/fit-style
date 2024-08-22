import React from 'react';
import { checkOtp } from '../../services/auth';

const CheckOtpForm = ({mobile , code ,setCode}) => {

    const submitHandler = async (event) => {
        event.preventDefault();
        const {response , error} = await checkOtp(mobile , code)
        console.log(response , error);
    }

    return (
        <form onSubmit={submitHandler}>
            <h3>برای ورود شماره همراه و کد ارسال شده را وارد نمایید</h3>
            <input type="text" value={mobile}  placeholder='شماره تلفن همراه' />
            <input type="text" value={code} onChange={(e) => setCode(e.target.value)} placeholder='کد ارسال شده' />
            <button type='submit'>ورود</button>
       </form>
    );
};

export default CheckOtpForm;