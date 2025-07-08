import * as React from "react";
import {
  PlasmicLogin,
  DefaultLoginProps,
} from "../plasmic/my_bible_app_next_generation/PlasmicLogin";
import { HTMLElementRefOf } from "@plasmicapp/react-web";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../AuthContext";
import { logger, logSupabaseError } from "../lib/logger";

export interface LoginProps extends DefaultLoginProps {}

function Login_(props: LoginProps, ref: HTMLElementRefOf<"div">) {
  const navigate = useNavigate();
  const [phone, setPhone] = React.useState("");
  const [code, setCode] = React.useState("");
  const { setProfile, setIsVerified } = useAuth();

  const handleSend = async () => {
    logger.debug("[handleSend] Invoked");

    if (!phone) {
      alert("Please enter a phone number.");
      return;
    }

    logger.info(`[handleSend] Sending code to ${phone}`);

    try {
      const res = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      logger.debug("[handleSend] Response:", data);

      if (data.success) {
        setPhone(data.phone);
        alert(`Verification code sent to ${data.phone} — CODE: ${data.code}`);
      } else {
        alert(`Failed to send: ${data.error}`);
      }
    } catch (err) {
      logger.error("[handleSend] Error:", err);
      alert("Failed to send verification code.");
    }
  };

  const handleVerify = async () => {
    logger.debug("[handleVerify] Invoked");

    if (!code) {
      alert("Please enter the verification code.");
      return;
    }

    logger.info(`[handleVerify] Verifying code "${code}" for ${phone}`);

    try {
      const res = await fetch("http://localhost:5000/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });

      logger.debug("[handleVerify] HTTP status", res.status);

      const data = await res.json();
      logger.debug("[handleVerify] Response:", data);

      if (data.success) {
        if (!supabase) {
          logger.error('[handleVerify] Supabase client is not initialized');
          alert('Verification succeeded, but Supabase is not configured.');
          const tempProfile = { id: phone, phoneNumber: phone };
          setProfile(tempProfile);
          try {
            localStorage.setItem('loginId', tempProfile.id);
            localStorage.setItem('profile', JSON.stringify(tempProfile));
          } catch {
            // ignore storage errors
          }
          setIsVerified(true);
          navigate('/profile');
          return;
        }

        const { data: profileData, error } = await supabase
          .from('UserProfile')
          .select('*')
          .eq('phoneNumber', phone)
          .single();

        if (error) {
          logSupabaseError('handleVerify fetch profile', error);
          logger.warn('[handleVerify] Profile not found, creating new');
          const { data: newProfile, error: insertError } = await supabase
            .from('UserProfile')
            .insert({ phoneNumber: phone })
            .select('*')
            .single();
          if (insertError) {
            logSupabaseError('handleVerify insert', insertError);
          } else if (newProfile) {
            setProfile(newProfile);
            try {
              localStorage.setItem('loginId', newProfile.id ?? '');
              localStorage.setItem('profile', JSON.stringify(newProfile));
            } catch {
              // ignore storage errors
            }
          }
        } else if (profileData) {
          setProfile(profileData);
          try {
            localStorage.setItem('loginId', profileData.id ?? '');
            localStorage.setItem('profile', JSON.stringify(profileData));
          } catch {
            // ignore storage errors
          }
        } else {
          const tempProfile = { id: phone, phoneNumber: phone };
          setProfile(tempProfile);
          try {
            localStorage.setItem('loginId', tempProfile.id);
            localStorage.setItem('profile', JSON.stringify(tempProfile));
          } catch {
            // ignore storage errors
          }
        }

        setIsVerified(true);

        navigate('/profile');
      } else {
        logger.warn('[handleVerify] Verification failed:', data.error);
        alert(`Verification failed: ${data.error}`);
      }
    } catch (err) {
      logger.error("[handleVerify] Error:", err);
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
            logger.debug("[inputPhone] Changed:", val);
            setPhone(val);
          },
        },
      }}
      inputVerification={{
        props: {
          value: code,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            logger.debug("[inputVerification] Changed:", val);
            setCode(val);
          },
        },
      }}
      sendButton={{
        props: {
          onClick: () => {
            logger.debug("[sendButton] Clicked");
            handleSend();
          },
        },
      }}
      verifyButton={{
        props: {
          onClick: () => {
            logger.debug("[verifyButton] Clicked");
            handleVerify();
          },
        },
      }}
    />
  );
}

const Login = React.forwardRef(Login_);
export default Login;
