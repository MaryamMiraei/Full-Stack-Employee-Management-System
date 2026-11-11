"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(() => new QueryClient());
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={client}>
        {children}
        <ToastContainer position="top-right" autoClose={3000} />;
      </QueryClientProvider>
    </I18nextProvider>
  );
};

export default Providers;
