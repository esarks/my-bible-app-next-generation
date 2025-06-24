import * as React from "react";
import { PlasmicLogin, DefaultLoginProps } from "../plasmic/app_starter/PlasmicLogin";
import { HTMLElementRefOf } from "@plasmicapp/react-web";

type LoginProps = DefaultLoginProps;

function Login_(props: LoginProps, ref: HTMLElementRefOf<"div">) {
  return <PlasmicLogin root={{ ref }} {...props} />;
}

const Login = React.forwardRef(Login_);

export default Login;
