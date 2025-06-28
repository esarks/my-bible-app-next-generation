import * as React from "react";
import { PlasmicLogin } from "../plasmic/app_starter/PlasmicLogin";

interface LoginProps {
  phone: string;
  code: string;
  setPhone: (val: string) => void;
  setCode: (val: string) => void;
  sendCode: () => void;
  verifyCode: () => void;
}

function Login({
  phone,
  setPhone,
  code,
  setCode,
  sendCode,
  verifyCode,
}: LoginProps) {
  return (
    <PlasmicLogin
      overrides={{
        inputPhone: {
          props: {
            value: phone,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setPhone(e.target.value),
          },
        },
        inputVerification: {
          props: {
            value: code,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
              setCode(e.target.value),
          },
        },
        sendButton: {
          props: {
            onClick: sendCode,
          },
        },
        verifyButton: {
          props: {
            onClick: verifyCode,
          },
        },
      }}
    />
  );
}

export default Login;
