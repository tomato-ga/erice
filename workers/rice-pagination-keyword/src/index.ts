import { D1Database } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
	API_KEY: string; // 環境変数としてAPI_KEYを追加
}

interface CountResult {
	total: number;
}

interface Article {
	id: number;
	title: string;
	link: string;
	published_at: string;
	image_url: string | null;
}

const worker = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const keyword = url.searchParams.get('keyword');
		const page = parseInt(url.searchParams.get('page') || '1', 10);
		const pageSize = parseInt(url.searchParams.get('limit') || '10', 10); // 1ページあたりの記事数を動的に設定

		// APIキーを検証
		const apiKey = request.headers.get('Authorization');
		if (!apiKey || apiKey !== `Bearer ${env.API_KEY}`) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
		}

		if (!keyword) {
			return new Response(
				JSON.stringify({
					articles: [],
					currentPage: page,
					totalPages: 0,
					totalArticles: 0,
				}),
				{
					headers: { 'Content-Type': 'application/json' },
				}
			);
		}

		try {
			const offset = (page - 1) * pageSize;
			const articles = await getArticles(env.DB, keyword, pageSize, offset);
			const totalArticles = await getTotalArticles(env.DB, keyword);

			const totalPages = Math.ceil(totalArticles / pageSize);

			return new Response(
				JSON.stringify({
					articles: articles,
					currentPage: page,
					totalPages: totalPages,
					totalArticles: totalArticles,
				}),
				{
					headers: { 'Content-Type': 'application/json' },
				}
			);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error';
			console.error('Fetch Error:', errorMessage);
			return new Response(JSON.stringify({ error: 'Internal Server Error', details: errorMessage }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	},
};

async function getArticles(db: D1Database, keyword: string | null, pageSize: number, offset: number): Promise<Article[]> {
	if (!keyword) {
		return [];
	}

	let query = `
		SELECT a.id, a.title, a.created_at, a.image_url
		FROM articles a
		WHERE a.id IN (
			SELECT ak.article_id
			FROM article_keywords ak
			JOIN keywords k ON ak.keyword_id = k.id
			WHERE k.keyword = ?
		)
		ORDER BY a.created_at DESC
		LIMIT ? OFFSET ?
	`;

	const params: any[] = [keyword, pageSize, offset];

	try {
		console.log('Executing query:', query, 'with params:', params); // 確認用ログ
		const result = await db
			.prepare(query)
			.bind(...params)
			.all<Article>();
		if (result.results) {
			console.log('Query results:', result.results); // 確認用ログ
			return result.results;
		} else {
			throw new Error('No articles found');
		}
	} catch (error) {
		console.error('Query Error:', error);
		throw new Error('Failed to fetch articles');
	}
}

async function getTotalArticles(db: D1Database, keyword: string | null): Promise<number> {
	if (!keyword) {
		return 0;
	}

	let countQuery = `
        SELECT COUNT(*) as total 
        FROM articles 
        WHERE id IN (
            SELECT ak.article_id
            FROM article_keywords ak
            JOIN keywords k ON ak.keyword_id = k.id
            WHERE k.keyword = ?
        )
    `;
	const params: any[] = [keyword];

	try {
		const result = await db
			.prepare(countQuery)
			.bind(...params)
			.first<CountResult>();
		if (result) {
			return result.total;
		} else {
			throw new Error('Failed to get total count');
		}
	} catch (error) {
		console.error('Count Query Error:', error);
		throw new Error('Failed to fetch total articles count');
	}
}

export default worker;
