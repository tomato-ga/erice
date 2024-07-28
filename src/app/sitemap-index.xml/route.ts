// /Volumes/SSD_1TB/erice2/erice/src/app/sitemap-index.xml/route.ts

import { getTotalArticles, generateSitemapIndex } from '@/lib/sitemap'
import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const totalArticles = await getTotalArticles()
		const xml = await generateSitemapIndex(totalArticles)
		return new NextResponse(xml, {
			headers: {
				'Content-Type': 'application/xml'
			}
		})
	} catch (error) {
		console.error('Error generating sitemap index:', error)
		return new NextResponse('Error generating sitemap index', { status: 500 })
	}
}
