import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const postid = searchParams.get('postId')

	if (!postid) {
		return NextResponse.json({ error: 'PostId is required' }, { status: 400 })
	}

	try {
		const apiUrl = `https://rice-kobetupage.servicedake.workers.dev/articles/${postid}`
		console.log('Fetching from:', apiUrl)

		const res = await fetch(apiUrl)
		console.log('API Response Status:', res.status)

		if (!res.ok) {
			const errorText = await res.text()
			console.error('API Error Response:', errorText)
			return NextResponse.json({ error: `API responded with status ${res.status}` }, { status: res.status })
		}

		const contentType = res.headers.get('content-type')
		if (!contentType || !contentType.includes('application/json')) {
			const text = await res.text()
			console.error('Unexpected content type:', contentType)
			console.error('Response text:', text)
			return NextResponse.json({ error: 'API did not return JSON' }, { status: 500 })
		}

		const data = await res.json()
		console.log('API Response Data:', data)
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch posts:', error)
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
