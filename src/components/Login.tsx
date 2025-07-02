import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps,
} from "../plasmic/my_bible_app_next_generation/PlasmicLogin";
import { HTMLElementRefOf } from "@plasmicapp/react-web";

export interface LoginProps extends DefaultLoginProps {}

function Login_(props: LoginProps, ref: HTMLElementRefOf<"div">) {
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSend = async () => {
    console.log("[handleSend] Invoked");

    if (!phone) {
      alert("Please enter a phone number.");
      return;
    }

    console.log(`[handleSend] Sending code to ${phone}`);

    try {
      const res = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      console.log("[handleSend] Response:", data);

      if (data.success) {
        alert(`Verification code sent to ${phone}`);
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (err) {
      console.error("[handleSend] Error:", err);
      alert("Failed to send verification code.");
    }
  };

  const handleVerify = async () => {
    console.log("[handleVerify] Invoked");

    if (!code) {
      alert("Please enter the verification code.");
      return;
    }

    console.log(`[handleVerify] Verifying code "${code}" for ${phone}`);

    try {
      const res = await fetch("http://localhost:5000/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();
      console.log("[handleVerify] Response:", data);

      if (data.success) {
        alert("Phone verified!");
      } else {
        alert(`Verification failed: ${data.error}`);
      }
    } catch (err) {
      console.error("[handleVerify] Error:", err);
      alert("Failed to verify code.");
    }
  };

  return (
    <PlasmicLogin
      root={{ ref }}
      {...props}
      inputPhone={{
        props: {
          value: phone,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            console.log("[inputPhone] Changed:", val);
            setPhone(val);
          },
        },
      }}
      inputVerification={{
        props: {
          value: code,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            console.log("[inputVerification] Changed:", val);
            setCode(val);
          },
        },
      }}
      sendButton={{
        props: {
          onClick: () => {
            console.log("[sendButton] Clicked");
            handleSend();
          },
        },
      }}
      verifyButton={{
        props: {
          onClick: () => {
            console.log("[verifyButton] Clicked");
            handleVerify();
          },
        },
      }}
    />
  );
}

const Login = React.forwardRef(Login_);
export default Login;
