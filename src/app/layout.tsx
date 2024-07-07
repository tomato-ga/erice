// /Users/donbe/Codes/keysound/src/app/layout.tsx
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './layoutcomponents/Header'
import Footer from './layoutcomponents/Footer'
import Sidebar from './layoutcomponents/Sidebar'

// import TopCopy from './components/Copy/index'

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['500'] })

export const metadata: Metadata = {
	title: 'keyboard sound',
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
		title: 'keyboard sound',
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

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ja">
			<body className={noto.className}>
				<Header />

				{/* <TopCopy /> */}

				<div className="mx-auto flex flex-col md:flex-row min-h-screen bg-white">
					<Sidebar />
					<main className="flex-1 p-2 bg-white order-1 md:order-2">{children}</main>
				</div>
				<Footer />
			</body>
		</html>
	)
}
