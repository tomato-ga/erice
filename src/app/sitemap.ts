// /Volumes/SSD_1TB/erice2/erice/src/app/sitemap.ts

import { MetadataRoute } from 'next'
import { getTotalArticles } from '@/lib/sitemap'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://erice.cloud'
const ARTICLES_PER_SITEMAP = 10000

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const totalArticles = await getTotalArticles()
	const sitemapCount = Math.ceil(totalArticles / ARTICLES_PER_SITEMAP)

	console.log(`Generating sitemap index. Total articles: ${totalArticles}, Sitemap count: ${sitemapCount}`)

	const sitemapEntries: MetadataRoute.Sitemap = Array.from({ length: sitemapCount }, (_, i) => ({
		url: `${BASE_URL}/sitemap/${i}.xml`,
		lastModified: new Date()
	}))

	// Add the home page
	sitemapEntries.push({
		url: BASE_URL,
		lastModified: new Date()
	})

	return sitemapEntries
}
