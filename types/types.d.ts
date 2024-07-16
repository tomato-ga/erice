// 既存の型定義
export interface BaseArticle {
	id: number
	title: string
	link: string
	created_at: string
	image_url: string
	site_name: string
}

export interface Keyword {
	id: number
	keyword: string
	created_at?: string // オプショナルな追加情報
}

export interface HomePageArticle extends BaseArticle {}

export interface KobetuPageArticle extends BaseArticle {
	keywords: Keyword[]
}

export interface ApiResponse<T> {
	articles: T[]
	total_count?: number
	page_count?: number
}

export interface HomePageApiResponse extends ApiResponse<HomePageArticle> {
	totalPages: number
}
export type KobetuPageApiResponse = ApiResponse<KobetuPageArticle>

export interface SingleArticleApiResponse {
	article: KobetuPageArticle
}

export interface PaginationArticle extends BaseArticle {
	published_at: string
}

export interface PaginationArticleResponse {
	articles: PaginationArticle[]
	currentPage: number
	totalPages: number
	total: number
}

// ユーザーアクション追跡システム用の新しい型定義
export type ActionType = 'article_view' | 'keyword_view' | 'external_click'

export interface UserAction {
	userId: string
	type: ActionType
	data: ArticleViewData | KeywordViewData | ExternalClickData
}

export interface ArticleViewData {
	article_id: number
	title: string
	site_name: string
	viewed_at: string
}

export interface KeywordViewData {
	keyword_id: number
	keyword: string
	viewed_at: string
}

export interface ExternalClickData {
	article_id: number
	link: string
	clicked_at: string
}

export interface UserHistory {
	article_views: ArticleViewData[]
	keyword_views: KeywordViewData[]
	external_clicks: ExternalClickData[]
}
