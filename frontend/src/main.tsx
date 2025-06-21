// frontend/src/main.tsx or main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { PlasmicRootProvider } from './components/plasmic-init'; // ✅ check actual filename

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PlasmicRootProvider>
      <App />
    </PlasmicRootProvider>
  </React.StrictMode>
);
