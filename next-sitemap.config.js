/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'http://localhost:3000', // 実際のサイトURLに置き換えてください
	generateRobotsTxt: true,
	exclude: ['/server-sitemap-index.xml'],
	robotsTxtOptions: {
		additionalSitemaps: ['http://localhost:3000/server-sitemap-index.xml']
	}
}
