// src/app/layout.tsx

import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Footer from './layoutcomponents/Footer'
import Header from './layoutcomponents/Header'
import Sidebar from './layoutcomponents/Sidebar'

import { GoogleAnalytics } from '@next/third-parties/google'
import BottomNavigation from './components/Banner/BottomNavigation'

export const metadata: Metadata = {
	title: {
		default: 'エロコメスト',
		template: '%s | エロ統計データのエロコメスト',
	},
	description:
		'エロ動画の良かった抜き情報を共有し合うこと、そして統計データを使った客観的な数字を使うことで、新たなエロ動画体験を提供することを目指しています。',
	robots: 'index,follow',
	referrer: 'origin-when-cross-origin',
	other: {
		rating: 'adult',
	},
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='ja'>
			<body className='font-sans flex flex-col min-h-screen'>
				<Header />
				<div className='flex-grow flex flex-col md:flex-row'>
					<aside className='order-2 md:order-1 w-full md:w-64 lg:w-80'>
						<Sidebar />
					</aside>
					<main className='order-1 md:order-2 flex-grow overflow-x-hidden'>
						{children}
						<BottomNavigation />
					</main>
				</div>
				<Footer />
			</body>
			<Script
				src='https://analytics.erice.cloud/script.js'
				data-website-id={process.env.UMAMI_WEBSITE_ID}
				data-do-not-track='true'
				data-auto-track='true'
				// strategy='worker'
				strategy='afterInteractive'
			/>
			<Script
				id='microsoft-clarity'
				strategy='afterInteractive'
				// strategy='worker'
			>
				{`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "nbajc9ngtj");
          `}
			</Script>
			{!!process.env.GAID && <GoogleAnalytics gaId={process.env.GAID} />}
		</html>
	)
}
