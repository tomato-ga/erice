import { Slash } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

interface LocalBreadcrumbItem {
	href?: string
	label: string
}

interface BreadcrumbProps {
	items: LocalBreadcrumbItem[]
}

export function BreadcrumbWithCustomSeparator({ items }: BreadcrumbProps) {
	return (
		<Breadcrumb>
			<BreadcrumbList>
				{items.map((item, index) => (
					<React.Fragment key={index}>
						<BreadcrumbItem>
							{item.href ? (
								<BreadcrumbLink asChild>
									<Link href={item.href}>{item.label}</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{item.label}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{index < items.length - 1 && (
							<BreadcrumbSeparator>
								<Slash />
							</BreadcrumbSeparator>
						)}
					</React.Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
