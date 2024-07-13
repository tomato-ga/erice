import { D1Database, D1Result } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
}

// 基本的な記事情報
interface BaseArticle {
	id: number;
	title: string;
	link: string;
	published_at: string;
	created_at: string;
	updated_at: string;
	site_id: number;
	site_url: string;
	site_name: string;
	image_url: string;
}

// キーワード情報
interface Keyword {
	id: number;
	keyword: string;
	created_at: string;
}

// 整形された記事データ（キーワードを含む）
interface ArticleWithKeywords extends BaseArticle {
	keywords: Keyword[];
}

// データベースから取得した生のデータ
interface RawArticleData extends BaseArticle {
	keyword_id: number | null;
	keyword: string | null;
	keyword_created_at: string | null;
}

const CORS_HEADERS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
};

const JSON_HEADERS = {
	...CORS_HEADERS,
	'Content-Type': 'application/json',
};

const handleOptionsRequest = (): Response => {
	return new Response(null, { headers: CORS_HEADERS });
};

const fetchArticleWithKeywords = async (env: Env, id: number): Promise<ArticleWithKeywords | null> => {
	const query = `
		SELECT
		a.id, a.title, a.link, a.published_at, a.created_at, a.updated_at, a.image_url,
		s.id AS site_id, s.url AS site_url, s.name AS site_name,
		k.id AS keyword_id, k.keyword, k.created_at AS keyword_created_at
		FROM
		articles a
		JOIN sites s ON a.site_id = s.id
		LEFT JOIN article_keywords ak ON a.id = ak.article_id
		LEFT JOIN keywords k ON ak.keyword_id = k.id
		WHERE a.id = ?
		`;

	const result = await env.DB.prepare(query).bind(id).all<RawArticleData>();

	if (!result.results.length) {
		return null;
	}

	const articleData = result.results[0];
	const keywords: Keyword[] = [];

	const keywordMap = new Map<number, Keyword>();
	result.results.forEach((row) => {
		if (row.keyword_id !== null && row.keyword !== null && row.keyword_created_at !== null && !keywordMap.has(row.keyword_id)) {
			keywordMap.set(row.keyword_id, {
				id: row.keyword_id,
				keyword: row.keyword,
				created_at: row.keyword_created_at,
			});
		}
	});

	keywordMap.forEach((value) => keywords.push(value));

	const article: ArticleWithKeywords = {
		id: articleData.id,
		title: articleData.title,
		link: articleData.link,
		published_at: articleData.published_at,
		created_at: articleData.created_at,
		updated_at: articleData.updated_at,
		site_id: articleData.site_id,
		site_url: articleData.site_url,
		site_name: articleData.site_name,
		image_url: articleData.image_url,
		keywords: keywords,
	};

	return article;
};

const extractIdFromPath = (path: string): number | null => {
	const match = path.match(/^\/articles\/(\d+)$/);
	return match ? Number(match[1]) : null;
};

const handleGetRequest = async (request: Request, env: Env): Promise<Response> => {
	const url = new URL(request.url);
	const id = extractIdFromPath(url.pathname);

	if (id === null) {
		return new Response('Bad Request: Invalid ID', { status: 400, headers: JSON_HEADERS });
	}

	try {
		const article = await fetchArticleWithKeywords(env, id);

		if (!article) {
			return new Response('Not Found', { status: 404, headers: JSON_HEADERS });
		}

		return new Response(JSON.stringify({ article }), { status: 200, headers: JSON_HEADERS });
	} catch (error) {
		console.error('Error fetching article:', error);
		return new Response(
			JSON.stringify({
				error: 'Internal Server Error',
				details: error instanceof Error ? error.message : 'Unknown error',
			}),
			{ status: 500, headers: JSON_HEADERS }
		);
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

		return new Response('Method Not Allowed', { status: 405, headers: JSON_HEADERS });
	},
};

export default articleHandler;
