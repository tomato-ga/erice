'use server'

import { headers } from 'next/headers'

export const handlePageClickCount = async (articleId: number) => {
	console.log('handleClickCount called with articleId:', articleId)

	const apiUrl = process.env.PAGECLICK_WORKER_URL
	const apiKey = process.env.D1_API_KEY

	if (!apiUrl) {
		throw new Error('PAGECLICK_WORKER_URL is not defined in environment variables')
	}

	try {
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
				// Cloudflare Workersでリクエスト元を識別するために使用
				'X-Forwarded-For': headers().get('x-forwarded-for') ?? 'unknown',
				'User-Agent': headers().get('user-agent') ?? 'unknown'
			},
			body: JSON.stringify({ articleId })
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		console.log('Click recorded successfully:', data)
		return data
	} catch (error) {
		console.error('Error recording click:', error)
		throw new Error('Failed to record click')
	}
}