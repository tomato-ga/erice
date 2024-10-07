import { DMMActressProfile, DMMActressProfileSchema } from '@/types/APItypes'
import { NextRequest, NextResponse } from 'next/server'

// 型ガード関数
function isValidApiResponse(data: unknown): data is DMMActressProfile {
	if (typeof data !== 'object' || data === null) {
		return false
	}
	if (!('actress' in data) || typeof data.actress !== 'object') {
		return false
	}
	return true
}

// APIエンドポイント
export async function GET(request: NextRequest): Promise<NextResponse> {
	const { searchParams } = new URL(request.url)
	const actressname = searchParams.get('actressname')

	if (!actressname) {
		return NextResponse.json({ error: 'actressnameパラメータが必要です' }, { status: 400 })
	}

	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_ACTRESS_PROFILE_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json(
			{ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	if (!WORKER_URL) {
		console.error('DMM_ACTRESS_PROFILE_WORKER_URLが設定されていません')
		return NextResponse.json(
			{ error: 'DMM_ACTRESS_PROFILE_WORKER_URLが環境変数に設定されていません' },
			{ status: 500 },
		)
	}

	// カンマ区切りの女優名を分割して個別にリクエスト
	const actressNames = actressname
		.split(',')
		.map(name => name.trim())
		.filter(name => name.length > 0)
	const profileFetchPromises = actressNames.map(async name => {
		const encodedName = encodeURIComponent(name)
		try {
			const response = await fetch(`${WORKER_URL}/${encodedName}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-API-Key': API_KEY,
				},
				cache: 'force-cache',
			})

			if (!response.ok) {
				console.error(`Failed to fetch profile for ${name}. Status: ${response.status}`)
				return null
			}

			const data = await response.json()

			const validationResult = DMMActressProfileSchema.safeParse(data)
			if (!validationResult.success) {
				console.warn(`Validation failed for profile data of ${name}:`, validationResult.error)
				return null
			}

			return validationResult.data
		} catch (error) {
			console.error(`Error fetching profile for ${name}:`, error)
			return null
		}
	})

	// 全てのリクエストを並列で実行し、結果を取得
	const profiles = await Promise.all(profileFetchPromises)

	// 有効なプロフィールのみをフィルタリング
	const validProfiles = profiles.filter((profile): profile is DMMActressProfile => profile !== null)

	if (validProfiles.length === 0) {
		return NextResponse.json(
			{ error: '有効な女優プロフィールが見つかりませんでした' },
			{ status: 404 },
		)
	}

	// 有効なプロフィールを返す
	return NextResponse.json({ actresses: validProfiles })
}
