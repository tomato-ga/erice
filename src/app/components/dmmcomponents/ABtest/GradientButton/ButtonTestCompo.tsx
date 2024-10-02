import { ButtonWithGradient } from './gradient'
import { ButtonNoGradient } from './no-gradient'
import { DMMItemMainResponse } from '@/types/dmmitemzodschema'
import { DMMActressInfo } from '@/types/APItypes'

// Define the props interface
interface ButtonTestComponentProps {
	ItemMain: DMMItemMainResponse;
	actressInfo: DMMActressInfo | null;
}

export default function ButtonTestComponent({ ItemMain, actressInfo }: ButtonTestComponentProps) {
	const showButtonA = Math.random() > 0.5 // A/Bテスト用のランダマイザー

	return showButtonA ? (
		<ButtonNoGradient ItemMain={ItemMain} actressInfo={actressInfo} />
	) : (
		<ButtonWithGradient ItemMain={ItemMain} actressInfo={actressInfo} />
	)
}
