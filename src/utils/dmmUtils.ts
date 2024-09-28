export function formatDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString('ja-JP', options)
}

export function formatMMDDDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' }
	return new Date(dateString).toLocaleDateString('ja-JP', options)
}

export function formatDateCampaign(dateString: string): string {
	const date = new Date(dateString)
	return new Intl.DateTimeFormat('ja-JP', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC', // UTCを指定して日付変換を防ぐ
	}).format(date)
}
