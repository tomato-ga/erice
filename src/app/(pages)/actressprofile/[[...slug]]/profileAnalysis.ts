// utils/profileAnalysis.ts

import { ActressDetails, DMMActressProfile } from '@/types/APItypes'

export function parseDetails(details: string | null): ActressDetails | null {
	if (!details) return null
	try {
		return JSON.parse(details) as ActressDetails
	} catch {
		return null
	}
}

function calculateAge(birthday: string | null): number {
	if (!birthday) return 0
	const birthDate = new Date(birthday)
	const today = new Date()
	let age = today.getFullYear() - birthDate.getFullYear()
	const m = today.getMonth() - birthDate.getMonth()
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--
	}
	return age
}

function calculateCareerLength(debutYear: string | undefined): number {
	if (!debutYear) return 0
	const currentYear = new Date().getFullYear()
	const match = debutYear.match(/(\d{4})年/)
	return match ? currentYear - parseInt(match[1], 10) : 0
}

function getHobbiesDescription(hobbies: string | null): string {
	if (!hobbies) return ''
	return hobbies.split('、').join('、')
}

function getBodyDescription(actress: DMMActressProfile['actress']): string {
	const { height, bust, waist, hip, cup, name } = actress
	if (!height || !bust || !waist || !hip || !cup) return ''

	const idealBust = height * 0.52
	const idealWaist = height * 0.38
	const idealHip = height * 0.54

	const bustDescription = bust > idealBust ? '大きめ' : bust < idealBust ? '小さめ' : 'ちょうどよい'
	const waistDescription = waist < idealWaist ? '細め' : waist > idealWaist ? 'やや太め' : 'ちょうどよい'
	const hipDescription = hip > idealHip ? '大きめ' : hip < idealHip ? '小さめ' : 'ちょうどよい'

	const bodyLineRatio = `${(bust / waist).toFixed(1)}:1.0:${(hip / waist).toFixed(1)}`

	return `
    ${name}さんのスタイルは、バストは${bust}cmで${bustDescription}、ウエストは${waistDescription}で、ヒップは${hipDescription}です。バストの大きさは${cup}カップで${getCupDescription(
		cup
	)}サイズです。

    身長${height}cmの場合、理想のバストサイズは${idealBust.toFixed(2)}cm、理想のウエストサイズは${idealWaist.toFixed(
		2
	)}cm、理想のヒップサイズは${idealHip.toFixed(
		2
	)}cmとされています。${name}さんの身長からすると、バストは${bustDescription}、ウエストは${waistDescription}、ヒップは${hipDescription}です。

    ボディーライン比は、${bodyLineRatio} です。${getBodyLineDescription(bust / waist, hip / waist)}
  `
}

function getCupDescription(cup: string): string {
	const cupSizes: { [key: string]: string } = {
		A: '小さめ',
		B: 'やや小さめ',
		C: '標準的',
		D: 'やや大きめ',
		E: '大きめ',
		F: 'かなり大きめ',
		G: '非常に大きめ',
		H: '極めて大きめ',
		I: '超級大きめ',
		J: '超級超級大きめ',
		K: '超級超級超級大きめ',
		L: '超級超級超級超級大きめ',
		M: '超級超級超級超級超級大きめ',
		N: '超級超級超級超級超級超級大きめ',
		O: '超級超級超級超級超級超級超級大きめ',
		P: '超級超級超級超級超級超級超級超級大きめ',
		Q: '超級超級超級超級超級超級超級超級大きめ',
		R: '超級超級超級超級超級超級超級超級大きめ',
		S: '超級超級超級超級超級超級超級超級大きめ',
		T: '超級超級超級超級超級超級超級超級大きめ',
		U: '超級超級超級超級超級超級超級超級大きめ'
	}
	return cupSizes[cup] || '特徴的な'
}

function getBodyLineDescription(bustWaistRatio: number, hipWaistRatio: number): string {
	if (bustWaistRatio > 1.3 && hipWaistRatio > 1.3) {
		return 'くびれのはっきりとしたメリハリのあるスタイルです。'
	} else if (bustWaistRatio < 1.1 && hipWaistRatio < 1.1) {
		return 'すらっとした直線的なスタイルです。'
	} else {
		return 'バランスの取れたスタイルです。'
	}
}

function generateNaturalSentence(parts: (string | null | undefined)[]): string {
	return parts.filter(Boolean).join('').replace(/、 ?$/, '。').replace(/。。/g, '。')
}

export function generateRefinedProfileDescription(profile: DMMActressProfile): string {
	const { actress } = profile
	const details = parseDetails(actress.details)
	const age = calculateAge(actress.birthday)
	const careerLength = calculateCareerLength(details?.デビュー?.toString())
	const hobbies = getHobbiesDescription(actress.hobby)
	const bodyDescription = getBodyDescription(actress)

	const sentences: string[] = []

	// 基本情報
	sentences.push(
		generateNaturalSentence([
			`${actress.name}さんは、`,
			age ? `${age}歳の` : '',
			'AV女優さんです。',
			actress.height ? `身長${actress.height}cmで、` : '',
			'魅力的なボディラインの持ち主です。'
		])
	)

	// 詳細なボディ説明
	if (bodyDescription.trim()) {
		sentences.push(bodyDescription.trim())
	}

	// キャリアとSNS
	if (careerLength > 0 || details?.デビュー || details?.['X (Twitter)']) {
		sentences.push(
			generateNaturalSentence([
				details?.デビュー ? `${details.デビュー}にデビューし、` : '',
				careerLength > 0 ? `${careerLength}年のキャリアを積んできました。` : '',
				details?.['X (Twitter)']
					? `SNSでも${details['X (Twitter)']}として活動しており、ファンとの交流を大切にしています。`
					: ''
			])
		)
	}

	// 追加情報
	const additionalInfo: string[] = []
	if (actress.prefectures) additionalInfo.push(`${actress.prefectures}のご出身`)
	if (details?.星座) additionalInfo.push(`星座は${details.星座}`)
	if (hobbies) additionalInfo.push(`趣味は${hobbies}`)

	if (additionalInfo.length > 0) {
		sentences.push(`${actress.name}さんは${additionalInfo.join('、')}です。`)
	}

	// まとめ
	// sentences.push(
	// 	generateNaturalSentence([
	// 		'魅力的なボディラインと個性的な魅力で、',
	// 		'ファンを魅了し続けています。',
	// 		'これからの活躍にも期待が高まります。'
	// 	])
	// )

	return sentences.join('\n\n')
}
