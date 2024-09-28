/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'pics.dmm.co.jp',
				// port: '', // デフォルトは全て許可
				// pathname: '/**', // 必要に応じてパスを指定
			},
			{
				protocol: 'https',
				hostname: 'www.dmm.co.jp',
			},
			// 他に許可するホスト名があれば追加
		],
	},
	experimental: {
		scrollRestoration: true,
	},
}

export default nextConfig

// /** @type {import('next').NextConfig} */
// const nextConfig = {
// 	images: {
// 		remotePatterns: [
// 			{
// 				protocol: 'https',
// 				hostname: '*', // ワイルドカードを使う
// 				port: ''
// 			}
// 		]
// 	},
// 	experimental: {
// 		scrollRestoration: true
// 	}
// }

// export default nextConfig
