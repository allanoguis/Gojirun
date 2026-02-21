/**
 * Guest avatar: served from Supabase Storage.
 * Uses NEXT_PUBLIC_SUPABASE_URL (same value as SUPABASE_URL) so the browser can load the image.
 * Upload a guest placeholder image to Storage: create a public bucket "avatars" and add "guest.png".
 * Override with NEXT_PUBLIC_GUEST_AVATAR_URL if you need a different path.
 */
function getGuestAvatarUrl() {
  if (typeof process === "undefined") return "https://api.dicebear.com/7.x/avataaars/png?seed=Guest&size=200";
  const custom = process.env?.NEXT_PUBLIC_GUEST_AVATAR_URL?.trim();
  if (custom) return custom;
  const base = process.env?.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (base) return `${base.replace(/\/$/, "")}/storage/v1/object/public/avatars/guest.png`;
  return "https://api.dicebear.com/7.x/avataaars/png?seed=Guest&size=200";
}

const GUEST_AVATAR_URL = getGuestAvatarUrl();

export { GUEST_AVATAR_URL };
