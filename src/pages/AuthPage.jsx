import { useState } from "react";
import SendOtpForm from "../components/templates/adminPage/adminComponents/SendOtpForm";
import CheckOtpForm from "../components/templates/adminPage/adminComponents/CheckOtpForm";

const AuthPage = () => {
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [code, setCode] = useState("");
  const [timer, setTimer] = useState(60); // 60 seconds timer

  // Function to start the timer
  const startTimer = () => {
    setTimer(60); // Reset timer to 60 seconds
    const interval = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval); // Stop timer when it reaches 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  return (
    <div>
      {step === 1 && (
        <SendOtpForm
          setStep={setStep}
          mobile={mobile}
          setMobile={setMobile}
          startTimer={startTimer}
          timer={timer}
        />
      )}
      {step === 2 && (
        <CheckOtpForm
          mobile={mobile}
          code={code}
          setCode={setCode}
          setStep={setStep}
          startTimer={startTimer}
          timer={timer}
        />
      )}
    </div>
  );
};

export default AuthPage;
