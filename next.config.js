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

			// Home
			{
				source: "/home",
				destination: "/home",
			},
			{
				source: "/home/shared",
				destination: "/home/shared",
			},
			{
				source: "/home/trash",
				destination: "/home/trash",
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
