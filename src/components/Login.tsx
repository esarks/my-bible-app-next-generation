import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps,
} from "../plasmic/app_starter/PlasmicLogin";
import { useState } from "react";

function Login_(_: DefaultLoginProps) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const sendCode = async () => {
    alert("Pretend code was sent");
    setCode("1234");
  };

  const verifyCode = () => {
    alert(code === "1234" ? "Code verified!" : "Invalid code");
  };

  return (
    <PlasmicLogin
      // Spread default props for safety
      {..._}
      // Inject state bindings and handlers
      componentProps={{
        // Match exactly what Plasmic calls these elements (case-sensitive!)
        InputPhone: {
          value: phone,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(e.target.value),
        },
        InputVerification: {
          value: code,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setCode(e.target.value),
        },
        SendButton: {
          onClick: sendCode,
        },
        VerifyButton: {
          onClick: verifyCode,
        },
      }}
    />
  );
}

export default Login_;
