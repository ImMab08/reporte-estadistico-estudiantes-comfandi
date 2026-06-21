/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  allowedDevOrigins: [
    '192.168.10.74',
    '192.168.137.1'
  ],
};

module.exports = nextConfig;
