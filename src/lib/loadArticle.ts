'use server'

import { ArticleView } from './articleViewSync'

export async function syncArticleViews(views: ArticleView[]) {
	console.log('syncArticleViewsデータ確認', views)

	return { success: true, message: `Synced ${views.length}件のデータをloadしました` }
}
