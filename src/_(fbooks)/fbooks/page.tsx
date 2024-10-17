import FBooksFeaturedItemContainer from '@/app/components/fbookscomponents/FBooksFeaturedItemContainer'

export default function FbooksHomePage() {
	return (
		<>
			<section className='space-y-16 py-12'>
				<FBooksFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/fbooks-get-top-sale-items'
					title={titles.sale}
					linkText={linkTexts.sale}
					linkHref='/sale'
					umamifrom='top-fbooks-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				<FBooksFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/fbooks-get-top-newrank-items'
					title={titles.newrank}
					linkText={linkTexts.newrank}
					linkHref='/newrank'
					umamifrom='top-fbooks-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				<FBooksFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/fbooks-get-top-newrelease-items'
					title={titles.newrelease}
					linkText={linkTexts.newrelease}
					linkHref='/newrelease'
					umamifrom='top-fbooks-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				<FBooksFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/fbooks-get-top-review-items'
					title={titles.review}
					linkText={linkTexts.review}
					linkHref='/review'
					umamifrom='top-fbooks-sale'
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
	newrank: '人気作品',
	newrelease: '新着作品',
	review: '評価の高い作品',
	sale: '限定セール',
	circle: '人気サークル',
	genre: 'ジャンル',
}

const linkTexts = {
	newrank: '全ての人気商品を見る',
	newrelease: '全ての新着作品を見る',
	review: '全ての評価の高い作品を見る',
	sale: '全ての限定セール商品を見る',
	circle: '全ての人気サークルを見る',
	genre: '全てのジャンルを見る',
}
