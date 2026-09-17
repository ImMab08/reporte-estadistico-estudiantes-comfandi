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
    '192.168.137.1',
    '192.168.10.24',
    '192.168.10.11',
    "172.20.10.3",
    "192.168.10.6"
  ],
};

module.exports = nextConfig;
