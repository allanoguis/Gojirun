"use client";
import { useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { saveUser } from "@/lib/api-client";

const guestAvatarUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GUEST_AVATAR_URL?.trim()) ||
  "https://api.dicebear.com/7.x/avataaars/png?seed=Guest&size=200";

export default function UserProfileSync() {
  const { user, isLoading } = useUser();

  useEffect(() => {
    // Only sync when user is loaded and signed in
    if (isLoading || !user) return;

    const syncUserProfile = async () => {
      try {
        const email = user.email || "unknown@example.com";
        const fullname = user.given_name || user.nickname || user.name || "User";
        const profileImage = user.picture || guestAvatarUrl;
        await saveUser({
          userId: user.sub,
          email: email,
          fullname: fullname,
          profileImageUrl: profileImage
        });
        
        console.log("✅ User profile synced on sign-in:", { fullname, email });
      } catch (error) {
        console.error("❌ Error syncing user profile on sign-in:", error);
      }
    };

    syncUserProfile();
  }, [isLoading, user]);

  // This component doesn't render anything - it's just for side effects
  return null;
}
