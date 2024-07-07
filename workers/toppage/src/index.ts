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
				LIMIT 50
			`;

			const results = await env.DB.prepare(query).all<Article>();

			return new Response(JSON.stringify({ articles: results.results }), {
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
