import Script from 'next/script'
import type { Metadata } from 'next'
import './globals.css'
import Header from './layoutcomponents/Header'
import Footer from './layoutcomponents/Footer'
import Sidebar from './layoutcomponents/Sidebar'

import { GoogleAnalytics } from '@next/third-parties/google'

export const metadata: Metadata = {
	title: {
		default: 'エロコメスト',
		template: '%s | エロコメスト'
	},
	description: 'エロコメストは無料エロ動画を思う存分楽しめるサイトです。',
	robots: 'index,follow',
	referrer: 'origin-when-cross-origin'
	// openGraph: {
	// 	title: {
	// 		default: 'エロコメスト',
	// 		template: '%s | エロコメスト'
	// 	},
	// 	description: 'エロコメストは無料エロ動画を思う存分楽しめるサイトです。',
	// 	images: [
	// 		{
	// 			url: 'opengraph-image.jpg',
	// 			width: 1280,
	// 			height: 720,
	// 			alt: 'Open Graph Image'
	// 		}
	// 	]
	// },
	// twitter: {
	// 	card: 'summary_large_image',
	// 	title: {
	// 		default: 'エロコメスト',
	// 		template: '%s | エロコメスト'
	// 	},
	// 	description: 'エロコメストは無料エロ動画を思う存分楽しめるサイトです。',
	// 	images: [
	// 		{
	// 			url: 'twitter-image.jpg',
	// 			width: 1280,
	// 			height: 720,
	// 			alt: 'Twitter Image'
	// 		}
	// 	]
	// }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="ja">
			<Script
				src="https://analytics.erice.cloud/script.js"
				data-website-id={process.env.UMAMI_WEBSITE_ID}
				data-do-not-track="true"
				data-auto-track="true"
				strategy="afterInteractive"
			/>
			<Script id="microsoft-clarity" strategy="afterInteractive">
				{`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "nbajc9ngtj");
          `}
			</Script>
			<body className="font-sans flex flex-col min-h-screen">
				<Header />
				<div className="flex-grow flex flex-col md:flex-row">
					<aside className="order-2 md:order-1 w-full md:w-64 lg:w-80">
						<Sidebar />
					</aside>
					<main className="order-1 md:order-2 flex-grow overflow-x-hidden">{children}</main>
				</div>
				<Footer />
			</body>
			{!!process.env.GAID && <GoogleAnalytics gaId={process.env.GAID} />}
		</html>
	)
}