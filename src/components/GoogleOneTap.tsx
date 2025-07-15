"use client";

import { useEffect } from "react";
import Script from "next/script";
import { createClient } from "@/lib/supabase/client";

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const supabase = createClient();

export default function GoogleOneTap() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.google || !clientId) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response: { credential: string }) => {
        const { credential } = response;
        if (!credential) return;

        const { error } = await supabase.auth.signInWithIdToken({
          provider: "google",
          token: credential,
        });

        if (error) {
          console.error("Google One Tap login failed:", error.message);
        }
      },
      auto_select: true,
    });

    window.google.accounts.id.prompt();
  }, []);

  return (
    <Script
      src="https://accounts.google.com/gsi/client"
      strategy="afterInteractive"
    />
  );
}
