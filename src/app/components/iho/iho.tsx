import Link from 'next/link'
import React from 'react'

const Iho = () => {
	return (
		<div className='max-w-2xl mx-auto p-6 bg-red-50 rounded-lg shadow-md border border-red-200'>
			<h2 className='text-xl font-bold text-red-700 mb-4 text-center'>
				違法動画・違法アップロードサイトにご注意ください
			</h2>

			<div className='space-y-4 text-gray-700'>
				<p className='leading-relaxed'>
					pornhub、xvideos、missav、av01、javmix.tv、supjav、tktube、youjizzなどの無料動画にご注意ください。
					<br />
					<br />
					違法サイトにアップロードされている無料エロ動画や同人作品の視聴（特に無修正動画の視聴）は、著作権の侵害、インターネットプロバイダによる発信者情報開示請求、個人情報流出、フィッシング詐欺の被害など、法律に抵触する可能性があり危険です。
				</p>

				<p className='leading-relaxed'>
					<strong>
						<Link
							href='https://erice.cloud/request_for_disclosure_of_sender_information'
							className='text-red-600 hover:text-red-800 underline font-medium'>
							私自身が発信者情報開示請求を受けた経験
						</Link>
					</strong>
					から、違法行為は監視されているように思います。軽い気持ちで視聴しているだけであっても、リスクが高い行為です。
				</p>

				<p className='font-medium'>
					FANZAなど安全なサイトでのエロ動画・エロ画像視聴をおすすめします。
				</p>
			</div>
		</div>
	)
}

export default Iho
