// 基本的な記事情報を含む共通インターフェース
export interface BaseArticle {
	id: number
	title: string
	link: string
	created_at: string
	image_url: string
	site_name: string
}

// キーワード情報
export interface Keyword {
	id: number
	keyword: string
	created_at?: string // オプショナルな追加情報
}

// ホームページ用の記事インターフェース
export interface HomePageArticle extends BaseArticle {}

// 個別ページ用の記事インターフェース
export interface KobetuPageArticle extends BaseArticle {
	keywords: Keyword[]
}

// APIレスポンスの型定義
export interface ApiResponse<T> {
	articles: T[]
	total_count?: number
	page_count?: number
}

// 各ページ用のAPIレスポンス型
export type HomePageApiResponse = ApiResponse<HomePageArticle>
export type KobetuPageApiResponse = ApiResponse<KobetuPageArticle>

// 単一記事取得用のAPIレスポンス型
export interface SingleArticleApiResponse {
	article: KobetuPageArticle
}

// PaginationArticle型を修正
export interface PaginationArticle extends BaseArticle {
	published_at: string
}

// PaginationArticleResponse型を修正
export interface PaginationArticleResponse {
	articles: PaginationArticle[]
	currentPage: number
	totalPages: number
	total: number
}
