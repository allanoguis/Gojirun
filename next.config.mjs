import path from "path";

let supabaseHost = null;
try {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (url) supabaseHost = new URL(url).hostname;
} catch {
  // Invalid URL format; omit Supabase from image domains
}

const imagePatterns = [
  {
    protocol: "https",
    hostname: "avatars.githubusercontent.com",
    port: "",
    pathname: "/**",
  },
  {
    protocol: "https",
    hostname: "api.dicebear.com",
    port: "",
    pathname: "/**",
  },
  ...(supabaseHost
    ? [
        {
          protocol: "https",
          hostname: supabaseHost,
          port: "",
          pathname: "/storage/v1/object/public/**",
        },
      ]
    : []),
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true, // Enable SWC minification
  images: {
    remotePatterns: imagePatterns,
  },
  webpack: (config) => {
    // Set up the alias correctly in ES module syntax
    config.resolve.alias["@"] = path.resolve(".");
    return config;
  },
};

export default nextConfig;
