import { IconType } from 'react-icons'
import { z } from 'zod'

export const NavigationItemSchema = z.object({
	label: z.string(),
	href: z.string(),
	icon: z.custom<IconType>(),
})

export type NavigationItem = z.infer<typeof NavigationItemSchema>
