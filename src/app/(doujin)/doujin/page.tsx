import DMMDoujinFeaturedItemContainer from '@/app/components/doujincomponents/DMMDoujinFeaturedItemContainer'

interface HomePageProps {
	searchParams: { page?: string }
}

export default function DoujinHomePage({ searchParams }: HomePageProps) {
	return (
		<>
			<section className='space-y-16 py-12'>
				<DMMDoujinFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/doujin-get-top-newrank-items'
					title={titles.sale}
					linkText={linkTexts.sale}
					linkHref='/doujin-newrank'
					umamifrom='top-sale'
					textGradient='from-blue-500 to-purple-500'
				/>
			</section>
		</>
	)
}

const gradients = {
	todaynew: 'from-green-500 to-blue-500',
	debut: 'from-yellow-500 to-red-500',
	feature: 'from-pink-500 to-purple-500',
	sale: 'from-blue-500 to-purple-500',
	actress: 'from-blue-500 to-purple-500',
	genre: 'from-blue-500 to-purple-500',
}

const titles = {
	todaynew: '今日配信の新作',
	debut: 'デビュー作品',
	feature: '注目作品',
	sale: '限定セール',
	actress: 'アクトレス',
	genre: 'ジャンル',
}

const linkTexts = {
	todaynew: '全ての新作商品を見る',
	debut: '全てのデビュー作品を見る',
	feature: '全ての注目作品を見る',
	sale: '全ての限定セール商品を見る',
	actress: '全てのアクトレスを見る',
	genre: '全てのジャンルを見る',
}
