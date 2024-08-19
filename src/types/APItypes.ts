import { z } from 'zod'

export const DMMActressRelatedItemSchema = z.object({
	id: z.number(),
	content_id: z.string(),
	title: z.string(),
	url: z.string(),
	affiliate_url: z.string(),
	release_date: z.string(),
	imageURL: z.string()
})

export const DMMActressRelatedApiResponseSchema = z.object({
	items: z.array(DMMActressRelatedItemSchema)
})

export type DMMActressRelatedItem = z.infer<typeof DMMActressRelatedItemSchema>
export type DMMActressRelatedApiResponse = z.infer<typeof DMMActressRelatedApiResponseSchema>

export const DMMActressProfileSchema = z.object({
	actress: z.object({
		id: z.number(),
		dmm_id: z.number(),
		name: z.string(),
		ruby: z.string(),
		bust: z.number().nullable().or(z.string()),
		waist: z.number().nullable().or(z.string()),
		hip: z.number().nullable().or(z.string()),
		height: z.number().nullable().or(z.string()),
		birthday: z.string().nullable().or(z.string()),
		blood_type: z.string().nullable().or(z.string()),
		hobby: z.string().nullable().or(z.string()),
		prefectures: z.string().nullable().or(z.string()),
		image_url_small: z.string().nullable().or(z.string()),
		image_url_large: z.string().nullable().or(z.string()),
		list_url: z.string().nullable().or(z.string()),
		cup: z.string().nullable().or(z.string()).optional()
	})
})

export type DMMActressProfile = z.infer<typeof DMMActressProfileSchema>

// ActressProfile JSON response
// id: 24788,
// dmm_id: 1064982,
// name: '八掛うみ',
// ruby: 'やつがけうみ',
// bust: 80,
// waist: 57,
// hip: 85,
// height: 160,
// birthday: '2000-09-02',
// blood_type: 'A',
// hobby: '料理/フルート',
// prefectures: '東京都',
// image_url_small: 'http://pics.dmm.co.jp/mono/actjpgs/thumbnail/yatugake_umi.jpg',
// image_url_large: 'http://pics.dmm.co.jp/mono/actjpgs/yatugake_umi.jpg',
// list_url: 'https://al.dmm.co.jp/?lurl=https%3A%2F%2Fwww.dmm.co.jp%2Fdigital%2Fvideoa%2F-%2Flist%2F%3D%2Farticle%3Dactress%2Fid%3D1064982%2F&af_id=kamipanmen-990&ch=api',
// cup: ''
