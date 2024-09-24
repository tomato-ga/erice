import { combinedkeyword } from '@/app/components/dmmcomponents/Top100/AllKeywords'
import { NextResponse } from 'next/server'

const BASE_URL = 'https://erice.cloud' // 実際のベースURLに置き換えてください

export async function GET() {
	try {
		// 現在の日時を取得（ISOフォーマット）
		const lastMod = new Date().toISOString()

		// combinedkeyword を基にURLエントリを生成
		const keywordUrls = combinedkeyword
			.map(
				keyword => `
  <url>
    <loc>${BASE_URL}/keywords/${encodeURIComponent(keyword)}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`,
			)
			.join('')

		// サイトマップXMLを生成
		const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${keywordUrls}
</urlset>`

		// レスポンスとして返す
		return new NextResponse(sitemapXml, {
			status: 200,
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
			},
		})
	} catch (error) {
		console.error('Error generating sitemap:', error)
		return new NextResponse('Internal Server Error', { status: 500 })
	}
}
