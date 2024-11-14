import DMMActressItemContainer from './components/dmmcomponents/DMMActressItemContainer'

// import DMMTopFeaturedItemContainer from './components/dmmcomponents/DMMFeaturedItemContainer'
import DMMFeaturedItemContainer from './components/dmmcomponents/DMMFeaturedItemContainer'
import DMMFeaturesItemContainer from './components/dmmcomponents/DMMTopFeaturesItemList'

interface HomePageProps {
	searchParams: { page?: string }
}

export default function HomePage({ searchParams }: HomePageProps) {
	return (
		<>
			<section className='space-y-16 py-12'>
				<DMMFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-blue-50 to-purple-50'
					endpoint='/api/dmm-sale-getkv'
					title={titles.sale}
					linkText={linkTexts.sale}
					linkHref='/sale'
					umamifrom='top-sale'
					textGradient='from-blue-500 to-purple-500'
				/>

				{/* MEMO 2024/08/30 todaynewだけ別コンポーネントにして、no-storeにしている */}
				<DMMFeaturesItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-green-50 to-blue-50'
					endpoint='/api/dmm-todaynew-getkv'
					title={titles.todaynew}
					linkText={linkTexts.todaynew}
					linkHref='/todaynew'
					umamifrom='top-todaynew'
					textGradient='from-green-500 to-blue-500'
				/>

				{/* MEMO 2024/11/13 KVへ格納するアイテムの修正 */}

				{/* <DMMFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-emerald-50 to-yellow-50'
					endpoint='/api/dmm-last7days-getkv'
					title={titles.last7days}
					linkText={linkTexts.last7days}
					linkHref='/last7days'
					umamifrom='top-last7days'
					textGradient='from-20% from-emerald-500 to-yellow-500'
				/> */}

				<DMMFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-yellow-50 to-red-50'
					endpoint='/api/dmm-debut-getkv'
					title={titles.debut}
					linkText={linkTexts.debut}
					linkHref='/debut'
					umamifrom='top-debut'
					textGradient='from-yellow-500 to-red-500'
				/>

				<DMMFeaturedItemContainer
					from='top'
					bgGradient='bg-gradient-to-r from-pink-50 to-purple-50'
					endpoint='/api/dmm-feature-getkv'
					title={titles.feature}
					linkText={linkTexts.feature}
					linkHref='/feature'
					umamifrom='top-feature'
					textGradient='from-pink-500 to-purple-500'
				/>

				{/* <DMMItemContainer itemType="feature" from="top" bgGradient="bg-gradient-to-r from-pink-50 to-purple-50" />
				<DMMItemContainer itemType="todaynew" from="top" bgGradient="bg-gradient-to-r from-green-50 to-blue-50" />
				<DMMItemContainer itemType="debut" from="top" bgGradient="bg-gradient-to-r from-yellow-50 to-red-50" />
				<DMMItemContainer itemType="sale" from="top" bgGradient="bg-gradient-to-r from-blue-50 to-purple-50" /> */}

				{/* TODO 審査完了するまで非表示 -> 2024/08/20 審査通過コメント解除　女優セクション */}
				{/* <DMMActressItemContainer actressType='new' from='top' />
				<DMMActressItemContainer actressType='popular' from='top' /> */}

				{/* 既存の記事グリッドとページネーション */}
				{/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
					{data.articles.map((article) => (
						<div key={article.id} className="aspect-w-16 aspect-h-9">
							<ArticleCard article={article} isSmallThumbnail={false} source="Top" />
						</div>
					))}
				</div>
				<div className="mt-12">
					<PaginationComponent currentPage={currentPage} totalPages={data.totalPages} />
				</div> */}
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
	last7days: '過去7日間の新作',
}

const linkTexts = {
	todaynew: '全ての新作商品を見る',
	debut: '全てのデビュー作品を見る',
	feature: '全ての注目作品を見る',
	sale: '全ての限定セール商品を見る',
	actress: '全てのアクトレスを見る',
	genre: '全てのジャンルを見る',
	last7days: '全ての過去7日間の新作を見る',
}
