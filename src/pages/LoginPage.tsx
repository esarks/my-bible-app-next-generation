// src/pages/LoginPage.tsx
import { useState } from "react";
import { PlasmicRootProvider, PlasmicComponent } from "@plasmicapp/loader-react";
import { PLASMIC } from "@/plasmic-init";

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
      if (!res.ok) throw new Error("Failed to send code");
      setCode(data.code); // optional for dev
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Code verified!");
      } else {
        alert("Verification failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying code.");
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
          sendCodeButton: {
            onClick: sendCode,
          },
          verifyCodeButton: {
            onClick: verifyCode,
          },
        }}
      />
    </PlasmicRootProvider>
  );
}
