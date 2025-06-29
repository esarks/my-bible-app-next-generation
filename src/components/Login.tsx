import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps
} from "../plasmic/my_bible_app_next_generation/PlasmicLogin";
import { HTMLElementRefOf } from "@plasmicapp/react-web";

export interface LoginProps extends DefaultLoginProps {}

function Login_(props: LoginProps, ref: HTMLElementRefOf<"div">) {
  const [phone, setPhone] = React.useState("");

  const handleSend = async () => {
    console.log("[handleSend] Invoked");

    if (!phone) {
      console.warn("[handleSend] No phone number entered");
      alert("Please enter a phone number.");
      return;
    }

    console.log(`[handleSend] Sending code to: ${phone}`);

    try {
      const res = await fetch("/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      console.log("[handleSend] Fetch response received");

      const data = await res.json();
      console.log("[handleSend] Response JSON:", data);

      if (data.success) {
        console.info(`[handleSend] Code successfully sent to ${phone}`);
        alert(`Code sent to ${phone}`);
      } else {
        console.error(`[handleSend] Failed to send: ${data.error}`);
        alert(`Failed to send: ${data.error}`);
      }
    } catch (err) {
      console.error("[handleSend] Network or server error:", err);
      alert("Error sending code. Check the console.");
    }
  };

  return (
    <PlasmicLogin
      root={{ ref }}
      {...props}
      phoneInput={{
        props: {
          value: phone,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            console.log("[phoneInput] Changed to:", val);
            setPhone(val);
          },
        },
      }}
      SendButton={{  // <-- Corrected to match Plasmic component name
        props: {
          onClick: () => {
            console.log("[SendButton] Clicked");
            handleSend();
          },
        },
      }}
    />
  );
}

const Login = React.forwardRef(Login_);
export default Login;
