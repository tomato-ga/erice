// erice/src/utils/objectValidation.ts

import { DoujinTopItem } from '@/_types_doujin/doujintypes'

export function isValidObject<T>(obj: T | null | undefined, props: (keyof T)[]): obj is T {
	if (obj == null || typeof obj !== 'object') return false // objがオブジェクトであることを確認
	return props.every(prop => prop in obj)
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
