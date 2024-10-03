// src/app/components/dmmcomponents/ABtest/GradientButton/ButtonTestComponent.tsx
import { DMMActressInfo } from '@/types/APItypes'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { ButtonWithGradient } from './gradient'
import { ButtonNoGradient } from './no-gradient'
import { DoujinKobetuItem } from '@/_types_doujin/doujintypes'

// Define the props interface
interface ButtonTestComponentProps {
	item: DoujinKobetuItem
}

export default function ButtonTestDoujinComponent({ item }: ButtonTestComponentProps) {
	const showButtonA = Math.random() > 0.5 // A/Bテスト用のランダマイザー

	return showButtonA ? <ButtonNoGradient item={item} /> : <ButtonWithGradient item={item} />
}
