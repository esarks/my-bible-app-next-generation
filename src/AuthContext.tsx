import React, { createContext, useContext, useState } from "react";

export interface AuthContextType {
  isVerified: boolean;
  setIsVerified: (v: boolean) => void;
  profile: any;
  setProfile: (p: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  return (
    <AuthContext.Provider value={{ isVerified, setIsVerified, profile, setProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};
