import { NextResponse } from 'next/server'

export async function GET() {
	try {
		const res = await fetch('https://toppage.servicedake.workers.dev/')
		const data = await res.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Failed to fetch posts:', error)
		return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
	}
}
