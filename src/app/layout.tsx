// /Users/donbe/Codes/keysound/src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './layoutcomponents/Header'
import Footer from './layoutcomponents/Footer'
import Sidebar from './layoutcomponents/Sidebar'

import { GoogleAnalytics } from '@next/third-parties/google'

// import TopCopy from './components/Copy/index'

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['500'] })

export const metadata: Metadata = {
	title: 'erorice',
	description: 'eroriceは無料エロ動画を思う存分楽しめるサイトです。',
	openGraph: {
		title: 'erorice',
		description: 'eroriceは無料エロ動画を思う存分楽しめるサイトです。',
		images: [
			{
				url: 'https://keyboard-sound.net/opengraph-image.jpg', // ここで画像のパスを指定
				width: 1280,
				height: 720,
				alt: 'Open Graph Image'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'erorice',
		description: 'eroriceは無料エロ動画を思う存分楽しめるサイトです。',
		images: [
			{
				url: 'https://keyboard-sound.net/twitter-image.jpg', // ここで画像のパスを指定
				width: 1280,
				height: 720,
				alt: 'Twitter Image'
			}
		]
	}
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ja">
			<body className={`${noto.className} flex flex-col min-h-screen`}>
				<Header />
				<div className="flex-grow flex flex-col md:flex-row">
					<aside className="order-2 md:order-1 w-full md:w-64 lg:w-80">
						<Sidebar />
					</aside>
					<main className="order-1 md:order-2 flex-grow overflow-x-hidden p-4 md:p-6 lg:p-8">{children}</main>
				</div>
				<Footer />
			</body>
			{!!process.env.GAID && <GoogleAnalytics gaId={process.env.GAID} />}
		</html>
	)
}
