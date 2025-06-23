import { PlasmicRootProvider, PlasmicComponent } from "@plasmicapp/loader-react";
import { PLASMIC } from "@/plasmic-init";

export default function LoginPage() {
  return (
    <PlasmicRootProvider loader={PLASMIC}>
      <PlasmicComponent component="Login" />
    </PlasmicRootProvider>
  );
}
