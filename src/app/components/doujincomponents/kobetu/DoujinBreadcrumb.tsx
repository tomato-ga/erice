import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { HomeIcon } from 'lucide-react'
import { ListItem, BreadcrumbList as SchemaBreadcrumbList } from 'schema-dts'

interface DoujinBreadcrumbProps {
	breadcrumbData: SchemaBreadcrumbList & { itemListElement: ListItem[] }
}

// BreadcrumbSeparatorコンポーネント
const BreadcrumbSeparator = () => <span className='mx-2'>/</span>

export default function DoujinBreadcrumb({ breadcrumbData }: DoujinBreadcrumbProps) {
	return (
		<Breadcrumb className='mb-4'>
			<BreadcrumbList>
				{breadcrumbData.itemListElement.map((breadcrumbItem, index) => (
					<BreadcrumbItem key={index}>
						{index === 0 ? (
							<BreadcrumbLink href={breadcrumbItem.item as string}>
								<HomeIcon className='h-4 w-4' />
								<span className='sr-only'>{breadcrumbItem.name as string}</span>
							</BreadcrumbLink>
						) : index === breadcrumbData.itemListElement.length - 1 ? (
							<BreadcrumbPage>{breadcrumbItem.name as string}</BreadcrumbPage>
						) : (
							<BreadcrumbLink href={breadcrumbItem.item as string}>
								{breadcrumbItem.name as string}
							</BreadcrumbLink>
						)}
						{index < breadcrumbData.itemListElement.length - 1 && <BreadcrumbSeparator />}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
