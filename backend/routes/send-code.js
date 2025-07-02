import React, { useState } from "react";

const Login = () => {
  const [phone, setPhone] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const handleSend = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Verification code sent to ${phone} — CODE: ${data.code}`);
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (err) {
      console.error("[handleSend] Error:", err);
      alert("Error sending code.");
    }
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: codeInput }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Verification successful!");
      } else {
        alert(`Verification failed: ${data.error}`);
      }
    } catch (err) {
      console.error("[handleVerify] Error:", err);
      alert("Error verifying code.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <label>
        Enter Phone Number:
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <button onClick={handleSend}>Send</button>

      <br />
      <label>
        Enter Verification Code:
        <input
          type="text"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
        />
      </label>
      <button onClick={handleVerify}>Verify</button>
    </div>
  );
};

export default Login;
