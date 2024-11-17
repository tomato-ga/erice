// /Volumes/SSD_1TB/erice2/erice/src/app/(pages)/[itemType]/page.tsx

export const dynamic = 'force-dynamic'

import DMMFeaturedItemContainer from '@/app/components/dmmcomponents/DMMFeaturedItemContainer'
import DMMItemContainer from '@/app/components/dmmcomponents/DMMItemContainer'
import { ItemType } from '@/types/dmmtypes'
import { Metadata } from 'next'

const metaTitleMap: Record<ItemType, string> = {
	sale: '今日のセール',
	todaynew: '今日発売の最新アダルト動画一覧',
	debut: '3ヶ月以内に発売されるデビュー作品一覧',
	feature: 'これから発売される注目作品一覧',
	last7days: '過去1週間以内に発売された新作アダルト動画一覧',
	top100: `人気キーワードで選ばれたトップ100のアイテムを一挙公開！${new Date().toLocaleDateString()}時点の最新ランキングをチェックしてみよう！`,
	actress: 'アクトレス一覧',
	genre: 'ジャンル一覧',
}

const metaDescriptionMap: Record<ItemType, string> = {
	sale: `本日のお得なセール中のアダルト動画を厳選ピックアップ！最新の割引情報を${new Date().toLocaleDateString()}時点でお届けします。`,
	todaynew: `本日(${new Date().toLocaleDateString()})発売の最新アダルト動画をチェックできます。新作のアダルト動画情報を毎日更新しています。`,
	debut: `3ヶ月以内に発売される新人セクシー女優のデビュー作品一覧をチェックできます。${new Date().toLocaleDateString()}現在の最新デビュー作を厳選してご紹介します。`,
	feature: `これから発売される人気女優のアダルト動画を厳選してご紹介します。${new Date().toLocaleDateString()}時点でのおすすめ作品をぜひチェックしてください。`,
	last7days: `過去1週間以内にDMMで発売された新作アダルト動画をすべてご紹介しています。${new Date().toLocaleDateString()}時点の最新情報です。`,
	top100: `人気キーワードから選ばれたトップ100作品を一挙公開！${new Date().toLocaleDateString()}時点のランキングをお見逃しなく。`,
	actress: 'アクトレス一覧はこちらからチェック！',
	genre: 'ジャンル一覧を簡単に確認！',
}

export async function generateMetadata({
	params,
}: {
	params: { itemType: string }
}): Promise<Metadata> {
	const itemType = params.itemType as ItemType

	return {
		title: metaTitleMap[itemType],
		description: metaDescriptionMap[itemType] || 'DMMの人気アイテムをチェック！',
	}
}

export default function DMMGenericPage({ params }: { params: { itemType: string } }) {
	const itemType = params.itemType as ItemType

	console.log('params:', params) // 取得されたパラメータを確認
	console.log('itemType: ', itemType) // 削除

	const gradients: Record<ItemType, { bg: string; text: string }> = {
		todaynew: { bg: 'from-green-50 to-blue-50', text: 'from-green-500 to-blue-500' },
		debut: { bg: 'from-yellow-50 to-red-50', text: 'from-yellow-500 to-red-500' },
		feature: { bg: 'from-pink-50 to-purple-50', text: 'from-pink-500 to-purple-500' },
		sale: { bg: 'from-blue-50 to-purple-50', text: 'from-blue-500 to-purple-500' },
		actress: { bg: 'from-blue-50 to-purple-50', text: 'from-red-500 to-blue-500' },
		genre: { bg: 'from-blue-50 to-purple-50', text: 'from-red-500 to-blue-500' },
		last7days: { bg: 'from-emerald-50 to-yellow-50', text: 'from-emerald-500 to-yellow-500' }, // Updated gradient
		top100: { bg: 'from-purple-50 to-pink-50', text: 'from-purple-500 to-pink-500' },
	}
	// 説明文の取得
	const description = metaDescriptionMap[itemType]
	console.log('description:', description)

	if (!Object.keys(metaTitleMap).includes(itemType)) {
		return (
			<div className='container mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold text-red-600 text-center mb-4'>無効な itemType です</h1>
				<p className='text-center'>
					有効な itemType は `todaynew`, `debut`, `feature`, `sale`, `top100` です。
				</p>
			</div>
		)
	}

	// top100 ページ用の処理を追加
	if (itemType === 'top100') {
		return (
			<div className='w-full'>
				<DMMFeaturedItemContainer
					from='top100'
					bgGradient={'bg-gradient-to-r ' + gradients[itemType].bg}
					endpoint='/api/getkv-top100?keywords=くびれ,爆乳'
					title={metaTitleMap[itemType]}
					linkText='すべて見る'
					linkHref='/top100'
					textGradient={gradients[itemType].text}
					umamifrom={'only-' + itemType}
					description={description}
				/>
			</div>
		)
	}

	// その他のページ用の既存の処理
	return (
		<>
			<div className='w-full'>
				<DMMFeaturedItemContainer
					from='only'
					bgGradient={`bg-gradient-to-r ${gradients[itemType].bg}`}
					endpoint={`/api/dmm-${itemType}-getkv`}
					title={metaTitleMap[itemType]}
					linkText='すべて見る'
					linkHref={`/${itemType}` as '/sale' | '/todaynew' | '/debut' | '/feature' | '/last7days'}
					textGradient={gradients[itemType].text}
					umamifrom={`only-${itemType}`}
					description={description}
				/>
			</div>
		</>
	)
}
