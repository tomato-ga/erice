/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'pics.dmm.co.jp',
				// pathname: '/**', // 必要に応じてパスを指定
			},
			{
				protocol: 'https',
				hostname: 'livedoor.blogimg.jp',
			},
			// 他に許可するホスト名があれば追加
		],
	},
	experimental: {
		scrollRestoration: true,
		nextScriptWorkers: true,
	},
	// その他の設定
}

module.exports = nextConfig
