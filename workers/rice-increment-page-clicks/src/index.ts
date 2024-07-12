interface Env {
	DB: D1Database;
	API_KEY: string;
}

interface IncrementPageClicksRequest {
	articleId: number;
}

class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ValidationError';
	}
}

class DatabaseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'DatabaseError';
	}
}

function parseAndValidateRequest(json: string): IncrementPageClicksRequest {
	let data: unknown;
	try {
		data = JSON.parse(json);
	} catch {
		throw new ValidationError('Invalid JSON format');
	}

	if (typeof data !== 'object' || data === null) {
		throw new ValidationError('Request body must be an object');
	}

	if (!('articleId' in data)) {
		throw new ValidationError('articleId is required');
	}

	const { articleId } = data as { articleId: unknown };

	if (typeof articleId !== 'number' || !Number.isInteger(articleId) || articleId <= 0) {
		throw new ValidationError('articleId must be a positive integer');
	}

	return { articleId };
}

async function incrementPageClicks(db: D1Database, articleId: number): Promise<void> {
	const result = await db
		.prepare('UPDATE articles SET page_clicks = page_clicks + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
		.bind(articleId)
		.run();

	if (!result.success) {
		throw new DatabaseError('Failed to update page clicks');
	}

	if (result.meta.changes === 0) {
		throw new DatabaseError('Article not found');
	}
}

function handleError(error: unknown): Response {
	console.error('Error processing request:', error);

	if (error instanceof ValidationError) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (error instanceof DatabaseError) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: error.message === 'Article not found' ? 404 : 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
		status: 500,
		headers: { 'Content-Type': 'application/json' },
	});
}

const worker = {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method Not Allowed', { status: 405 });
		}

		const authHeader = request.headers.get('Authorization');
		if (authHeader !== `Bearer ${env.API_KEY}`) {
			return new Response('Unauthorized', { status: 401 });
		}

		try {
			const requestBody = await request.text();
			const { articleId } = parseAndValidateRequest(requestBody);

			await incrementPageClicks(env.DB, articleId);

			return new Response(JSON.stringify({ success: true, message: 'Page clicks incremented successfully' }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		} catch (error) {
			return handleError(error);
		}
	},
};

export default worker;
