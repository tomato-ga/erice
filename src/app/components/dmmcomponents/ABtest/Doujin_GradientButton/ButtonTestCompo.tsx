// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonTestComponent.tsx
import { DMMActressInfo } from '@/types/APItypes'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'

import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'
import { DoujinButtonWithGradient } from './gradient'
import { DoujinButtonNoGradient } from './no-gradient'

// Define the props interface
interface ButtonTestComponentProps {
	item: DoujinKobetuItem
}

export default function ButtonTestDoujinComponent({ item }: ButtonTestComponentProps) {
	const showButtonA = Math.random() > 0.5 // A/Bテスト用のランダマイザー

	return showButtonA ? <DoujinButtonWithGradient item={item} /> : <DoujinButtonNoGradient item={item} />
}
