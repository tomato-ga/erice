import { DMMItemProps } from './dmmtypes'
import { DMMItemMainResponse } from './dmmitemzodschema'

// ExtendedDMMItemPropsの定義を更新
export type ExtendedDMMItemProps = Partial<DMMItemMainResponse> &
	Partial<DMMItemProps> & {
		db_id?: number
		content_id: string
		affiliateURL: string
		imageURL?: string | { large?: string; small?: string } // オプショナルに変更し、型を拡張
		title: string
		sampleImageURL?: string[] | null
		sampleMovieURL?: string[] | null
		actress?: string
		actress_id?: string
	}

// UmamiTrackingのprops用の型を定義
export interface UmamiTrackingProps {
	type: string
	item: ExtendedDMMItemProps
	from: string
	children: React.ReactNode
}

// handleericeUmamiClick関数の引数の型を定義
export interface UmamiClickData {
	type: string
	from: string
	item: ExtendedDMMItemProps
}
