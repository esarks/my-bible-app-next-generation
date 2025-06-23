import { PlasmicComponent } from "@plasmicapp/loader-react";
import { useState } from "react";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const sendCode = async () => {
    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        body: JSON.stringify({ phone }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Failed to send code");
      }

      setCode(data.code); // Pre-fill code input for testing
      alert("Verification code sent!");
    } catch (err) {
      console.error(err);
      alert("Error sending code.");
    }
  };

  const verifyCode = async () => {
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        body: JSON.stringify({ phone, code }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        alert("Code verified! Logging in...");
        // TODO: Navigate or set login state
      } else {
        alert("Verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying code.");
    }
  };

  return (
    <PlasmicComponent
      component="Login"
      componentProps={{
        inputPhone: {
          value: phone,
          onChange: (e: any) => setPhone(e.target.value),
        },
        inputVerification: {
          value: code,
          onChange: (e: any) => setCode(e.target.value),
        },
        sendButton: {
          onClick: sendCode,
        },
        verifyButton: {
          onClick: verifyCode,
        },
      }}
    />
  );
}
