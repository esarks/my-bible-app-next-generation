import * as React from "react";
import { PlasmicRootProvider as PlasmicRootProviderImpl } from "@plasmicapp/react-web";
import { BrowserRouter } from "react-router-dom";

// No GlobalContextsProvider needed here
export function PlasmicRootProvider(props: React.PropsWithChildren<{}>) {
  return (
    <PlasmicRootProviderImpl Head={React.Fragment} prefetchedQueryData={{}}>
      <BrowserRouter>{props.children}</BrowserRouter>
    </PlasmicRootProviderImpl>
  );
}
