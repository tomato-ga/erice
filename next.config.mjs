/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '*', // ワイルドカードを使う
				port: ''
			}
		]
	},
	experimental: {
		scrollRestoration: true
	}
}

export default nextConfig
