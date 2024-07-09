import React from 'react'
import { getArticlesByKeyword } from '@/app/components/GetArticlesByKeyword'
import ArticleList from '@/app/components/Article/ArticleList'
import { HomePageArticle } from '../../../../../types/types'

interface KeywordPageProps {
	params: { keyword: string }
}

export const revalidate = 60 // ISR (Incremental Static Regeneration) のためのオプション

const KeywordPage: React.FC<KeywordPageProps> = async ({ params }) => {
	const decodedKeyword = decodeURIComponent(params.keyword)
	const { articles } = await getArticlesByKeyword(decodedKeyword)

	return (
		<div className="min-h-screen bg-white">
			<div className="container mx-auto px-4 py-8">
				<h1 className="text-3xl font-bold text-center mb-8">Articles for: {decodedKeyword}</h1>
				<ArticleList articles={articles} />
			</div>
		</div>
	)
}

export default KeywordPage
