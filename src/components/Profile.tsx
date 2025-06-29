import * as React from "react";
import {
  PlasmicProfile,
  DefaultProfileProps
} from "../plasmic/my_bible_app_next_generation/PlasmicProfile";

export interface ProfileProps extends DefaultProfileProps {}

function Profile_(props: ProfileProps, ref: React.Ref<HTMLDivElement>) {
  return <PlasmicProfile root={{ ref }} {...props} />;
}

const Profile = React.forwardRef(Profile_);
export default Profile;
