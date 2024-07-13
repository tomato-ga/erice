import { D1Database } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
	API_KEY: string;
}

interface Article {
	id: number;
	title: string;
	link: string;
	created_at: string;
	image_url: string;
	site_name: string;
}

interface ApiResponse<T> {
	articles: T[];
	total_count?: number;
	page_count?: number;
}

interface HomePageApiResponse extends ApiResponse<Article> {
	totalPages: number;
}

const handler = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const page = parseInt(url.searchParams.get('page') || '1', 10);
		const limit = parseInt(url.searchParams.get('limit') || '10', 10);
		const apiKey = request.headers.get('Authorization');

		if (!apiKey || apiKey !== `Bearer ${env.API_KEY}`) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
		}

		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		};

		if (request.method === 'OPTIONS') {
			return new Response(null, {
				headers: {
					...headers,
					'Access-Control-Allow-Methods': 'GET, OPTIONS',
					'Access-Control-Allow-Headers': 'Content-Type, Authorization',
				},
			});
		}

		if (request.method !== 'GET') {
			return new Response('Method Not Allowed', { status: 405, headers });
		}

		try {
			const offset = (page - 1) * limit;
			const query = `
                SELECT 
                    a.id, 
                    a.title, 
                    a.link, 
                    a.created_at,
                    a.image_url,
                    s.name AS site_name
                FROM 
                    articles a
                INNER JOIN
                    sites s ON a.site_id = s.id
                WHERE
                    a.image_url IS NOT NULL
                ORDER BY 
                    a.created_at DESC
                LIMIT ? OFFSET ?
            `;
			const results = await env.DB.prepare(query).bind(limit, offset).all<Article>();
			const countQuery = `SELECT COUNT(*) as total FROM articles WHERE image_url IS NOT NULL`;
			const countResult = await env.DB.prepare(countQuery).first<{ total: number } | null>();

			if (!countResult) {
				return new Response(JSON.stringify({ error: 'No articles found' }), { status: 404, headers });
			}

			const totalPages = Math.ceil(countResult.total / limit);

			const response: HomePageApiResponse = {
				articles: results.results,
				totalPages,
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
