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
	pagination: {
		currentPage: number
		totalPages: number
		totalItems: number
	}
}
