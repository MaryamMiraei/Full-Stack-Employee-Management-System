"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
};

export default Redirect;
