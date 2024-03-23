/** @type {import('next').NextConfig} */
const nextConfig={
    output: 'export',
    basePath: '/llama-tokenizer-js',
    images: {
        unoptimized: true,
    },
    reactStrictMode: true,
    transpilePackages: ["@repo/llama-tokenizer"]
};

export default nextConfig;
