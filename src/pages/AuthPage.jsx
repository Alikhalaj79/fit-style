import { useState } from "react";
import SendOtp from "../components/templates/SendOtp";
import CheckOtp from "../components/templates/CheckOtp";

const AuthPage = () => {
    const [step , setStep] = useState(1)
    const [mobile , setMobile] = useState("")
    const [code , setCode ] = useState("")

    return (
      <div>
        {step === 1 && <SendOtp setStep={setStep} mobile={mobile} setMobile={setMobile} />}
        {step === 2 && <CheckOtp mobile={mobile} code={code} setCode={setCode} />}
      </div>
    );
};

export default AuthPage;