/** @type {import('next').NextConfig} */
const nextConfig={
    output: 'export',
    reactStrictMode: true,
    transpilePackages: ["@repo/ui", "@repo/llama-tokenizer"]
};

export default nextConfig;
