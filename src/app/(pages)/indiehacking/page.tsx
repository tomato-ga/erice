import React from 'react'

const indiehacking = () => {
	return (
		<div>
			<h1>このサイトの技術構成</h1>
			<div>
				<div>
					<h2>フロントエンド</h2>
					<ul>
						<li>Next.js 14 App Router</li>
						<li>TypeScript</li>
						<li>Tailwind CSS</li>
						<li>Shadcn UI</li>
					</ul>
				</div>

				<div>
					<h2>バックエンド</h2>
					<ul>
						<li>Go言語</li>
					</ul>
				</div>

				<div>
					<h2>クラウド</h2>
					<ul>
						<li>Cloudflare Workers</li>
						<li>Cloudflare D1</li>
						<li>Cloudflare KV</li>
						<li>Vercel</li>
					</ul>
				</div>
				<div>
					<h2>フロントエンドソースコード</h2>
					<p>{/* <a href='https://github.com/tomato-ga'>erice</a> */}</p>
				</div>
			</div>
		</div>
	)
}

export default indiehacking
