import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: true, // Enable SWC minification
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  webpack: (config) => {
    // Set up the alias correctly in ES module syntax
    config.resolve.alias["@"] = path.resolve("app");
    return config;
  },
};

export default nextConfig;
