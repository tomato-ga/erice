import { DMMActressProfile, DMMActressProfileSchema } from '@/types/APItypes'
import { NextRequest, NextResponse } from 'next/server'

type ThreeSizeAndHeight = {
	bust?: number
	waist?: number
	hip?: number
	height?: number
}

// APIエンドポイント
export async function POST(request: NextRequest): Promise<NextResponse> {
	const { threeSize }: { threeSize: ThreeSizeAndHeight } = await request.json()

	if (!threeSize) {
		return NextResponse.json({ error: 'スリーサイズのデータが必要です' }, { status: 400 })
	}

	// .env.localで設定された環境変数を使用
	const workerUrl = process.env.DMM_THREE_SIZE_WORKER_URL
	if (!workerUrl) {
		console.error('DMM_THREE_SIZE_WORKER_URL is not defined')
		return NextResponse.json({ error: 'Worker URL is not configured' }, { status: 500 })
	}

	console.log('Sending data to Worker:', JSON.stringify({ threeSize }, null, 2))

	try {
		// Workersへ転送
		const response = await fetch(`${workerUrl}/three-size`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(threeSize),
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error('Worker response error:', errorText)
			return NextResponse.json(
				{ error: `Worker returned error: ${response.status}` },
				{ status: response.status },
			)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error fetching from worker:', error)
		return NextResponse.json({ error: 'Failed to fetch data from worker' }, { status: 500 })
	}
}
