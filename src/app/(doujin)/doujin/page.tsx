import DMMDoujinFeaturedItemContainer from '@/app/components/doujincomponents/DMMDoujinFeaturedItemContainer'

interface HomePageProps {
	searchParams: { page?: string }
}

export default function DoujinHomePage({ searchParams }: HomePageProps) {
	return (
		<>
			<section className="space-y-16 py-12">
				<DMMDoujinFeaturedItemContainer
					from="top"
					bgGradient="bg-gradient-to-r from-blue-50 to-purple-50"
					endpoint="/api/doujin-get-top-sale-items"
					title={titles.sale}
					linkText={linkTexts.sale}
					linkHref="/doujin-sale"
					umamifrom="top-doujin-sale"
					textGradient="from-blue-500 to-purple-500"
				/>

				<DMMDoujinFeaturedItemContainer
					from="top"
					bgGradient="bg-gradient-to-r from-blue-50 to-purple-50"
					endpoint="/api/doujin-get-top-newrank-items"
					title={titles.newrank}
					linkText={linkTexts.newrank}
					linkHref="/doujin-sale"
					umamifrom="top-doujin-sale"
					textGradient="from-blue-500 to-purple-500"
				/>

				<DMMDoujinFeaturedItemContainer
					from="top"
					bgGradient="bg-gradient-to-r from-blue-50 to-purple-50"
					endpoint="/api/doujin-get-top-newrelease-items"
					title={titles.newrelease}
					linkText={linkTexts.newrelease}
					linkHref="/doujin-sale"
					umamifrom="top-doujin-sale"
					textGradient="from-blue-500 to-purple-500"
				/>

				<DMMDoujinFeaturedItemContainer
					from="top"
					bgGradient="bg-gradient-to-r from-blue-50 to-purple-50"
					endpoint="/api/doujin-get-top-review-items"
					title={titles.review}
					linkText={linkTexts.review}
					linkHref="/doujin-sale"
					umamifrom="top-doujin-sale"
					textGradient="from-blue-500 to-purple-500"
				/>

				<DMMDoujinFeaturedItemContainer
					from="top"
					bgGradient="bg-gradient-to-r from-blue-50 to-purple-50"
					endpoint="/api/doujin-get-top-popular-circles-items"
					title={titles.circle}
					linkText={linkTexts.circle}
					linkHref="/doujin-sale"
					umamifrom="top-doujin-sale"
					textGradient="from-blue-500 to-purple-500"
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
	genre: 'from-blue-500 to-purple-500'
}

const titles = {
	newrank: '人気作品',
	newrelease: '新着作品',
	review: '評価の高い作品',
	sale: '限定セール',
	circle: '人気サークル',
	genre: 'ジャンル'
}

const linkTexts = {
	newrank: '全ての人気商品を見る',
	newrelease: '全ての新着作品を見る',
	review: '全ての評価の高い作品を見る',
	sale: '全ての限定セール商品を見る',
	circle: '全ての人気サークルを見る',
	genre: '全てのジャンルを見る'
}
