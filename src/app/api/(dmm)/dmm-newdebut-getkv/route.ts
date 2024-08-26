import { NextRequest, NextResponse } from 'next/server'
import { DMMNewDebutApiResponse, DMMNewDebutApiResponseSchema, ProcessedDMMItem } from '@/types/APINewDebuttypes'

// エラーレスポンスの型を定義
type ErrorResponse = {
	error: string
	details?: string
}

// 成功時とエラー時の両方をカバーする型を定義
type ApiResponse = ProcessedDMMItem[] | ErrorResponse

// 動画URLを取得する関数
const getBestMovieURL = (sampleMovieData: string): string => {
	try {
		const parsedData = JSON.parse(sampleMovieData)
		const sizePriority = ['size_720_480', 'size_644_414', 'size_560_360', 'size_476_306']

		for (const size of sizePriority) {
			if (parsedData[size]) {
				return parsedData[size]
			}
		}

		return '' // undefinedの代わりに空文字列を返す
	} catch (error) {
		console.error('動画URLの解析に失敗しました:', error)
		return '' // エラー時も空文字列を返す
	}
}

const getImageUrl = (imageURL: unknown): string | null => {
	if (typeof imageURL === 'object' && imageURL !== null) {
		const imgUrl = imageURL as { large?: string; small?: string }
		return imgUrl.large || imgUrl.small || null
	}
	return typeof imageURL === 'string' ? imageURL : null
}

/**
 * 新人デビュー作品を取得するAPIエンドポイント
 * @route GET /api/dmm-newdebut-getkv
 *
 * @description
 * このエンドポイントは、DMMの新人デビュー作品情報を取得し、処理して返します。
 * Cloudflare WorkerのAPIを使用してデータを取得し、必要な情報を抽出して整形します。
 *
 * @returns {Promise<NextResponse>} 処理された新人デビュー作品データを含むNextResponse
 * - 成功時: 新人デビュー作品の配列（各作品は以下の情報を含む）
 *   - content_id: 作品のコンテンツID
 *   - title: 作品タイトル
 *   - affiliateURL: アフィリエイトURL
 *   - imageURL: 作品画像URL（大きいサイズまたは小さいサイズ）
 *   - sampleImageURL: サンプル画像URL
 *   - sampleMovieURL: サンプル動画URL（配列）
 *   - actress: 出演女優（名前）
 *   - actress_id: 出演女優ID
 *   - genre: ジャンル（配列）
 *   - date: 発売日
 *   - maker: メーカー名
 *   - label: レーベル名
 *   - series: シリーズ名
 *   - director: 監督名
 *   - db_id: データベースID
 * - エラー時: エラーメッセージとステータスコード
 *
 * @throws {Error} API_KEYまたはWORKER_URLが設定されていない場合
 * @throws {Error} Cloudflare Workerからのデータ取得に失敗した場合
 * @throws {Error} 受信したデータが期待される形式でない場合
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse>> {
	const API_KEY = process.env.CLOUDFLARE_DMM_API_TOKEN
	const WORKER_URL = process.env.DMM_NEWDEBUT_WORKER_URL

	if (!API_KEY) {
		console.error('CLOUDFLARE_DMM_API_TOKENが設定されていません')
		return NextResponse.json({ error: 'CLOUDFLARE_DMM_API_TOKENが環境変数に設定されていません' }, { status: 500 })
	}

	if (!WORKER_URL) {
		console.error('DMM_NEWDEBUT_WORKER_URLが設定されていません')
		return NextResponse.json({ error: 'DMM_NEWDEBUT_WORKER_URLが環境変数に設定されていません' }, { status: 500 })
	}

	try {
		console.log(`Fetching data from ${WORKER_URL}`)
		const response = await fetch(WORKER_URL, {
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

		const rawData = await response.json()
		const parseResult = DMMNewDebutApiResponseSchema.safeParse(rawData)

		if (!parseResult.success) {
			console.error('受信したデータが期待される形式ではありません:', parseResult.error)
			throw new Error('受信したデータが期待される形式ではありません')
		}

		const data: DMMNewDebutApiResponse = parseResult.data

		const processedData: ProcessedDMMItem[] = data.result.items.map((item) => ({
			content_id: item.content_id,
			title: item.title,
			affiliateURL: item.affiliateURL,
			imageURL: item.imageURL ? getImageUrl(item.imageURL) : null,
			sampleImageURL: item.sampleImageURL?.sample_l?.image ?? item.sampleImageURL?.sample_s?.image ?? null,
			sampleMovieURL: item.sampleMovieURL ? [getBestMovieURL(JSON.stringify(item.sampleMovieURL))] : [],
			actress: item.iteminfo?.actress?.[0]?.name ?? null,
			actress_id: item.iteminfo?.actress?.[0]?.id ?? null,
			genre: item.iteminfo?.genre?.map((genre) => genre.name) ?? null,
			date: item.date ?? null,
			maker: item.iteminfo?.maker?.[0]?.name ?? null,
			label: item.iteminfo?.label?.[0]?.name ?? null,
			series: item.iteminfo?.series?.[0]?.name ?? null,
			director: item.iteminfo?.director?.[0]?.name ?? null,
			db_id: item.db_id ?? null
		}))

		return NextResponse.json(processedData)
	} catch (error) {
		console.error('APIルートでエラーが発生しました:', error)
		return NextResponse.json(
			{ error: 'サーバー内部エラー', details: error instanceof Error ? error.message : String(error) },
			{ status: 500 }
		)
	}
}
