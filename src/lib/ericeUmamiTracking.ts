import { DMMItem, DMMItemProps } from '@/types/dmmtypes'

// ExtendedDMMItemPropsの定義を更新
type ExtendedDMMItemProps = Omit<DMMItemProps, 'db_id'> & { 
	db_id?: number
	actress_id?: string  // actress_idプロパティを明示的に追加
}

export const handleericeUmamiClick = <T extends ExtendedDMMItemProps>(type: string, from: string, item: T) => {
	if (typeof window !== 'undefined' && window.umami) {
		window.umami.track(`${type} ${from} Click`, {
			click_type: type,
			item_id: item.db_id,
			item_title: item.title,
			from: from,
			actress_name: item.actress,
			actress_id: item.actress_id,
			// 必要に応じて、T型特有のプロパティを追加
		})
	}
}
