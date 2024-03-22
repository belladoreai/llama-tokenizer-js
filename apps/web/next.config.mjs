/** @type {import('next').NextConfig} */
const nextConfig={
    reactStrictMode: true,
    transpilePackages: ["@repo/ui", "@repo/llama-tokenizer"]
};

export default nextConfig;
