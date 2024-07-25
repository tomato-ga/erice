/**
 * ArticleCard コンポーネント
 * 
 * このコンポーネントは、記事のカード表示を行います。ホームページや関連記事一覧で使用されます。
 * 
 * @component
 * @param {Object} props - コンポーネントのプロパティ
 * @param {HomePageArticle | RelatedArticle} props.article - 表示する記事の情報
 * @param {boolean} [props.isSmallThumbnail=false] - サムネイルを小さく表示するかどうか
 * 
 * @example
 * <ArticleCard article={articleData} isSmallThumbnail={true} />
 * 
 * 主な機能:
 * - 記事のサムネイル画像、タイトル、作成日を表示
 * - クリック時のイベント処理（Umamiトラッキング、クリックカウント）
 * - レスポンシブなレイアウト（通常サイズと小さいサイズのサムネイル）
 * 
 * 注意事項:
 * - このコンポーネントはクライアントサイドでレンダリングされます（'use client'ディレクティブ）
 * - クリック時に短いディレイ（100ms）を挟んでナビゲーションを行います
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { HomePageArticle, RelatedArticle } from '../../../../../types/types'
import { handlePageClickCount } from '../../handleclick'

interface ArticleCardProps {
	article: HomePageArticle | RelatedArticle
	isSmallThumbnail?: boolean
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, isSmallThumbnail = false }) => {
	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		e.preventDefault() // デフォルトの動作を防止

		// Umamiトラッキングの明示的な呼び出し
		if (typeof window !== 'undefined' && window.umami) {
			window.umami.track('Article Click', {
				article_id: article.id,
				article_title: article.title
			})
		}

		// クリックカウントの処理
		handlePageClickCount(article.id).catch((error) => console.error('Failed to record click:', error))

		// 短いタイムアウト後にナビゲーションを実行
		setTimeout(() => {
			window.location.href = `/post/${article.id}`
		}, 100)
	}

	return (
		<div
			onClick={handleClick}
			data-umami-event="Article Click"
			data-umami-event-article-id={article.id}
			data-umami-event-article-title={article.title}
		>
			<Link href={`/post/${article.id}`} className="block h-full" prefetch={false}>
				<div
					className={`bg-white rounded-lg shadow-md overflow-hidden h-full flex ${
						isSmallThumbnail ? 'flex-row' : 'flex-col'
					}`}
				>
					<div className={`relative ${isSmallThumbnail ? 'w-1/3' : 'pb-[56.25%]'}`}>
						<img
							src={article.image_url}
							alt={article.title}
							className={`${
								isSmallThumbnail ? 'object-cover w-full h-full' : 'absolute inset-0 w-full h-full object-cover'
							}`}
						/>
					</div>
					<div className={`p-4 flex-grow ${isSmallThumbnail ? 'w-2/3' : ''}`}>
						<h2 className={`mb-2 line-clamp-2 text-lg`}>{article.title}</h2>
						<p className="text-sm text-gray-600">{new Date(article.created_at).toLocaleDateString()}</p>
					</div>
				</div>
			</Link>
		</div>
	)
}

export default ArticleCard
