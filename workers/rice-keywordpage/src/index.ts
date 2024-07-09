import { D1Database } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
	API_KEY: string;
}

interface BaseArticle {
	id: number;
	title: string;
	createdAt: string;
	updatedAt: string;
	siteId: number;
	siteUrl: string;
	siteName: string;
	imageUrl: string;
}

interface Keyword {
	id: number;
	keyword: string;
	createdAt: string;
}

interface ArticleWithKeywords extends BaseArticle {
	keywords: Keyword[];
}

interface RawArticleData extends BaseArticle {
	keywordId: number | null;
	keyword: string | null;
	keywordCreatedAt: string | null;
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

const fetchArticlesByKeyword = async (env: Env, keyword: string): Promise<ArticleWithKeywords[]> => {
	const query = `
    SELECT
      a.id, a.title,
      a.created_at AS createdAt, a.updated_at AS updatedAt,
      s.id AS siteId, s.url AS siteUrl, s.name AS siteName,
      i.url AS imageUrl,
      k.id AS keywordId, k.keyword, k.created_at AS keywordCreatedAt
    FROM
      articles a
    JOIN sites s ON a.site_id = s.id
    LEFT JOIN images i ON a.id = i.article_id
    LEFT JOIN article_keywords ak ON a.id = ak.article_id
    LEFT JOIN keywords k ON ak.keyword_id = k.id
    WHERE k.keyword = ?;
  `;

	const result = await env.DB.prepare(query).bind(keyword).all<RawArticleData>();

	const articlesMap: { [key: number]: ArticleWithKeywords } = {};

	result.results.forEach((row) => {
		if (!articlesMap[row.id]) {
			articlesMap[row.id] = {
				id: row.id,
				title: row.title,
				createdAt: row.createdAt,
				updatedAt: row.updatedAt,
				siteId: row.siteId,
				siteUrl: row.siteUrl,
				siteName: row.siteName,
				imageUrl: row.imageUrl,
				keywords: [],
			};
		}
		if (row.keywordId) {
			articlesMap[row.id].keywords.push({
				id: row.keywordId,
				keyword: row.keyword!,
				createdAt: row.keywordCreatedAt!,
			});
		}
	});

	return Object.values(articlesMap);
};

const handleGetRequest = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url);
	const keyword = url.searchParams.get('keyword');

	if (!keyword) {
		return new Response(JSON.stringify({ error: 'Missing keyword' }), { status: 400, headers: JSON_HEADERS });
	}

	const apiKey = request.headers.get('Authorization');
	if (!apiKey || apiKey !== `Bearer ${env.API_KEY}`) {
		return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: JSON_HEADERS });
	}

	try {
		const articles = await fetchArticlesByKeyword(env, keyword);

		if (articles.length === 0) {
			return new Response(JSON.stringify({ error: 'No articles found' }), { status: 404, headers: JSON_HEADERS });
		}

		return new Response(JSON.stringify({ articles }), { status: 200, headers: JSON_HEADERS });
	} catch (error) {
		console.error('Error fetching articles:', error);
		return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: JSON_HEADERS });
	}
};

const articleHandler = {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method === 'OPTIONS') {
			return handleOptionsRequest();
		}

		if (request.method === 'GET') {
			return handleGetRequest(request, env);
		}

		return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: JSON_HEADERS });
	},
};

export default articleHandler;
