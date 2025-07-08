import React, { createContext, useContext, useState, useEffect } from "react";

export interface AuthContextType {
  isVerified: boolean;
  setIsVerified: (v: boolean) => void;
  profile: any;
  setProfile: (p: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [profile, setProfile] = useState<any>(() => {
    if (typeof window === "undefined") {
      return null;
    }
    try {
      const stored = localStorage.getItem("profile");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      if (profile) {
        localStorage.setItem("profile", JSON.stringify(profile));
        if (profile.id) {
          localStorage.setItem("loginId", profile.id);
        }
      } else {
        localStorage.removeItem("profile");
      }
    } catch {
      // ignore storage errors
    }
  }, [profile]);

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
