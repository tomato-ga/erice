// utils/profileAnalysis.ts

import { ActressDetails, DMMActressProfile } from '@/types/APItypes'

export function parseDetails(details: string | null): ActressDetails | null {
	if (!details) {
		return null
	}
	try {
		return JSON.parse(details) as ActressDetails
	} catch {
		return null
	}
}

export function renderDetailValue(value: unknown): string {
	if (Array.isArray(value)) {
		return value.join(', ')
	}
	if (typeof value === 'object' && value !== null) {
		return JSON.stringify(value)
	}
	return String(value)
}

function calculateAge(birthday: string | null): number | null {
	if (!birthday) {
		return null
	}
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
	if (!debutYear) {
		return 0
	}
	const currentYear = new Date().getFullYear()
	const match = debutYear.match(/(\d{4})年/)
	if (match) {
		return currentYear - Number.parseInt(match[1], 10)
	}
	return 0
}

function getHobbiesDescription(hobbies: string | null): string {
	if (!hobbies) {
		return ''
	}
	return hobbies.split('、').join('、')
}

function getBodyDescription(actress: DMMActressProfile['actress']): string {
	const { height, bust, waist, hip, cup, name } = actress
	if (!(height && bust && waist && hip && cup)) {
		return ''
	}

	const idealBust = height * 0.52
	const idealWaist = height * 0.38
	const idealHip = height * 0.54

	const bustDescription = bust > idealBust ? '大きめ' : bust < idealBust ? '小さめ' : 'ちょうどよい'
	const waistDescription =
		waist < idealWaist ? '細め' : waist > idealWaist ? 'やや太め' : 'ちょうどよい'
	const hipDescription = hip > idealHip ? '大きめ' : hip < idealHip ? '小さめ' : 'ちょうどよい'

	const bodyLineRatio = `${(bust / waist).toFixed(1)}:1.0:${(hip / waist).toFixed(1)}`

	return `
    ${name}さんのスタイルは、バストは${bust}cmで${bustDescription}、ウエストは${waistDescription}で、ヒップは${hipDescription}です。バストの大きさは${cup}カップで${getCupDescription(
					cup,
				)}サイズです。

    身長${height}cmの場合、理想のバストサイズは${idealBust.toFixed(2)}cm、理想のウエストサイズは${idealWaist.toFixed(
					2,
				)}cm、理想のヒップサイズは${idealHip.toFixed(
					2,
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
		I: '超級の大きめ',
		J: '超超級の大きめ',
		K: '超超超級の大きめ',
		L: '超超超超級の大きめ',
		M: '超超超超超級の大きめ',
		N: '超超超超超超級の大きめ',
		O: '超超超超超超超級の大きめ',
		P: '超超超超超超超超級の大きめ',
		Q: '超超超超超超超超超級の大きめ',
		R: '超超超超超超超超超超級の大きめ',
		S: '超超超超超超超超超超級の大きめ',
		T: '超超超超超超超超超超超級の大きめ',
		U: '超超超超超超超超超超超超級の大きめ',
	}
	return cupSizes[cup] || '特徴的な'
}

function getBodyLineDescription(bustWaistRatio: number, hipWaistRatio: number): string {
	if (bustWaistRatio > 1.3 && hipWaistRatio > 1.3) {
		return 'くびれのはっきりとしたメリハリのあるスタイルです。'
	}

	if (bustWaistRatio < 1.1 && hipWaistRatio < 1.1) {
		return 'すらっとした直線的なスタイルです。'
	}

	return 'バランスの取れたスタイルです。'
}

function generateNaturalSentence(parts: (string | null | undefined)[]): string {
	return parts.filter(Boolean).join('').replace(/、 ?$/, '。').replace(/。。/g, '。')
}

function generateBasicInfo(actress: DMMActressProfile['actress'], age: number | null): string {
	// ageがnullの場合は0として扱う
	const ageNumber = age === null ? 0 : (age as number)

	return generateNaturalSentence([
		`${actress.name}さんは、`,
		ageNumber ? `${ageNumber}歳の` : '',
		'AV女優さんです。',
		actress.height ? `身長${actress.height}cmで、` : '',
		'魅力的なボディラインの持ち主です。',
	])
}

function generateCareerAndSNSInfo(careerLength: number, details: ActressDetails | null): string {
	if (!(careerLength > 0 || details?.デビュー || details?.['X (Twitter)'])) {
		return ''
	}

	return generateNaturalSentence([
		details?.デビュー ? `${details.デビュー}にデビューし、` : '',
		careerLength > 0 ? `${careerLength}年のキャリアを積んできました` : '',
		details?.['X (Twitter)']
			? `SNSでも${details['X (Twitter)']}として活動しており、ファンとの交流を大切にしています。`
			: '',
	])
}

function generateAdditionalInfo(
	actress: DMMActressProfile['actress'],
	details: ActressDetails | null,
	hobbies: string,
): string {
	const additionalInfo = [
		actress.prefectures ? `${actress.prefectures}のご出身` : null,
		details?.星座 ? `星座は${details.星座}` : null,
		hobbies ? `趣味は${hobbies}` : null,
	].filter(Boolean)

	return additionalInfo.length > 0 ? `${actress.name}さんは${additionalInfo.join('、')}です。` : ''
}

export function generateRefinedProfileDescription(profile: DMMActressProfile): string {
	const { actress } = profile
	const details = parseDetails(actress.details)
	const age = calculateAge(actress.birthday)
	const careerLength = calculateCareerLength(details?.デビュー?.toString())
	const hobbies = getHobbiesDescription(actress.hobby)
	const bodyDescription = getBodyDescription(actress)

	const sentences = [
		generateBasicInfo(actress, age),
		bodyDescription.trim(),
		generateCareerAndSNSInfo(careerLength, details),
		generateAdditionalInfo(actress, details, hobbies),
	].filter(Boolean)

	return sentences.join('\n\n')
}
