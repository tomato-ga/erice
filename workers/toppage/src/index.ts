import { D1Database } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
}

interface Article {
	id: number;
	title: string;
	link: string;
	created_at: string;
	image_url: string;
	site_name: string;
}

interface QueryParams {
	page: number;
	limit: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;

const handler = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					...headers,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type',
				},
			});
		}

		if (request.method !== 'GET') {
			return new Response('Method Not Allowed', { status: 405, headers });
		}

		try {
			const { searchParams } = new URL(request.url);
			const queryParams: QueryParams = {
				page: Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE), 10)),
				limit: Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT), 10))),
			};

			const offset = (queryParams.page - 1) * queryParams.limit;

			const query = `
				SELECT 
					a.id, 
					a.title, 
					a.link, 
					a.created_at,
					i.url AS image_url,
					s.name AS site_name
				FROM 
					articles a
				INNER JOIN 
					images i ON a.id = i.article_id
				INNER JOIN
					sites s ON a.site_id = s.id
				WHERE
					i.url IS NOT NULL
				ORDER BY 
					a.created_at DESC
				LIMIT ?
				OFFSET ?
			`;

			const results = await env.DB.prepare(query).bind(queryParams.limit, offset).all<Article>();

			const totalCount = (await env.DB.prepare(
				`
				SELECT COUNT(*) as count
				FROM articles a
				INNER JOIN images i ON a.id = i.article_id
				WHERE i.url IS NOT NULL
			`
			).first('count')) as number;

			const response = {
				articles: results.results,
				pagination: {
					currentPage: queryParams.page,
					totalPages: Math.ceil(totalCount / queryParams.limit),
					totalItems: totalCount,
				},
			};

			return new Response(JSON.stringify(response), {
				status: 200,
				headers,
			});
		} catch (error) {
			console.error('Error fetching articles:', error);
			return new Response(
				JSON.stringify({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }),
				{
					status: 500,
					headers,
				}
			);
		}
	},
};

export default handler;
