/** @type {import('next-sitemap').IConfig} */
module.exports = {
	// サイトのベースURL
	siteUrl: 'https://erice.cloud',
	// robots.txtは手動で配置済みのため、生成しない
	generateRobotsTxt: false,
	// 動的生成されるサイトマップインデックスを除外
	exclude: ['/server-sitemap-index.xml'],
	// robots.txtに追加するサイトマップ
	robotsTxtOptions: {
		additionalSitemaps: ['https://erice.cloud/server-sitemap-index.xml']
	},
	// 各サイトマップのエントリー数（他のファイルと一致させる）
	sitemapSize: 20000
}
