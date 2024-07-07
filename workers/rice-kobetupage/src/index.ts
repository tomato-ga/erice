import { D1Database } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
}

// 基本的な記事情報
interface BaseArticle {
	id: number;
	title: string;
	link: string;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
	siteId: number;
	siteUrl: string;
	siteName: string;
	imageUrl: string;
}

// キーワード情報
interface Keyword {
	id: number;
	keyword: string;
	createdAt: string;
}

// 整形された記事データ（キーワードを含む）
interface ArticleWithKeywords extends BaseArticle {
	keywords: Keyword[];
}

// データベースから取得した生のデータ
interface RawArticleData extends BaseArticle {
	keywordId: number | null;
	keyword: string | null;
	keywordCreatedAt: string | null;
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
      a.id, a.title, a.link, a.published_at AS publishedAt,
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
    WHERE a.id = ?;
  `;

	const result = await env.DB.prepare(query).bind(id).all<RawArticleData>();

	if (!result.results.length) {
		return null;
	}

	const articleData = result.results[0];
	const keywords: Keyword[] = result.results
		.filter((row) => row.keywordId !== null)
		.map((row) => ({
			id: row.keywordId!,
			keyword: row.keyword!,
			createdAt: row.keywordCreatedAt!,
		}));

	const article: ArticleWithKeywords = {
		id: articleData.id,
		title: articleData.title,
		link: articleData.link,
		publishedAt: articleData.publishedAt,
		createdAt: articleData.createdAt,
		updatedAt: articleData.updatedAt,
		siteId: articleData.siteId,
		siteUrl: articleData.siteUrl,
		siteName: articleData.siteName,
		imageUrl: articleData.imageUrl,
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
