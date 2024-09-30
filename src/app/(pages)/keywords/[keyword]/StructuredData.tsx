import {
	generateKeywordArticleStructuredData,
	generateKeywordBreadcrumbList,
} from '@/app/components/json-ld/jsonld'
import { GetKVTop100Response } from '@/types/dmm-keywordpage-types'
import React from 'react'

interface StructuredDataScriptProps {
	keyword: string
	data: GetKVTop100Response
	description: string
}

const StructuredDataScript: React.FC<StructuredDataScriptProps> = ({
	keyword,
	data,
	description,
}) => {
	const articleData = generateKeywordArticleStructuredData(keyword, data, description)
	const breadcrumbData = generateKeywordBreadcrumbList(keyword)

	return (
		<>
			<script
				id={`structured-data-article-${keyword}`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(articleData) }}
			/>
			<script
				id={`structured-data-breadcrumb-${keyword}`}
				type='application/ld+json'
				dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
			/>
		</>
	)
}

export default StructuredDataScript
