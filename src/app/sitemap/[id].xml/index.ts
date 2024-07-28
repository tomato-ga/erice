// /Volumes/SSD_1TB/erice2/erice/src/app/sitemap/[id].xml/route.ts

import { generateSitemap } from '@/lib/sitemap'
import { NextResponse } from 'next/server'

export default async function SitemapGet(_request: Request, { params }: { params: { id: string } }) {
	console.log('XMLを取得します')

	try {
		const id = parseInt(params.id, 10)
		if (isNaN(id)) {
			return new NextResponse('Invalid sitemap ID', { status: 400 })
		}

		const xml = await generateSitemap(id)

		console.log('xml: ', xml)

		return new NextResponse(xml, {
			headers: {
				'Content-Type': 'application/xml'
			}
		})
	} catch (error) {
		console.error(`Error generating sitemap for ID ${params.id}:`, error)
		return new NextResponse('Error generating sitemap', { status: 500 })
	}
}
