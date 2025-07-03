import * as React from "react";
import {
  PlasmicProfile,
  DefaultProfileProps,
} from "../plasmic/my_bible_app_next_generation/PlasmicProfile";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../AuthContext";

export interface ProfileProps extends DefaultProfileProps {}

function Profile_(props: ProfileProps, ref: React.Ref<HTMLDivElement>) {
  const { profile: authProfile } = useAuth();
  const [phone, setPhone] = React.useState(authProfile?.phone ?? "");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [notes, setNotes] = React.useState("");

  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!authProfile?.phone) {
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("phone", authProfile.phone)
        .single();

      if (error) {
        console.error("[fetchProfile]", error);
      } else if (data) {
        setPhone(data.phone ?? "");
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setNotes(data.notes ?? data.text ?? "");
      }
    };

    fetchProfile();
  }, [authProfile?.phone]);

  const handleSave = async () => {
    const { error } = await supabase.from("profiles").upsert({
      phone,
      name,
      email,
      notes,
    });

    if (error) {
      console.error("[handleSave]", error);
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
      button={{
        props: { onClick: handleSave },
      }}
    />
  );
}

const Profile = React.forwardRef(Profile_);
export default Profile;
