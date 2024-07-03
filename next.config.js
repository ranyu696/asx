// @ts-check
const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

/**
 * @type {import('next').NextConfig}
 */
module.exports = async (phase, { defaultConfig }) => {
  const resWebsite = await fetch(
    "https://strapi.xiaoxinlook.cc/api/websites/1?fields=imageURL",
  );
  const dataWebsite = await resWebsite.json();
  const websiteImageURL = dataWebsite.data.attributes.imageURL;

  const imageHostname = new URL(websiteImageURL).hostname;

  const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: imageHostname,
          port: "",
          pathname: "/**",
        },
      ],
      minimumCacheTTL: 6000,
      formats: ["image/avif", "image/webp"],
      contentDispositionType: "inline",
    },
    experimental: {
      optimizePackageImports: ["@vidstack/react"],
    },
  };

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    // Additional configuration for development server
  }

  return nextConfig;
};
