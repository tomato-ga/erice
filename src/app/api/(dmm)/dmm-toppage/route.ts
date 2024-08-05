import { NextRequest, NextResponse } from 'next/server'
import { DmmHomePage, PackageImages, DmmHomePageAPIResponse } from '../../../../../types/dmmtypes'

// APIの生のレスポンス型を定義
type RawApiResponse =
	| {
			id: number
			content_id: string
			title: string
			release_date: string
			actresses: string
			package_images: PackageImages | string
	  }[]
	| DmmHomePageAPIResponse

export async function GET(request: NextRequest) {
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_TOPPAGE_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	if (!WORKER_URL) {
		console.error('DMM_TOPPAGE_WORKER_URLが設定されていません')
		return NextResponse.json({ error: 'DMM_TOPPAGE_WORKER_URLが環境変数に設定されていません' }, { status: 500 })
	}

	try {
		console.log(`Fetching data from ${WORKER_URL}`)
		const response = await fetch(`${WORKER_URL}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-API-Key': API_KEY
			}
		})

		if (!response.ok) {
			console.error(`Cloudflare Worker API error: ${response.status} ${response.statusText}`)
			throw new Error(`Cloudflare Workerからのデータ取得に失敗しました: ${response.status}`)
		}

		const rawData: RawApiResponse = await response.json()
		// console.log('Raw API response:', JSON.stringify(rawData))

		let parsedData: DmmHomePage[]
		if (Array.isArray(rawData)) {
			parsedData = rawData.map(
				(item): DmmHomePage => ({
					...item,
					package_images:
						typeof item.package_images === 'string' ? JSON.parse(item.package_images) : item.package_images
				})
			)
		} else if (typeof rawData === 'object' && rawData !== null && 'results' in rawData) {
			parsedData = rawData.results.map(
				(item): DmmHomePage => ({
					...item,
					package_images:
						typeof item.package_images === 'string' ? JSON.parse(item.package_images) : item.package_images
				})
			)
		} else {
			throw new Error('APIレスポンスの形式が不正です')
		}

		// console.log('Parsed data:', JSON.stringify(parsedData.slice(0, 2))) // 最初の2項目だけログ出力

		return NextResponse.json(parsedData)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		if (error instanceof SyntaxError) {
			return NextResponse.json(
				{ error: 'JSONのパースに失敗しました', details: (error as Error).message },
				{ status: 500 }
			)
		} else if (error instanceof TypeError) {
			return NextResponse.json({ error: 'データ型が不正です', details: (error as Error).message }, { status: 500 })
		} else {
			return NextResponse.json({ error: 'サーバー内部エラー', details: (error as Error).message }, { status: 500 })
		}
	}
}
