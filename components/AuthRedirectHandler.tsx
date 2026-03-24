"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function AuthRedirectHandler() {
    const router = useRouter();

    useEffect(() => {
        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "SIGNED_IN" || event === "USER_UPDATED") {
                // Check if this was a result of an email verification (type=signup or type=recovery)
                // When a user verifies their email, they are often signed in automatically.
                // We check if the URL contains verification parameters
                const hash = window.location.hash;
                const searchParams = new URLSearchParams(window.location.search);
                
                if (hash.includes("type=signup") || hash.includes("access_token=") || searchParams.has("code")) {
                    router.push("/verify-success");
                }
            }
        });

        // Initial check for hash in case the event doesn't fire as expected
        const hash = window.location.hash;
        if (hash.includes("type=signup") || hash.includes("access_token=")) {
            router.push("/verify-success");
        }

        return () => subscription.unsubscribe();
    }, [router]);

    return null;
}
