import ArticleList from '@/components/ArticleList'
import { fetchArticles } from '@/lib/api'
import { Metadata } from 'next'

interface Props {
	params: { keyword: string }
	searchParams: { page?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { keyword } = params
	return {
		title: `Articles about "${keyword}"`,
		description: `Browse articles related to ${keyword}`
	}
}

export default async function KeywordPage({ params, searchParams }: Props) {
	const { keyword } = params
	const page = parseInt(searchParams.page || '1', 10)
	const articlesData = await fetchArticles(keyword, page)

	return (
		<div className="container mx-auto px-4">
			<h1 className="text-3xl font-bold my-4">Articles about &quot;{keyword}&quot;</h1>
			<p className="mb-4">Total articles: {articlesData.total}</p>
			<ArticleList initialData={articlesData} keyword={keyword} page={page} />
		</div>
	)
}

// MEMO 2024/07/09まで動作
// import React from 'react'
// import { getArticlesByKeyword } from '@/app/components/GetArticlesByKeyword'
// import ArticleList from '@/app/components/Article/ArticleList'
// import { HomePageArticle } from '../../../../../types/types'

// interface KeywordPageProps {
// 	params: { keyword: string }
// }

// export const revalidate = 60 // ISR (Incremental Static Regeneration) のためのオプション

// const KeywordPage: React.FC<KeywordPageProps> = async ({ params }) => {
// 	const decodedKeyword = decodeURIComponent(params.keyword)
// 	const { articles } = await getArticlesByKeyword(decodedKeyword)

// 	return (
// 		<div className="min-h-screen bg-white">
// 			<div className="container mx-auto px-4 py-8">
// 				<h1 className="text-3xl font-bold text-center mb-8">Articles for: {decodedKeyword}</h1>
// 				<ArticleList articles={articles} />
// 			</div>
// 		</div>
// 	)
// }

// export default KeywordPage
