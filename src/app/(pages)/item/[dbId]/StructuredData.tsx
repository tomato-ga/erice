// components/StructuredDataScript.tsx

import { ActressStats } from '@/_types_dmm/statstype'
import { fetchActressProfile } from '@/app/components/dmmcomponents/fetch/itemFetchers'
import {
	generateArticleStructuredData,
	generateBreadcrumbList,
	generateIndependentStatsStructuredData,
} from '@/app/components/json-ld/jsonld'
import { DMMItemDetailResponse, DMMItemMainResponse } from '@/types/dmmitemzodschema'

import React from 'react'

interface StructuredDataScriptProps {
	itemMain: DMMItemMainResponse
	itemDetail: DMMItemDetailResponse
	description: string
	dbId: number
}

interface StructuredDataScriptProps {
	itemMain: DMMItemMainResponse
	itemDetail: DMMItemDetailResponse
	description: string
	dbId: number
	actressStats?: ActressStats // 統計データを追加
}

const StructuredDataScript: React.FC<StructuredDataScriptProps> = async ({
	itemMain,
	itemDetail,
	description,
	dbId,
}) => {
	try {
		// 女優情報のフェッチ
		const actressProfiles = itemDetail.actress
			? await fetchActressProfile(itemDetail.actress)
			: null

		if (!actressProfiles || actressProfiles.length === 0) {
			console.warn('Actress profiles are missing or incomplete')
		}

		// JSON-LD の生成（並列実行）
		const [articleData, breadcrumbData] = await Promise.all([
			generateArticleStructuredData(itemMain, itemDetail, description, dbId, actressProfiles),
			generateBreadcrumbList(dbId, itemDetail),
		])

		// JSON-LD を文字列に変換
		const articleJsonLdString = JSON.stringify(articleData)
		const breadcrumbJsonLdString = JSON.stringify(breadcrumbData)

		// 構造化データの存在確認
		if (!articleJsonLdString || !breadcrumbJsonLdString) {
			throw new Error('Structured data generation failed.')
		}

		return (
			<>
				{/* Article 構造化データ */}
				<script
					id={`structured-data-article-${itemMain.content_id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: articleJsonLdString,
					}}
				/>

				{/* BreadcrumbList 構造化データ */}
				<script
					id={`structured-data-breadcrumb-${itemMain.content_id}`}
					type='application/ld+json'
					dangerouslySetInnerHTML={{
						__html: breadcrumbJsonLdString,
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
