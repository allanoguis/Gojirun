"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { saveUser } from "@/lib/api-client";

const guestAvatarUrl =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_GUEST_AVATAR_URL?.trim()) ||
  "https://api.dicebear.com/7.x/avataaars/png?seed=Guest&size=200";

export default function UserProfileSync() {
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    // Only sync when user is loaded and signed in
    if (!isLoaded || !isSignedIn || !user) return;

    const syncUserProfile = async () => {
      try {
        const playerID = user.id;
        const email = user.emailAddresses[0]?.emailAddress || "unknown@example.com";
        const fullname = user.firstName || user.username || "User";
        const profileImage = user.imageUrl || guestAvatarUrl;
        const createdAt = user.createdAt || new Date();
        const lastSignInAt = user.lastSignInAt || new Date();

        await saveUser({
          userId: playerID,
          email: email,
          fullname: fullname,
          profileImageUrl: profileImage,
          createdAt: createdAt,
          lastSignInAt: lastSignInAt
        });
        
        console.log("✅ User profile synced on sign-in:", { fullname, email });
      } catch (error) {
        console.error("❌ Error syncing user profile on sign-in:", error);
      }
    };

    syncUserProfile();
  }, [isLoaded, isSignedIn, user]);

  // This component doesn't render anything - it's just for side effects
  return null;
}
