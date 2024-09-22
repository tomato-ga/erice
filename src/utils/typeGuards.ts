// erice/src/utils/objectValidation.ts

import { DoujinTopItem } from '@/_types_doujin/doujintypes'

/**
 * オブジェクトが指定されたプロパティを持つかどうかをチェックする関数
 * @param obj チェック対象のオブジェクト
 * @param props 必要なプロパティの配列
 * @returns オブジェクトが全てのプロパティを持つ場合は true、それ以外は false
 */
export function isValidObject<T>(obj: T | null | undefined, props: (keyof T)[]): obj is T {
	if (obj == null || typeof obj !== 'object') return false // objがオブジェクトであることを確認
	return props.every(prop => prop in obj)
}

export const formatPrice = (price: unknown): string => {
	if (typeof price === 'string' || typeof price === 'number') {
		// 数値を日本円フォーマットに変換
		return new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(Number(price))
	}
	return ''
}

export const processKeyword = (keyword: string): string => {
	// `|` が含まれているかチェック
	if (keyword.includes('|')) {
		// `|` が含まれている場合のみ置換を行う
		return keyword.replace(/\|/g, '×')
	}
	// `|` が含まれていない場合は元の文字列をそのまま返す
	return keyword
}

// export function isDoujinTopItem(item: unknown): item is DoujinTopItem {
// 	return (
// 		typeof item === 'object' &&
// 		item !== null &&
// 		'db_id' in item &&
// 		'content_id' in item &&
// 		'title' in item &&
// 		'affiliate_url' in item
// 	)
// }
