import React, { useState } from "react";
import Login from "../components/Login";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const sendCode = () => {
    alert("Pretend code was sent");
    setCode("1234");
  };

  const verifyCode = () => {
    alert(code === "1234" ? "Code verified!" : "Invalid code");
  };

  return (
    <Login
      phone={phone}
      setPhone={setPhone}
      code={code}
      setCode={setCode}
      sendCode={sendCode}
      verifyCode={verifyCode}
    />
  );
}
