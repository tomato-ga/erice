import { NextRequest, NextResponse } from 'next/server'
import { D1Database } from '@cloudflare/workers-types'

// 注意: この環境変数の設定方法はプロジェクトの設定によって異なる可能性があります
const db = process.env.DB as unknown as D1Database

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const keyword = searchParams.get('keyword')
	const page = parseInt(searchParams.get('page') || '1', 10)
	const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50)

	const offset = (page - 1) * limit

	try {
		let countQuery, articlesQuery
		let queryParams: any[] = []

		if (keyword) {
			countQuery = `
        SELECT COUNT(DISTINCT a.id) as total
        FROM articles a
        JOIN article_keywords ak ON a.id = ak.article_id
        JOIN keywords k ON ak.keyword_id = k.id
        WHERE k.keyword = ?
      `
			articlesQuery = `
        SELECT a.id, a.title, a.link, a.published_at, a.description, s.name as site_name, i.url as image_url
        FROM articles a
        JOIN article_keywords ak ON a.id = ak.article_id
        JOIN keywords k ON ak.keyword_id = k.id
        JOIN sites s ON a.site_id = s.id
        LEFT JOIN images i ON a.id = i.article_id
        WHERE k.keyword = ?
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?
      `
			queryParams = [keyword, limit, offset]
		} else {
			countQuery = `SELECT COUNT(*) as total FROM articles`
			articlesQuery = `
        SELECT a.id, a.title, a.link, a.published_at, a.description, s.name as site_name, i.url as image_url
        FROM articles a
        JOIN sites s ON a.site_id = s.id
        LEFT JOIN images i ON a.id = i.article_id
        ORDER BY a.published_at DESC
        LIMIT ? OFFSET ?
      `
			queryParams = [limit, offset]
		}

		const [countResult, articles] = await Promise.all([
			db
				.prepare(countQuery)
				.bind(...queryParams.slice(0, 1))
				.first<{ total: number }>(),
			db
				.prepare(articlesQuery)
				.bind(...queryParams)
				.all()
		])

		const total = countResult?.total || 0
		const totalPages = Math.ceil(total / limit)

		return NextResponse.json(
			{
				articles: articles.results,
				total,
				totalPages,
				currentPage: page,
				keyword: keyword || null
			},
			{
				headers: {
					'Cache-Control': 'public, max-age=60, stale-while-revalidate=300'
				}
			}
		)
	} catch (error) {
		console.error('Database query error:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
