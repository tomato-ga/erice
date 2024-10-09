// components/StructuredDataScript.tsx

import React from 'react'
import { generateGenreArticleStructuredData, generateGenreBreadcrumbList } from '@/app/components/json-ld/jsonld'
import { DMMItemProps } from '@/types/dmmtypes'

interface StructuredDataScriptProps {
	genreName: string
	currentPage: number
	items: DMMItemProps[]
	description: string
}

const StructuredDataScript = ({ genreName, currentPage, items, description }: StructuredDataScriptProps) => {
	try {
		// JSON-LD の生成
		const articleData = generateGenreArticleStructuredData(genreName, currentPage, items, description)
		const breadcrumbData = generateGenreBreadcrumbList(genreName, currentPage)

		// JSON-LD を文字列に変換
		const articleJsonLdString = JSON.stringify(articleData)
		const breadcrumbJsonLdString = JSON.stringify(breadcrumbData)

		return (
			<>
				{/* Article 構造化データ */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: articleJsonLdString
					}}
				/>

				{/* BreadcrumbList 構造化データ */}
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: breadcrumbJsonLdString
					}}
				/>
			</>
		)
	} catch (error) {
		console.error('StructuredDataScript Error:', error)
		return null
	}
}

export default StructuredDataScript
