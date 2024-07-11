import { D1Database } from '@cloudflare/workers-types';

interface Env {
	DB: D1Database;
	API_KEY: string;
}

const handler = {
	async fetch(request: Request, env: Env): Promise<Response> {
		const apiKey = request.headers.get('Authorization');

		if (!apiKey || apiKey !== `Bearer ${env.API_KEY}`) {
			return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
		}

		try {
			const keywords = await getPopularKeywords(env.DB);
			return new Response(JSON.stringify(keywords), {
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (error) {
			console.error('Error fetching keywords:', error);
			return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
				status: 500,
				headers: { 'Content-Type': 'application/json' },
			});
		}
	},
};

async function getPopularKeywords(db: D1Database): Promise<string[]> {
	try {
		const result = await db
			.prepare(
				`
		SELECT DISTINCT k.keyword
		FROM keywords k
		JOIN article_keywords ak ON k.id = ak.keyword_id
		GROUP BY k.keyword
		ORDER BY COUNT(ak.article_id) DESC
		LIMIT 50
	  `
			)
			.all();

		if (result.error) {
			console.error('Database error:', result.error);
			throw new Error(`Failed to fetch popular keywords: ${result.error}`);
		}

		console.log('Query results:', result.results);
		return result.results.map((row: any) => row.keyword) as string[];
	} catch (error) {
		console.error('Query execution error:', error);
		throw error;
	}
}

export default handler;
