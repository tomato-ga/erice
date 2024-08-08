import PriceDisplay from './PriceDisplay'
import GenreTag from './GenreTag'

export default function SaleItemCard({ item }) {
	return (
		<div className="bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 ease-in-out transform hover:scale-105">
			<div className="relative">
				<img src={item.imageURL} alt={item.title} width={300} height={450} className="w-full object-cover" />
			</div>
			<div className="p-4">
				<h2 className="text-lg font-semibold mb-2 line-clamp-2" title={item.title}>
					{item.title}
				</h2>
				<PriceDisplay listPrice={item.listprice} salePrice={item.salePrice} />
				<p className="text-sm text-gray-600 mb-2 line-clamp-1" title={item.actress}>
					出演: {item.actress}
				</p>
				<div className="flex flex-wrap gap-1 mt-2">
					{item.genre.slice(0, 3).map((genre) => (
						<GenreTag key={genre} genre={genre} />
					))}
				</div>
			</div>
		</div>
	)
}
