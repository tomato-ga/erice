// BreadcrumbNav.tsx
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
} from '@/components/ui/breadcrumb'

interface BreadcrumbProps {
	items: { name: string; href: string }[]
}

// BreadcrumbSeparator コンポーネント
const BreadcrumbSeparator = () => <span className='mx-2'>/</span>

export default function BreadcrumbNav({ items }: BreadcrumbProps) {
	return (
		<Breadcrumb className='mb-4'>
			<BreadcrumbList>
				{items.map((item, index) => (
					<BreadcrumbItem key={index}>
						{index === 0 ? (
							<BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
						) : index === items.length - 1 ? (
							<BreadcrumbPage>{item.name}</BreadcrumbPage>
						) : (
							<BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
						)}
						{/* 最後のアイテムでない場合、Separatorを表示 */}
						{index < items.length - 1 && <BreadcrumbSeparator />}
					</BreadcrumbItem>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
