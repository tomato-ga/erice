// src/keywordCombiner.ts

import { AllCategories, GroupedCombinedKeywords } from './keywords'

/**
 * 2つのサブカテゴリーのキーワードを基に、両方向の組み合わせをグループ化して生成します。
 * 表示用と検索用の両方のフォーマットを生成します。
 *
 * @param subcat1 - 第一のサブカテゴリー名
 * @param subcat2 - 第二のサブカテゴリー名
 * @returns GroupedCombinedKeywords の配列
 */
export function GenerateCombinedKeywordsGeneric(
	subcat1: string,
	subcat2: string,
): GroupedCombinedKeywords[] {
	// サブカテゴリー1のキーワードを取得
	const keywords1 = AllCategories.flatMap(category =>
		category.Subcategories.filter(sub => sub.SubCategoryName === subcat1).flatMap(
			sub => sub.Keywords,
		),
	)

	// サブカテゴリー2のキーワードを取得
	const keywords2 = AllCategories.flatMap(category =>
		category.Subcategories.filter(sub => sub.SubCategoryName === subcat2).flatMap(
			sub => sub.Keywords,
		),
	)

	const groups: GroupedCombinedKeywords[] = []

	// サブカテゴリー1を基にした組み合わせを生成
	for (const k1 of keywords1) {
		groups.push({
			base: k1,
			combinations: keywords2.map(k2 => `${k1}×${k2}`),
			fetchCombinations: keywords2.map(k2 => `${k1}|${k2}`),
		})
	}

	// サブカテゴリー2を基にした組み合わせを生成
	for (const k2 of keywords2) {
		groups.push({
			base: k2,
			combinations: keywords1.map(k1 => `${k2}×${k1}`),
			fetchCombinations: keywords1.map(k1 => `${k2}|${k1}`),
		})
	}

	return groups
}

/**
 * 全てのサブカテゴリーの組み合わせから、GroupedCombinedKeywords を生成します。
 *
 * @returns GroupedCombinedKeywords の配列
 */
export function GenerateAllCombinedKeywords(): GroupedCombinedKeywords[] {
	const allCombinedKeywords: GroupedCombinedKeywords[] = []

	// メインカテゴリーごとに処理
	for (const category of AllCategories) {
		const subcategories = category.Subcategories
		// サブカテゴリーの全ペアを生成（順不同）
		for (let i = 0; i < subcategories.length; i++) {
			for (let j = i + 1; j < subcategories.length; j++) {
				const subcat1 = subcategories[i].SubCategoryName
				const subcat2 = subcategories[j].SubCategoryName
				const combined = GenerateCombinedKeywordsGeneric(subcat1, subcat2)
				allCombinedKeywords.push(...combined)
			}
		}
	}

	return allCombinedKeywords
}

/**
 * combinedkeyword 配列を生成します。
 *
 * @returns combinedkeyword の配列
 */
export function CreateCombinedKeywordArray(): string[] {
	const allCombinedKeywords = GenerateAllCombinedKeywords()
	const combinedKeywordSet: Set<string> = new Set()

	for (const group of allCombinedKeywords) {
		// Use for...of to iterate over the combinations array
		for (const combination of group.combinations) {
			combinedKeywordSet.add(combination)
		}
	}

	return Array.from(combinedKeywordSet)
}

// 最終的な combinedkeyword 配列の生成
export const combinedkeyword: string[] = CreateCombinedKeywordArray()
