import Link from 'next/link'
import React from 'react'

const TermsAndPrivacy: React.FC = () => {
	return (
		<div className='bg-gray-50 dark:bg-gray-900 min-h-screen py-12'>
			<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
				<h1 className='text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8'>
					サイト情報・お問い合わせ
				</h1>

				<div className='bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg'>
					<div className='px-4 py-5 sm:p-6 space-y-6'>
						<p className='text-base text-gray-700 dark:text-gray-300'>
							このページではサイト名「エロコメスト」（以下「当サイト」といいます。）のサイト情報やお問い合わせ方法などを記載しています。
						</p>

						<section className='mb-8'>
							<h2 className='text-2xl font-semibold text-gray-700 mb-4'>私たちのミッション</h2>
							<p className='text-gray-600 leading-relaxed'>
								エロコメストは、エロ動画の良かった抜き情報を共有し合うこと、そして統計データを使った客観的な数字を使うことで、新たなエロ動画体験を提供することを目指しています。
							</p>
						</section>

<section className='mb-8'>
							<h2 className='text-2xl font-semibold text-gray-700 mb-4'>統計分析データの妥当性について</h2>
							<p className='text-gray-600 leading-relaxed'>
								統計検定2級・Pythonデータ分析資格保有者が、基本的な統計解析を実行しています。何か間違いに気づいたら、以下お問い合わせよりご連絡ください。
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
								お問い合わせ・削除依頼
							</h2>
							<p className='text-base text-gray-700 dark:text-gray-300'>
								削除依頼やその他お問い合わせはこちらの「お問い合わせメールアドレス servicedake+erice
								atmark gmail.com」からお願いいたします。
							</p>
						</section>

						<section>
							<h2 className='text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4'>
								広告掲載
							</h2>
							<p className='text-base text-gray-700 dark:text-gray-300'>
								当サイトではアフィリエイト広告を掲載しています。
							</p>
							<Link
								href='https://affiliate.dmm.com/api/'
								className='text-blue-600 hover:text-blue-800 transition duration-300'
								target='_blank'
								rel='noopener noreferrer'>
								<p className='text-blue-700 font-medium mb-2'>Powered by DMM.com</p>
							</Link>

							<p className='text-base text-gray-700 dark:text-gray-300'>
								当サイトからのアクセスで商品が購入された場合に売上が発生することがあります。
								当サイトでは、アフィリエイト広告売上を更新にかかるサーバー・ドメイン・メンテナンス人件費用とする予定です。
							</p>
						</section>

						<p className='text-base text-gray-700 dark:text-gray-300 mt-8'>2024年8月1日</p>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TermsAndPrivacy
