import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'エロコメストについて | エロコメスト',
	description: 'エロコメストは、DMM.comの豊富な動画コンテンツを提供するサイトです。安全で楽しい体験をお届けします。'
}

const About = () => {
	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-gray-800 mb-6">エロコメストについて</h1>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">私たちのミッション</h2>
				<p className="text-gray-600 leading-relaxed">
					エロコメストは、みんなで抜ける情報を共有する動画体験を提供することを目指しています。DMM.comやSOKMILなどの豊富なコンテンツを通じて、
					ユーザーの皆様に満足いただけるサービスを提供します。
				</p>
			</section>

			<section className="mb-8">
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">パートナーシップ</h2>
				<div className="flex flex-col items-start bg-gray-100 p-6 rounded-lg">
					<div className="mb-4">
						<p className="text-gray-700 font-medium mb-2">Powered by</p>
						<Link
							href="https://affiliate.dmm.com/api/"
							className="text-blue-600 hover:text-blue-800 transition duration-300"
							target="_blank"
							rel="noopener noreferrer"
						>
							DMM.com
						</Link>
					</div>
					<Link
						href="https://sokmil-ad.com/"
						target="_blank"
						rel="nofollow noopener noreferrer"
						className="hover:opacity-80 transition duration-300"
					>
						<img
							src="https://sokmil-ad.com/api/credit/135x18.gif"
							alt="WEB SERVICE BY SOKMIL"
							width="135"
							height="18"
							className="border border-gray-300 rounded"
						/>
					</Link>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-semibold text-gray-700 mb-4">免責事項</h2>
				<p className="text-gray-600 leading-relaxed">
					当サイトは、DMM.comのアフィリエイトプログラムを利用しています。 また、18歳未満の方のご利用はお控えください。
				</p>
			</section>
		</div>
	)
}

export default About
