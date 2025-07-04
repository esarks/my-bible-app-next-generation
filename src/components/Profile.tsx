import * as React from "react";
import {
  PlasmicProfile,
  DefaultProfileProps,
} from "../plasmic/my_bible_app_next_generation/PlasmicProfile";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../AuthContext";
import { logger } from "../lib/logger";

export interface ProfileProps extends DefaultProfileProps {}

function Profile_(props: ProfileProps, ref: React.Ref<HTMLDivElement>) {
  const { profile: authProfile } = useAuth();
  const [phone, setPhone] = React.useState(authProfile?.phoneNumber ?? "");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!authProfile?.phone) {
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
        logger.error("[fetchProfile]", error);
      } else if (data) {
        setPhone(data.phoneNumber ?? "");
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setNotes("");
      }
    };

    fetchProfile();
  }, [authProfile?.phone]);

  const handleSave = async () => {
    if (!supabase) {
      logger.error("[handleSave] Supabase client is not initialized");
      alert("Supabase client is not available.");
      return;
    }

    const { error } = await supabase.from("UserProfile").upsert({
      phoneNumber: phone,
      name,
      email,
    });

    if (error) {
      logger.error("[handleSave]", error);
      alert("Failed to save profile");
    } else {
      alert("Profile saved successfully");
    }
  };

  return (
    <PlasmicProfile
      root={{ ref }}
      {...props}
      input={{
        props: {
          value: phone,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(e.target.value),
        },
      }}
      input2={{
        props: {
          value: name,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setName(e.target.value),
        },
      }}
      input3={{
        props: {
          value: email,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setEmail(e.target.value),
        },
      }}
      input4={{
        props: {
          value: notes,
          onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
            setNotes(e.target.value),
        },
      }}
      saveButton={{
        props: { onClick: handleSave },
      }}
    />
  );
}

const Profile = React.forwardRef(Profile_);
export default Profile;
