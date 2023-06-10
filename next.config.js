/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,

	distDir: "build/src",

	async rewrites() {
		return [
			// Main
			{
				source: "/",
				destination: "/main",
			},
            {
				source: "/home",
				destination: "/main/home",
			},

			// Accounts
			{
				source: "/login",
				destination: "/accounts/login",
			},
			{
				source: "/register",
				destination: "/accounts/register",
			},
		];
	},
};

module.exports = nextConfig;
