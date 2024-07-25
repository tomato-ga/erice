import React from 'react'
import { KeywordArticle } from '../../../../../types/types'
import { KeywordRelatedArticles } from './KeywordRelated'
import { RecentlyViewedArticles } from './RecentlyViewedArticle'

interface ArticleLoadProps {
	viewrireki?: boolean
	keywordarticledata?: KeywordArticle[] | null
}

const ArticleLoad: React.FC<ArticleLoadProps> = ({ viewrireki = false, keywordarticledata }) => {
	return (
		<>
			{keywordarticledata && keywordarticledata.length > 0 && (
				<KeywordRelatedArticles keywordarticledata={keywordarticledata} />
			)} */}

			{/* {viewrireki && <RecentlyViewedArticles />}
		</>
	)
}

export default ArticleLoad
