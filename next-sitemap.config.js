/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://erice.cloud', // 実際のサイトURLに置き換えてください
	generateRobotsTxt: true,
	exclude: ['/server-sitemap-index.xml'],
	robotsTxtOptions: {
		additionalSitemaps: ['https://erice.cloud/server-sitemap-index.xml']
	}
}
