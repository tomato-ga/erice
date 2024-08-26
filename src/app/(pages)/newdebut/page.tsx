import { z } from 'zod'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, User, Ruler } from 'lucide-react'

const WorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  imageUrl: z.string(),
})

const ActressSchema = z.object({
  actressname: z.string(),
  debutDays: z.number(),
  releaseStatus: z.string(),
  works: z.array(WorkSchema),
})

type Actress = z.infer<typeof ActressSchema>

const sampleActresses: Actress[] = [
  {
    actressname: "柿沢千智",
    debutDays: 31,
    releaseStatus: "先行配信開始！",
    works: [
      {
        id: "SDJS-279",
        title: "SOD女子社員 中途入社3か月 営業部 柿沢千智 初AV出演 誠実をモットーに、まじめに枕営業がんばります！！",
        url: "/watch/sdjs-279/",
        imageUrl: "/images/fanzawebp/sdjs/1sdjs00279pl.webp",
      }
    ]
  },

]

function NewActressCard({ actress }: { actress: Actress }) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">{actress.actressname}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Link href={actress.works[0].url} className="relative overflow-hidden rounded-lg">
            <img
              src={actress.works[0].imageUrl}
              alt={actress.works[0].id}
              className="object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
            <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 text-sm rounded">
              {actress.works[0].id}
            </span>
          </Link>
        </div>

        <div className="text-center">
          <Badge variant="outline" className="text-lg font-semibold py-1 px-3">
            デビューまで{actress.debutDays}日！{actress.releaseStatus}
          </Badge>
        </div>

        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-1/3"><User className="inline-block mr-2" /> 女優名</TableHead>
              <TableCell>{actress.actressname}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead><CalendarDays className="inline-block mr-2" /> 作品名</TableHead>
              <TableCell>
                <Link href={actress.works[0].url} className="text-indigo-600 hover:text-indigo-800 transition-colors duration-300">
                  {actress.works[0].title}
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="text-center">
          <Link 
            href={actress.actressname} 
            className="inline-block bg-indigo-600 text-white font-bold py-2 px-4 rounded-full hover:bg-indigo-700 transition-colors duration-300"
          >
            {actress.actressname}のAV・エロ動画一覧
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function NewActressesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">新人AV女優を100人厳選！</span>
          <span className="block text-indigo-600">今後のデビュー予定一覧</span>
        </h1>

        <p className="mt-3 text-xl text-gray-500 sm:mt-5 sm:text-2xl max-w-prose mx-auto text-center">
          AVデビューした新人女優、素人女性を100人厳選して紹介！デビュー直後やこれからデビュー予定のAV女優・セクシー女優がすぐに見つかる随時更新しているページです。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sampleActresses.map((actress) => (
            <NewActressCard key={actress.actressname} actress={actress} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">デビュー年月で絞り込む</h2>
          <ul className="flex flex-wrap justify-center gap-4">
            {['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月'].map((month) => (
              <li key={month}>
                <Link 
                  href={`/women/debut-2024${month.padStart(2, '0')}/`}
                  className="inline-block bg-white text-indigo-600 font-semibold py-2 px-4 rounded-full border border-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors duration-300"
                >
                  2024年{month}デビュー
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}