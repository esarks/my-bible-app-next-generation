// src/pages/LoginPage.tsx
import { useState } from "react";
import { PlasmicComponent, PlasmicRootProvider } from "@plasmicapp/loader-react";
import { PLASMIC } from "../components/plasmic-init";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");

  const sendCode = async () => {
    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setCode(data.code); // dev mode only
      alert("Code sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send code.");
    }
  };

  const verifyCode = async () => {
    try {
      const res = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      alert(data.success ? "Verified!" : "Failed verification");
    } catch (err) {
      console.error(err);
      alert("Failed to verify code.");
    }
  };

  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <PlasmicComponent
        component="Login"
        componentProps={{
          phoneInput: {
            value: phone,
            onChange: (e: any) => setPhone(e.target.value),
          },
          verificationInput: {
            value: code,
            onChange: (e: any) => setCode(e.target.value),
          },
          sendCodeButton: { onClick: sendCode },
          verifyCodeButton: { onClick: verifyCode },
        }}
      />
    </PlasmicRootProvider>
  );
}
