import { ExtendedDMMItemProps, UmamiClickData } from '@/types/umamiTypes'

export const handleericeUmamiClick = ({ type, from, item }: UmamiClickData) => {
	if (typeof window !== 'undefined' && window.umami) {
		window.umami.track(`${type} ${from} Click`, {
			click_type: type,
			item_id: item.db_id,
			item_title: item.title,
			from: from,
			actress_name: item.actress,
			actress_id: item.actress_id
		})
	}
}
