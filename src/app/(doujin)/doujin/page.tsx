import DMMDoujinFeaturedItemContainer from '@/app/components/doujincomponents/DMMDoujinFeaturedItemContainer'

interface HomePageProps {
	searchParams: { page?: string }
}

export default function DoujinHomePage({ searchParams }: HomePageProps) {
	return (
		<>
			<section className='space-y-16 py-12'>
				{/* <DMMDoujinFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/doujin-get-top-sale-items'
					title={titles.sale}
					linkText={linkTexts.sale}
					linkHref='/sale'
					umamifrom='top-doujin-sale'
					textGradient='from-blue-500 to-purple-500'
				/> */}

				<DMMDoujinFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/doujin-get-top-todaynew-items'
					title={titles.todaynew}
					linkText={linkTexts.todaynew}
					linkHref='/todaynew'
					umamifrom='top-doujin-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				<DMMDoujinFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/doujin-get-top-feature-items'
					title={titles.feature}
					linkText={linkTexts.feature}
					linkHref='/feature'
					umamifrom='top-doujin-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				<DMMDoujinFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/doujin-get-top-rank-items'
					title={titles.rank}
					linkText={linkTexts.rank}
					linkHref='/rank'
					umamifrom='top-doujin-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				<DMMDoujinFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/doujin-get-top-review-items'
					title={titles.review}
					linkText={linkTexts.review}
					linkHref='/review'
					umamifrom='top-doujin-sale'
					textGradient='from-blue-500 to-purple-500'
				/>
			</section>
		</>
	)
}

const gradients = {
	newrank: 'from-green-500 to-blue-500',
	debut: 'from-yellow-500 to-red-500',
	feature: 'from-pink-500 to-purple-500',
	sale: 'from-blue-500 to-purple-500',
	actress: 'from-blue-500 to-purple-500',
	genre: 'from-blue-500 to-purple-500',
}

const titles = {
	rank: '人気作品',
	todaynew: '新着作品',
	review: '評価の高い作品',
	sale: '限定セール',
	feature: 'これから発売される注目作品一覧',
	last7days: '過去1週間以内に発売された新作アダルト動画一覧',
}

const linkTexts = {
	rank: '全ての人気商品を見る',
	todaynew: '全ての新着作品を見る',
	review: '全ての評価の高い作品を見る',
	sale: '全ての限定セール商品を見る',
	feature: '全てのこれから発売される注目作品を見る',
	last7days: '全ての過去1週間以内に発売された新作アダルト動画を見る',
}
