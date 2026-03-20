'use strict';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['example.com'], // replace with your image domains
  },
};

module.exports = nextConfig;