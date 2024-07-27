'use client'

import React from 'react'
import { KeywordArticle } from '../../../../../types/types'
import ArticleCard from '../ArticleCard'
import Link from 'next/link'

interface KeywordRelatedArticlesProps {
	keywordarticledata: KeywordArticle[] | null
}

const KeywordRelatedArticles: React.FC<KeywordRelatedArticlesProps> = ({ keywordarticledata }) => {
	if (!keywordarticledata || keywordarticledata.length === 0) return null

	return (
		<>
			<h3 className="text-3xl font-bold text-center pt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
				この動画を見た人はこんな動画を見ています
			</h3>
			<div className="mt-1.5 p-0.5 rounded-md bg-gradient-to-b from-pink-100 to-pink-200">
				<ul>
					{keywordarticledata.map((keyarti: KeywordArticle) => (
						<li key={keyarti.id} className="p-1.5">
							<ArticleCard article={keyarti} isSmallThumbnail={true} source='Kobetu-Related' />
						</li>
					))}
				</ul>
			</div>
		</>
	)
}

export default KeywordRelatedArticles
