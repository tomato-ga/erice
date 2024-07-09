export interface HomePageArticle {
	id: number
	title: string
	link: string
	created_at: string
	image_url: string
	site_name: string
}

export interface HomePageApiResponse {
	articles: HomePageArticle[]
}

export interface KobetuPageArticle {
	id: number
	title: string
	link: string
	created_at: string
	image_url: string
	site_name: string
	keywords: Keyword[]
}

export interface Keyword {
	id: number
	keyword: string
}

export interface KobetuPageApiResponse {
	articles: KobetuPageArticle[]
}
