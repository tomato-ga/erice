// Footer.tsx
import React from 'react'
import Link from 'next/link'

const Footer = () => {
	return (
		<footer className="bg-[#141921] py-8 mt-4">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
					<div>
						<h3 className="text-cyan-400 text-xl font-semibold mb-4">エロコメスト</h3>
						<p className="text-gray-400 mb-4">最新のエロ動画を紹介しています。</p>
					</div>
					<div>
						<h3 className="text-cyan-400 text-xl font-semibold mb-4">リンク</h3>
						<ul className="text-gray-400 space-y-2">
							<li>
								<Link href="/about" className="hover:text-cyan-400">
									このサイトについて・お問い合わせ
								</Link>
							</li>

							{/* <li>
								<Link href="/about" className="hover:text-cyan-400">
									About
								</Link>
							</li>
							<li>
								<Link href="/privacypolicy" className="hover:text-cyan-400">
									プライバシーポリシー
								</Link>
							</li>
							<li>
								<Link href="/terms" className="hover:text-cyan-400">
									利用規約
								</Link>
							</li> */}
						</ul>
					</div>
					<div>
						{/* <h3 className="text-cyan-400 text-xl font-semibold mb-4">フォローする</h3>
						<ul className="text-gray-400 space-y-2">
							<li>
								<Link href="https://twitter.com/yourusername" className="hover:text-cyan-400">
									Twitter
								</Link>
							</li>
							
						</ul> */}
					</div>
				</div>
				<hr className="border-gray-700" />
				<p className="text-center text-gray-500 mt-8">
					© {new Date().getFullYear()} エロコメスト. All rights reserved.
				</p>
			</div>
		</footer>
	)
}

export default Footer
