// src/pages/LoginPage.tsx
import React, { useState } from "react";
import Login from "../components/Login";

export default function LoginPage() {
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
    <Login
      phoneInput={{
        value: phone,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setPhone(e.target.value),
      }}
      verificationInput={{
        value: code,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setCode(e.target.value),
      }}
      sendCodeButton={{
        onClick: sendCode,
      }}
      verifyCodeButton={{
        onClick: verifyCode,
      }}
    />
  );
}
