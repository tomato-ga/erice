import { NextRequest, NextResponse } from 'next/server'
import { DMMSaleApiResponse } from '../../../../../types/dmmtypes'

/**
 * セール中の動画を取得するAPIエンドポイント
 * @route GET /api/dmm-sale-getkv
 *
 * @description
 * このエンドポイントは、DMMのセール中の動画情報を取得し、処理して返します。
 * Cloudflare WorkerのAPIを使用してデータを取得し、必要な情報を抽出して整形します。
 *
 * @returns {Promise<NextResponse>} 処理されたセール商品データを含むNextResponse
 * - 成功時: セール商品の配列（各商品は以下の情報を含む）
 *   - content_id: 商品のコンテンツID
 *   - title: 商品タイトル
 *   - affiliateURL: アフィリエイトURL
 *   - imageURL: 商品画像URL（大きいサイズまたは小さいサイズ）
 *   - salecount: 販売数
 *   - salePrice: セール価格
 *   - rate: 割引率
 *   - actress: 出演女優（カンマ区切りの文字列）
 *   - genre: ジャンル（配列）
 *   - listprice: 定価
 *   - price: 販売価格
 * - エラー時: エラーメッセージとステータスコード
 *
 * @throws {Error} API_KEYまたはWORKER_URLが設定されていない場合
 * @throws {Error} Cloudflare Workerからのデータ取得に失敗した場合
 * @throws {SyntaxError} JSONのパースに失敗した場合
 * @throws {TypeError} データ型が不正な場合
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
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
		const response = await fetch(`${WORKER_URL}/sale-items`, {
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

		const data: DMMSaleApiResponse = await response.json()

		const getImageUrl = (imageURL: unknown): string | null => {
			if (typeof imageURL === 'object' && imageURL !== null) {
				const imgUrl = imageURL as { large?: string; small?: string }
				return imgUrl.large || imgUrl.small || null
			}
			return typeof imageURL === 'string' ? imageURL : null
		}

		const processedData = data.map((item) => ({
			content_id: item.content_id,
			title: item.title,
			affiliateURL: item.affiliateURL,
			imageURL: getImageUrl(item.imageURL),
			sampleImageURL: item.sampleImageURL?.sample_l?.image ?? item.sampleImageURL?.sample_s?.image ?? null,
			salecount: item.salecount,
			salePrice: item.salePrice,
			rate: item.rate,
			actress: item.iteminfo?.actress ? item.iteminfo?.actress?.[0]?.name : null,
			actress_id: item.iteminfo?.actress?.[0]?.id || null,
			genre: item.iteminfo?.genre ? item.iteminfo?.genre.map((genre) => genre.name) : null,
			listprice: item.salecount ? item.salecount : null,
			price: item.salePrice ? item.salePrice : null,
			date: item.date,
			maker: item.iteminfo?.maker ? item.iteminfo?.maker[0]?.name : null,
			label: item.iteminfo?.label ? item.iteminfo?.label[0]?.name : null,
			series: item.iteminfo?.series ? item.iteminfo?.series[0]?.name : null,
			director: item.iteminfo?.director ? item.iteminfo?.director[0]?.name : null
		}))

		return NextResponse.json(processedData)
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
