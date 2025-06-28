// src/pages/LoginPage.tsx
import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps
} from "../plasmic/my_bible_app_next_generation/PlasmicLogin";

export interface LoginPageProps extends DefaultLoginProps {}

function LoginPage(props: LoginPageProps) {
  return <PlasmicLogin {...props} />;
}

export default LoginPage;
