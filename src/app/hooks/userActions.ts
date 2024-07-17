// // useUserActions.ts

// import { useCallback } from 'react'
// import { KobetuPageArticle, ArticleViewData, UserAction } from '../../../types/types'
// import { getUserId } from '@/lib/dataSync'

// export function useUserActions() {
// 	const recordArticleView = useCallback(async (article: KobetuPageArticle) => {
// 		const userId = getUserId()
// 		const articleViewData: ArticleViewData = {
// 			article_id: article.id,
// 			title: article.title,
// 			site_name: article.site_name,
// 			viewed_at: new Date().toISOString()
// 		}

// 		const userAction: UserAction = {
// 			userId,
// 			type: 'article_view',
// 			data: articleViewData
// 		}

// 		try {
// 			if (typeof window !== 'undefined' && window.dataSyncManager) {
// 				window.dataSyncManager.addArticleView(articleViewData)
// 				console.log(`記事ビューをバッファに追加しました: ${article.id} - ${article.title}`)
// 			} else {
// 				console.warn('DataSyncManagerが利用できません。直接APIを呼び出します。')
// 				const response = await fetch('/api/record-article', {
// 					method: 'POST',
// 					headers: {
// 						'Content-Type': 'application/json'
// 					},
// 					body: JSON.stringify({
// 						userId,
// 						actions: [userAction]
// 					})
// 				})

// 				if (!response.ok) {
// 					throw new Error('記事ビューの記録に失敗しました')
// 				}

// 				console.log(`記事ビューを直接記録しました: ${article.id} - ${article.title}`)
// 			}
// 		} catch (error) {
// 			console.error('記事ビューの記録中にエラーが発生しました:', error)
// 		}
// 	}, [])

// 	return { recordArticleView }
// }
