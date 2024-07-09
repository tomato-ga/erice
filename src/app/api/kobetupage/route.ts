import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams
	const postid = searchParams.get('postId')

	try {
		const res = await fetch(`https://rice-kobetupage.servicedake.workers.dev/articles/${postid}`)
		const data = await res.json()
		console.log('API Response:', data) // ここでレスポンスをログに出力
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch posts:', error)
		return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
	}
}
