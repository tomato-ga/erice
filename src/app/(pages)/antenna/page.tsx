import React from 'react'
import { antennaPost, antennaPostApiResponse } from '@/types/antennaschema'
import Link from 'next/link'
import { formatAntennaDate } from '@/app/utils/postUtils'
import { PostList } from '@/app/components/antennacomponents/PostList'

const navItems = [
	{ href: '/', label: 'トップ', active: true },
	{ href: '/categories/image', label: '画像' },
	{ href: '/categories/neta', label: 'エロネタ' },
	{ href: '/categories/movie', label: '動画' },
	{ href: '/categories/animation', label: '漫画･アニメ' }
]

const NavItem: React.FC<{ href: string; label: string; active?: boolean; external?: boolean }> = React.memo(
	({ href, label, active, external }) => (
		<li className="text-sm font-bold">
			<Link
				href={href}
				className={`
        block px-4 py-2.5 text-white no-underline border-b-4
        ${active ? 'border-[#e2ff64]' : 'border-transparent hover:bg-white/30'}
        transition duration-200 ease-in-out
      `}
				{...(external ? { target: '_blank', rel: 'nofollow noopener' } : {})}
				aria-current={active ? 'page' : undefined}
			>
				{label}
			</Link>
		</li>
	)
)

NavItem.displayName = 'NavItem'

const Navigation: React.FC = () => (
	<nav className="bg-[#eb4e7e] overflow-x-auto" aria-label="メインナゲーション">
		<ul className="flex list-none m-0 p-0 whitespace-nowrap">
			{navItems.map((item, index) => (
				<NavItem key={index} {...item} />
			))}
		</ul>
	</nav>
)

const Header: React.FC = () => (
	<header className="bg-white">
		<h1 className="flex items-center justify-center h-[60px] m-0">
			<Link href="https://erice.cloud">
				<div className="text-4xl font-extrabold">
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
						えろぉアンテナ
					</span>
				</div>
			</Link>
		</h1>
		{/* <Navigation /> */}
	</header>
)

const SearchForm: React.FC = () => (
	<form className="relative bg-white h-[60px] mb-4" role="search">
		<input
			type="search"
			placeholder="タイトルを検索"
			className="absolute top-3.5 left-4 right-14 h-8 w-[calc(100%-4.5rem)] px-2 border border-[#dae0e6] rounded"
			aria-label="記事を検索"
		/>
		<button
			type="submit"
			className="absolute top-3.5 right-4 w-8 h-8 bg-[#eb4e7e] rounded flex items-center justify-center"
			aria-label="検索"
		>
			<svg
				className="w-5 h-5 text-white"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
				/>
			</svg>
		</button>
	</form>
)

const Footer: React.FC = () => (
	<footer className="mt-10 py-4 bg-white text-xs text-center text-[#b1b1b1]">
		<nav className="mb-4">
			{['About', '用規約', 'プライバシーポリシー', 'お問い合わせ'].map((item, index) => (
				<a key={index} href="#" className="inline-block px-3 py-2 text-[#b1b1b1]">
					{item}
				</a>
			))}
		</nav>
		<div className="mb-4">
			<img src="https://via.placeholder.com/32x32" alt="Twitter" className="inline-block w-8 h-8" />
		</div>
		<div>
			<a href="#" className="text-[#b1b1b1]">
				© 2024 5chアンテナ
			</a>
		</div>
	</footer>
)

const r18Page: React.FC = () => (
	<div className="flex flex-col min-h-screen bg-[#f3f3f3] font-sans">
		<Header />
		<main className="flex-grow p-4 md:max-w-[780px] md:mx-auto md:mt-6 md:p-[16px_80px_80px] md:bg-white md:rounded-[20px]">
			{/* <SearchForm /> */}
			<PostList limit={200} />
		</main>
		{/* <Footer /> */}
	</div>
)

export default r18Page
