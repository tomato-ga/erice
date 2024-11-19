import { DoujinItemType } from '@/_types_doujin/doujintypes'
import DMMDoujinFeaturedItemContainer from '@/app/components/doujincomponents/DMMDoujinFeaturedItemContainer'
import { DMMDoujinFeaturedItemType } from '@/types/umamiTypes'
import { Metadata } from 'next'

const metaTitleMap: Record<DoujinItemType, string> = {
	sale: '今日のセール',
	todaynew: '今日発売の最新アダルト動画一覧',
	feature: 'これから発売される注目作品一覧',
	last7days: '過去1週間以内に発売された新作アダルト動画一覧',
	rank: '新着ランキング',
	review: '注目作品',
}

const metaDescriptionMap: Record<DoujinItemType, string> = {
	sale: `本日のお得なセール中のアダルト動画を厳選ピックアップ！最新の割引情報を${new Date().toLocaleDateString()}時点でお届けします。`,
	todaynew: `本日(${new Date().toLocaleDateString()})発売の最新アダルト動画をチェックできます。新作のアダルト動画情報を毎日更新しています。`,
	feature: `これから発売される人気女優のアダルト動画を厳選してご紹介します。${new Date().toLocaleDateString()}時点でのおすすめ作品をぜひチェックしてください。`,
	last7days: `過去1週間以内にDMMで発売された新作アダルト動画をすべてご紹介しています。${new Date().toLocaleDateString()}時点の最新情報です。`,
	rank: '新着ランキング',
	review: '注目作品',
}

export async function generateMetadata({
	params,
}: {
	params: { itemType: string }
}): Promise<Metadata> {
	const itemType = params.itemType as DoujinItemType

	return {
		title: metaTitleMap[itemType],
		description: metaDescriptionMap[itemType] || 'DMMの人気アイテムをチェック！',
	}
}

export default function DMMGenericPage({ params }: { params: { itemType: DoujinItemType } }) {
	const itemType = params.itemType

	// console.log('itemType: ', itemType) // 削除

	const endpointObject = (itemType: DoujinItemType): string => {
		switch (itemType) {
			case 'rank':
				return '/api/doujin-get-top-rank-items'
			case 'todaynew':
				return '/api/doujin-get-top-todaynew-items'
			case 'review':
				return '/api/doujin-get-top-review-items'
			case 'feature':
				return '/api/doujin-get-top-feature-items'
			case 'sale':
				return '/api/doujin-get-top-sale-items'
			default:
				return ''
		}
	}

	const pageTitles: Record<DoujinItemType, string> = {
		rank: '新着ランキング',
		todaynew: '新着作品',
		review: '注目作品',
		sale: '限定セール',
		feature: 'これから発売される注目作品一覧',
		last7days: '過去1週間以内に発売された新作アダルト動画一覧',
	}

	const gradients: Record<DoujinItemType, { bg: string; text: string }> = {
		rank: { bg: 'from-green-50 to-blue-50', text: 'from-green-500 to-blue-500' },
		todaynew: { bg: 'from-yellow-50 to-red-50', text: 'from-yellow-500 to-red-500' },
		review: { bg: 'from-pink-50 to-purple-50', text: 'from-pink-500 to-purple-500' },
		sale: { bg: 'from-blue-50 to-purple-50', text: 'from-blue-500 to-purple-500' },
		feature: { bg: 'from-blue-50 to-purple-50', text: 'from-blue-500 to-purple-500' },
		last7days: { bg: 'from-blue-50 to-purple-50', text: 'from-blue-500 to-purple-500' },
	}

	if (!Object.keys(pageTitles).includes(itemType)) {
		return (
			<div className='container mx-auto px-4 py-12'>
				<h1 className='text-3xl font-bold text-red-600 text-center mb-4'>無効な itemType です</h1>
				<p className='text-center'>
					有効な itemType は {Object.keys(pageTitles).join(', ')} です。
				</p>
			</div>
		)
	}

	return (
		<div className='w-full'>
			<div className='w-full'>
				<DMMDoujinFeaturedItemContainer
					from='only'
					bgGradient={`bg-gradient-to-r ${gradients[itemType].bg}`}
					endpoint={endpointObject(itemType)}
					title={pageTitles[itemType]}
					linkText='すべて見る'
					linkHref={`/${itemType}` satisfies DMMDoujinFeaturedItemType}
					textGradient={gradients[itemType].text}
					umamifrom={`only-${itemType}`}
				/>
			</div>
		</div>
	)
}
