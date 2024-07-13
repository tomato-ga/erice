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
	keywords: Keyword[];
}

interface Keyword {
	id: number;
	keyword: string;
}

interface RawArticleData {
	id: number;
	title: string;
	link: string;
	created_at: string;
	image_url: string;
	site_name: string;
	keyword_id: number | null;
	keyword: string | null;
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

const JSON_HEADERS = {
	...CORS_HEADERS,
	'Content-Type': 'application/json',
};

const handleOptionsRequest = (): Response => {
	return new Response(null, { headers: CORS_HEADERS });
};

const fetchArticlesByKeyword = async (env: Env, keyword: string): Promise<Article[]> => {
	const query = `
	SELECT
		a.id, 
		a.title,
		a.link,
		a.created_at,
		a.image_url,
		s.name AS site_name,
		k.id AS keyword_id, 
		k.keyword
	FROM
		articles a
	JOIN sites s ON a.site_id = s.id
	LEFT JOIN article_keywords ak ON a.id = ak.article_id
	LEFT JOIN keywords k ON ak.keyword_id = k.id
	WHERE k.keyword = ?
	`;

	try {
		const result = await env.DB.prepare(query).bind(keyword).all<RawArticleData>();

		const articlesMap: { [key: number]: Article } = {};

		result.results.forEach((row) => {
			if (!articlesMap[row.id]) {
				articlesMap[row.id] = {
					id: row.id,
					title: row.title,
					link: row.link,
					created_at: row.created_at,
					image_url: row.image_url,
					site_name: row.site_name,
					keywords: [],
				};
			}
			if (row.keyword_id && row.keyword) {
				articlesMap[row.id].keywords.push({
					id: row.keyword_id,
					keyword: row.keyword,
				});
			}
		});

		return Object.values(articlesMap);
	} catch (error) {
		console.error('Database query error:', error);
		throw new Error(`Database query failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
};

const handleGetRequest = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url);
	const keyword = url.searchParams.get('keyword');

	if (!keyword) {
		return new Response(JSON.stringify({ error: 'Missing keyword' }), { status: 400, headers: JSON_HEADERS });
	}

	try {
		const articles = await fetchArticlesByKeyword(env, keyword);

		if (articles.length === 0) {
			return new Response(JSON.stringify({ error: 'No articles found', keyword }), { status: 404, headers: JSON_HEADERS });
		}

		return new Response(JSON.stringify({ articles }), { status: 200, headers: JSON_HEADERS });
	} catch (error) {
		console.error('Error fetching articles:', error);
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				details: error instanceof Error ? error.message : 'Unknown error',
				keyword,
			}),
			{ status: 500, headers: JSON_HEADERS }
		);
	}
};

const articleHandler = {
	async fetch(request: Request, env: Env): Promise<Response> {
		try {
			if (request.method === 'OPTIONS') {
				return handleOptionsRequest();
			}

			if (request.method === 'GET') {
				return handleGetRequest(request, env);
			}

			return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: JSON_HEADERS });
		} catch (error) {
			console.error('Unhandled error:', error);
			return new Response(
				JSON.stringify({
					error: 'Internal Server Error',
					details: error instanceof Error ? error.message : 'Unknown error',
				}),
				{ status: 500, headers: JSON_HEADERS }
			);
		}
	},
};

export default articleHandler;
