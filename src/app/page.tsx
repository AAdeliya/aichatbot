//redirect to /dashboard
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function AuthRedirect() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/auth/sign-in"); // fix path here
    }
  }, [user, isLoaded, router]);

  return null;
}
