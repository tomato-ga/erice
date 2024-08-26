export function formatDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
	return new Date(dateString).toLocaleDateString('ja-JP', options)
}

export function formatMMDDDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { month: 'numeric', day: 'numeric' }
	return new Date(dateString).toLocaleDateString('ja-JP', options)
}
