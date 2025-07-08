import * as React from "react";
import {
  PlasmicProfile,
  DefaultProfileProps,
} from "../plasmic/my_bible_app_next_generation/PlasmicProfile";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../AuthContext";
import { logger, logSupabaseError } from "../lib/logger";

export interface ProfileProps extends DefaultProfileProps {}

function Profile_(props: ProfileProps, ref: React.Ref<HTMLDivElement>) {
  const { profile: authProfile, setProfile } = useAuth();
  const [phone, setPhone] = React.useState(authProfile?.phoneNumber ?? "");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isEmailVerified, setIsEmailVerified] = React.useState("");
  const [profileId, setProfileId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!authProfile?.phoneNumber) {
        return;
      }

      if (!supabase) {
        logger.error("[fetchProfile] Supabase client is not initialized");
        return;
      }

      const { data, error } = await supabase
        .from("UserProfile")
        .select("*")
        .eq("phoneNumber", authProfile.phoneNumber)
        .single();

      if (error) {
        logSupabaseError('fetchProfile', error);
      } else if (data) {
        setProfileId(data.id ?? null);
        setPhone(data.phoneNumber ?? "");
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setIsEmailVerified(data.emailVerified ? "true" : "false");
      }
    };

    fetchProfile();
  }, [authProfile?.phoneNumber]);

  React.useEffect(() => {
    if (authProfile?.id) {
      try {
        localStorage.setItem("loginId", authProfile.id);
      } catch {
        // ignore storage errors
      }
    }
  }, [authProfile?.id]);

  const handleSave = async () => {
    if (!supabase) {
      logger.error("[handleSave] Supabase client is not initialized");
      alert("Supabase client is not available.");
      return;
    }

    const newId = profileId ?? crypto.randomUUID();
    const profile = {
      id: newId,
      phoneNumber: phone,
      name,
      email,
      emailVerified: isEmailVerified === "true",
    };

    const { error } = await supabase.from("UserProfile").upsert(profile);

    if (error) {
      logSupabaseError('handleSave', error);
      alert("Failed to save profile");
    } else {
      setProfileId(newId);
      setProfile(profile);
      try {
        localStorage.setItem("loginId", newId);
      } catch {
        // ignore storage errors
      }
      alert("Profile saved successfully");
    }
  };

  const handleQuery = async () => {
    if (!supabase) {
      logger.error("[handleQuery] Supabase client is not initialized");
      alert("Supabase client is not available.");
      return;
    }

    const { data, error } = await supabase
      .from("UserProfile")
      .select("*")
      .eq("phoneNumber", phone)
      .maybeSingle();

    if (error) {
      logSupabaseError('handleQuery', error);
      alert("Failed to fetch profile");
    } else if (data) {
      setProfileId(data.id ?? null);
      setPhone(data.phoneNumber ?? "");
      setName(data.name ?? "");
      setEmail(data.email ?? "");
      setIsEmailVerified(data.emailVerified ? "true" : "false");
      setProfile(data);
      try {
        localStorage.setItem("loginId", data.id ?? "");
      } catch {
        // ignore storage errors
      }
    } else {
      alert("No profile found");
    }
  };

  return (
    <PlasmicProfile
      root={{ ref }}
      {...props}
      inputPhone={{
        props: {
          value: phone,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(e.target.value),
        },
      }}
      inputName={{
        props: {
          value: name,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value),
        },
      }}
      inputEmail={{
        props: {
          value: email,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value),
        },
      }}
      inputVerified={{
        props: {
          value: isEmailVerified,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setIsEmailVerified(e.target.value),
        },
      }}
      saveButton={{
        props: { onClick: handleSave },
      }}
      queryButton={{
        props: { onClick: handleQuery },
      }}
    />
  );
}

const Profile = React.forwardRef(Profile_);
export default Profile;
