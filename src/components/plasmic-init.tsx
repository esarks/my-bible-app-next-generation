
// src/plasmic-init.ts
import { initPlasmicLoader } from "@plasmicapp/loader-react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "kPtL4UpULb2Exm5C4cyhzL", // Replace with your real Project ID
      token: "KhK3gU6aLw4gWXFiC6FDZzYMB1JfsWewrNsbDqaYp0zTSfqCHQ3fpg3PyB7Ar7PYzZ3Dy4gZJp5ynYoZmQ", // Replace with your real public token
    },
  ],
  preview: true,
});
