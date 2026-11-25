import LoginCover from "@/features/auth/components/LoginCover";
import React from "react";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="auth-container flex">
        <LoginCover />
        {children}
      </main>
    </>
  );
};

export default LoginLayout;
