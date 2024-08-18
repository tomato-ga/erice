// /Volumes/SSD_1TB/erice2/erice/types/dmmtypes.d.ts



// package_imagesの型定義
interface PackageImages {
	large: string
	list: string
	small: string
}

export interface DmmBasePage {
	id: number
	content_id: string
	title: string
	release_date: string
	actresses: string
	package_images: PackageImages // JSON.parseされた後の型として定義
}

export interface DmmKeyword {
	id: number
	keyword: string
}

// DmmHomePageはDmmBasePageと同じ構造なので、そのまま継承します
export interface DmmHomePage extends DmmBasePage {}

// APIレスポンスの型定義（resultsのみ）
export interface DmmHomePageAPIResponse {
	results: DmmHomePage[]
}

// // // DMM API Response
// 基本的な情報項目のインターフェース
interface InfoItem {
	id: number
	name: string
	ruby?: string
}

// 画像URL用インターフェース
interface ImageURL {
	list: string
	small: string
	large: string
}

// サンプル画像URL用インターフェース
interface SampleImageURL {
	sample_s: {
		image: string[]
	}
	sample_l: {
		image: string[]
	}
}

// サンプル動画URL用インターフェース
interface SampleMovieURL {
	size_476_306: string
	size_560_360: string
	size_644_414: string
	size_720_480: string
	pc_flag: number
	sp_flag: number
}

// 価格情報用インターフェース
interface Prices {
	price: string
	listprice: string
	deliveries: {
		delivery: Array<{
			type: string
			price: string
		}>
	}
}

// 商品詳細情報用インターフェース
interface ItemInfo {
	genre?: InfoItem[]
	series?: InfoItem[]
	maker?: InfoItem[]
	actor?: InfoItem[]
	actress?: InfoItem[]
	director?: InfoItem[]
	author?: InfoItem[]
	label?: InfoItem[]
	type?: InfoItem[]
	color?: InfoItem[]
	size?: InfoItem[]
}

// CD情報用インターフェース
interface CDInfo {
	kind?: string
}

// キャンペーン情報用インターフェース
interface Campaign {
	date_begin: string
	date_end: string
	title: string
}

// メインのItemインターフェース
interface DMMItem {
	service_code: string
	service_name: string
	floor_code: string
	floor_name: string
	category_name: string
	content_id: string
	product_id: string
	title: string
	volume?: string
	number?: string
	review?: {
		count: number
		average: number
	}
	URL: string
	affiliateURL: string
	imageURL?: ImageURL
	tachiyomi?: {
		URL: string
		affiliateURL: string
	}
	sampleImageURL?: SampleImageURL
	sampleMovieURL?: SampleMovieURL
	prices?: Prices
	date?: string
	iteminfo?: ItemInfo
	cdinfo?: CDInfo
	jancode?: string
	maker_product?: string
	isbn?: string
	stock?: string
	directory?: Array<{
		id: number
		name: string
	}>
	campaign?: Campaign[]
}

// APIレスポンス全体の型
interface ApiResponse {
	items: DMMItem[]
}

interface DMMSaleItem extends Omit<DMMItem, 'imageURL' | 'genre'> {
	salecount: string
	salePrice: string
	rate: string
	actress?: string
	actress_id?: string
	genre?: string[]
	imageURL?: string
}

type DMMSaleApiResponse = DMMSaleItem[]

interface DMMSaleApiResponse extends Omit<DMMSaleItem, 'imageURL'> {
	imageURL?: ImageURL
}

// DMMItemProps型定義
export type DMMItemProps = {
	content_id: string
	affiliateURL: string
	sampleImageURL?: string[]
	imageURL?: string
	title: string
	price?: string
	actress?: string
	genre?: string[]
	salecount?: string
	salePrice?: string
}

export interface ActressItem {
	id: string
	title: string
	imageUrl: string
	price: string
}

export interface Actress {
	id: string
	name: string
	items: ActressItem[]
}

export interface NewActressResponse {
	actresses: Actress[]
}

export interface AllContentResponse {
	'dmm-debut-items': ActressItem[]
	'dmm-feature-items': ActressItem[]
	'dmm-today-new-items': ActressItem[]
	'sale-items': ActressItem[]
}

export type ActressType = 'new' | 'popular' | 'all'

// * DMM Itempage 型定義 *//

export interface DMMBaseItem {
	content_id: string
	title: string
	affiliateURL: string
	imageURL: string
	sampleImageURL?: string[] | null
	price?: string
	actress?: string
	genre?: string[]
	date?: string
}

export interface DMMSaleItem extends DMMBaseItem {
	salecount?: string
	salePrice?: string
	rate?: string
	listprice?: string
	actress_id?: number
}

// C. DMMItemProps型を再定義
export type DMMItemProps = DMMBaseItem & Partial<DMMSaleItem>

export type ItemType = 'todaynew' | 'debut' | 'feature' | 'sale' | 'actress' | 'genre'
