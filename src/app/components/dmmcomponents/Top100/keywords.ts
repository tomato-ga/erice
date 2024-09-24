// keywords.ts

export interface SubCategory {
	SubCategoryName: string
	Keywords: string[]
}

export interface Category {
	MainCategoryName: string
	Subcategories: SubCategory[]
}

// 新規追加: GroupedCombinedKeywords の型定義
// 更新されたGroupedCombinedKeywordsインターフェース
export interface GroupedCombinedKeywords {
	base: string
	combinations: string[]
	fetchCombinations: string[] // 新しく追加されたフィールド
}

export const AllCategories: Category[] = [
	{
		MainCategoryName: 'シチュエーション',
		Subcategories: [
			{
				SubCategoryName: '場所',
				Keywords: [
					'温泉',
					'マジックミラー号',
					'逆転マジックミラー号',
					'マジックミラー便',
					'相部屋',
					'田舎',
					'溜まり場',
					'汚部屋',
					'海の家',
					'ペアルーム',
					'シェアハウス',
					'銭湯',
					'満員電車',
					'キャンプ',
					'こんなところで',
					'リゾート',
					'実家',
				],
			},
			{
				SubCategoryName: '季節・イベント',
				Keywords: [
					'春',
					'夏',
					'秋',
					'冬',
					'昼間・日中',
					'夏休み',
					'ハロウィーン',
					'クリスマス',
					'卒業式',
					'成人式',
					'お花見',
					'春休み',
					'冬休み',
				],
			},
			{
				SubCategoryName: '職業・仕事',
				Keywords: [
					'OL',
					'女性上司',
					'新入社員',
					'SOD社員',
					'同僚',
					'秘書',
					'女性社長',
					'下着メーカー',
					'派遣社員',
					'受付嬢',
					'インターン',
					'リモートワーク',
					'出張',
					'仕事中',
					'残業中',
					'面接',
					'接客中',
					'内見',
				],
			},
			{
				SubCategoryName: '学生・学校',
				Keywords: [
					'女子校生',
					'JK',
					'女子大生',
					'JD',
					'現役女子大生',
					'教え子',
					'専門学生',
					'部活',
					'女子マネージャー',
					'水泳部',
					'就活生',
					'クラスメイト',
					'家庭教師の教え子',
					'大学生',
					'思春期',
					'学園祭',
					'生徒会長',
					'受験生',
					'新歓',
					'音大生',
					'通学中',
					'学級委員長',
					'家庭訪問',
					'新入生',
					'文学部',
					'教育実習生',
					'転校生',
					'テニス部',
					'美術部',
					'新体操部',
					'剣道部',
					'放課後ラブホ',
					'放課後',
					'合宿',
					// '健康診断・身体測定',
					// '青春系・アオハル',
					'同窓会',
					'体力測定',
				],
			},
			{
				SubCategoryName: 'ナンパ',
				Keywords: ['ナンパ', '飲みナンパ', 'ビーチナンパ', 'プールナンパ'], // 'ビーチナンパ系'　'プールナンパ系'　'逆ナンパ系'
			},
			{
				SubCategoryName: '風俗・リフレ',
				Keywords: [
					'風俗',
					'ソープ',
					'メンズエステ',
					'施術師',
					'整体師',
					'デリヘル',
					'ピンサロ',
					'性感・回春エステ',
					'おっパブ',
					'制服リフレ',
					'M性感',
					'悪徳エステ',
					'オナクラ',
					'女性用風俗',
					'花魁',
					'オイル',
					'マッサージ',
				],
			},
			{
				SubCategoryName: '関係性',
				Keywords: [
					'彼女・恋人',
					'同棲',
					'友人の彼女',
					'元カノ',
					'元カレ',
					'カップル',
					// 'はじめての彼女',
					'年上彼女',
					'兄の彼女',
					'大学生カップル',
					'息子の彼女',
					'カップル交換',
					'人妻',
					'不倫',
					'若妻',
					'他人棒',
					'婚約',
					'上司の奥さん',
					'夫の部下',
					'友達の母',
					'息子の友人',
					'部下の妻',
					'夫の上司',
					'団地妻',
					// '彼女の母・娘の彼氏',
					'ママ友',
					'夫のために',
					'友人の妻',
					'社長夫人',
					// '先輩の妻・夫の後輩',
					'妹',
					'姉妹',
					'姉',
					'義姉',
					'姪っ子',
					'義妹',
					'息子の嫁',
					'義父',
					// '兄の妻・義姉',
					'叔母',
					// '再婚相手の娘・義父',
					'夫婦',
					'親戚',
					// '父の再婚相手・義母',
					'再婚相手',
					'新婚',
					'ブラコン',
					'従妹',
					'従姉妹',
					'従姉',
					'母娘',
					'義母',
					'妻の妹',
					'父娘',
					'義姉',
					'義兄',
					'結婚生活',
					'双子',
					'彼女の妹',
					'彼女のお姉さん',
					'友達の妹',
					'友達の姉',
					'幼馴染',
					'男女の友達',
					'彼女の友達',
					'友達同士',
					'姉の友人',
					'妻の友人',
					'妹の友人',
					'娘の友達',
				],
			},
		],
	},
	{
		MainCategoryName: 'スタイル',
		Subcategories: [
			{
				SubCategoryName: '体型',
				Keywords: [
					'スレンダー',
					'低身長',
					'むっちり',
					'ムチムチ',
					'高身長',
					'スタイル抜群',
					'スリム・華奢',
					'グラマラス',
					'肉感',
					'ぽっちゃり',
					'美脚',
					'軟体',
					// '日焼け・小麦色',
					'ムチムチ',
					'8頭身',
					'日焼け',
					'豊満',
					'敏感体質',
					'色白',
					'色黒',
					'9頭身',
					'10頭身',
					'全身性感帯',
					'脱いだらすごい',
					'超高身長',
					'発育中',
					'身長差',
					'脇毛',
					'くびれ',
				],
			},
			{
				SubCategoryName: 'バスト',
				Keywords: [
					'巨乳',
					'美巨乳',
					'スレンダー巨乳',
					'低身長巨乳',
					'高身長巨乳',
					'柔らか巨乳',
					'ハリのある巨乳',
					'乳揺れ',
					'色白巨乳',
					'爆乳',
					'柔らか爆乳',
					'低身長爆乳',
					'高身長爆乳',
					'超爆乳',
					'スレンダー爆乳',
					'微乳',
					'ちっぱい',
					'美乳',
					'薄ピンク乳首',
					'低身長ちっぱい',
					// '高身長ちっぱい',
					'ロケット乳',
					'マシュマロ乳',
					'おっぱいフェチ',
					'ノーブラ誘惑',
					'おっぱい誘惑',
					'敏感乳首',
					'母乳',
					'スペンス乳腺',
					// '小さめ乳輪',
					'大きめ乳輪',
					'柔らか乳',
					'乳首フェチ',
					'スレンダー美乳',
					'垂れ乳',
				],
			},
			{
				SubCategoryName: 'カップ数',
				Keywords: [
					'Aカップ',
					'Bカップ',
					'Cカップ',
					'Dカップ',
					'Eカップ',
					'Fカップ',
					'Gカップ',
					'Hカップ',
					'Iカップ',
					'Jカップ',
					'Kカップ',
					'Lカップ',
					'Mカップ',
					'Oカップ',
					'Pカップ',
					'Qカップ',
					'Rカップ',
					'Sカップ',
				],
			},
			{
				SubCategoryName: 'お尻',
				Keywords: [
					'美尻',
					'プリ尻',
					'桃尻',
					'むち尻',
					'デカ尻',
					'巨尻',
					'お尻フェチ',
					'エロ尻',
					'爆尻',
					'お尻誘惑',
					'神尻',
					'壁尻',
				],
			},
			{
				SubCategoryName: 'あそこのスタイル',
				Keywords: ['パイパン', 'つるつるパイパン', '剛毛', 'ほぼパイパン', '美マン'],
			},
			{
				SubCategoryName: '女性のタイプ',
				Keywords: [
					'芸能人',
					'モデル',
					'元グラビアアイドル',
					'元アイドル',
					'元アナウンサー',
					'元着エロアイドル',
					'元子役',
					'コスプレイヤー',
					'女子アナ',
					'インフルエンサー',
					'グラドル',
					'レースクイーン',
					'地下アイドル',
					'チアリーダー',
					'アイドル',
					'読者モデル',
					'下着モデル',
					'お天気お姉さん',
					'デッサンモデル',
					'水着モデル',
					'コンパニオン',
					'ヌードモデル',
					'動画配信者',
					'キャンギャル',
					'変身ヒロイン',
				],
			},
		],
	},
	{
		MainCategoryName: 'フェチ',
		Subcategories: [
			{
				SubCategoryName: 'フェチ',
				Keywords: [
					'足フェチ',
					// 'つま先フェチ',
					'手フェチ',
					'脇フェチ',
					'髪フェチ',
					'アナルフェチ',
					'鼻フェチ',
					'陰毛フェチ',
					'筋肉フェチ',
					'お尻フェチ',
					// '生挿入フェチ',
					// '眼球フェチ',
					'くすぐりフェチ',
					// 'フードクラッシュ',
					'聖水フェチ',
					// '鼻水フェチ',
					// '嘔吐フェチ',
					// '生理フェチ',
					'おもらしフェチ',
					// 'スカトロフェチ',
					// 'アクシデントフェチ',
					// 'ロリコン・ショタコン',
					'年上フェチ',
					// '不自由フェチ',
					// 'ひっかき傷フェチ',
					// '隠語フェチ',
					'中だしフェチ',
					'妊婦フェチ',
					'二穴',
					'デブ専',
					// 'エイジプレイフェチ',
					'野外露出',
					// 'ボディペイントフェチ',
					// '異世界フェチ',
					// '痴漢フェチ',
					// 'テレフォンセックスフェチ',
					'着衣フェチ',
					// '死体フェチ',
					'女装',
					'男の娘',
					'ニューハーフ',
					// 'M格闘フェチ',
					// '複数プレイフェチ',
					'JOI',
					// 'ハイヒールフェチ',
					// 'ラテックスフェチ',
					'パンストフェチ',
					// '虫フェチ',
					'制服フェチ',
					// '靴フェチ',
					// 'ゼンタイフェチ',
					// 'ペニバンフェチ',
					// '触手フェチ',
					// 'スライムフェチ',
					// 'コルセットフェチ',
					// '機械フェチ',
					'汚れフェチ',
					'CBT',
					'首絞めフェチ',
					// 'マミフィケイション',
					// 'ロウソクプレイフェチ',
					// 'フィストフェチ',
					'ロープ',
					'緊縛',
					'射精管理',
					// '五感遮断フェチ',
					// 'ポニープレイフェチ',
					// 'フェイスファックフェチ',
					// 'インパクトプレイ',
					// '監禁フェチ',
					'拘束フェチ',
					'太ももフェチ',
					// 'お腹フェチ',
					// '耳フェチ',
					// 'ほくろフェチ',
					// '背中フェチ',
					'血管フェチ',
					// 'うなじフェチ',
					'熟女フェチ',
					// '異物フェチ',
					'露出フェチ',
					// '嘔吐フェチ',
				],
			},
		],
	},
	{
		MainCategoryName: 'コスチューム',
		Subcategories: [
			{
				SubCategoryName: '制服・コスプレ・水着',
				Keywords: [
					'コスプレ',
					'スク水',
					'ブルマ',
					'水着',
					'マイクロビキニ',
					// 'マイクロブラ',
					'紐パン',
					'ハイレグ',
					'制服',
				],
			},
			{
				SubCategoryName: '下着',
				Keywords: ['下着', 'パンスト', '絶対領域', 'Tバック', 'ブラジャー'],
			},
		],
	},
	{
		MainCategoryName: 'ジャンル',
		Subcategories: [
			{
				SubCategoryName: '企画',
				Keywords: [
					'数珠つなぎ',
					'チャレンジ',
					'モニタリング',
					// '特殊設定',
					'時間停止',
					'ファン感謝祭',
					'ギャラアップ',
					'罰ゲーム',
					'検証',
					'台本なし',
					'ミッション',
					'バスツアー',
					'透明人間',
					'ゲーム系',
					'バラエティ',
					// '壁チ○���系',
					'実況・解説',
				],
			},
			{
				SubCategoryName: '年齢設定',
				Keywords: [
					'18歳',
					'19歳',
					'20代',
					'20代前半',
					'20代後半',
					'20歳',
					'21歳',
					'22歳',
					'23歳',
					'24歳',
					'25歳',
					'26歳',
					'27歳',
					'28歳',
					'29歳',
					'30代',
					'30代前半',
					'30代後半',
					'30歳',
					'31歳',
					'32歳',
					'33歳',
					'34歳',
					'35歳',
					'36歳',
					'37歳',
					'38歳',
					'39歳',
					'40代',
					'四十路',
					'40歳',
					'50代',
					'五十路',
					'60代',
					'六十路',
					'Z世代',
					'アラサー',
					// 'アラトゥエ',
					'アラフィフ',
					'アラフォー',
					'熟女',
				],
			},
		],
	},
	{
		MainCategoryName: 'プレイ',
		Subcategories: [
			{
				SubCategoryName: 'プレイ',
				Keywords: [
					'M男',
					'M女',
					'フェラチオ',
					'汗だく',
					'オナニー',
					'接吻',
					'おしっこ',
					// '観察・見学系',
					'パンチラ',
					'おしゃぶり',
					'ぶっかけ',
					'顔射',
					'中出し',
					'騎乗位',
					'お尻の穴',
					'唾液',
					'全裸',
					'脚・足',
					'ワレメ',
					'足コキ',
					'ぴっちり',
					'パイズリ',
					'乳首責め',
					'ディルドフェラ',
					'透け',
					'足裏',
					'手コキ',
					'眼鏡',
					'正常位',
					'舌',
					'固定バイブ',
					'女性向けAV',
					'乳首開発',
					'脇',
					'口内射精',
					'固定ディルド',
					'オイルまみれ',
					'対面座位',
					'ディルド',
					'濡れ',
					'クンニチャレンジ',
					'局部',
					'クンニ',
					'3P・4P',
					'乱交',
					'ハメ撮り',
					'異物挿入',
					'男の潮吹き',
					'おもちゃ',
					'監禁',
					'浣腸',
					'顔面騎乗',
					'鬼畜',
					'くすぐり',
					'ゲロ',
					'拘束',
					'拷問',
					'縛り',
					'緊縛',
					'羞恥',
					'スパンキング',
					'即ハメ',
					'電マ',
					'ドラッグ',
					'罵倒',
					'鼻フック',
					'孕ませ',
					'フィスト',
					'放置',
					'放尿',
					'お漏らし',
					'母乳',
					'ポルチオ',
					'レズキス',
					'ローション',
					'オイル',
				],
			},
			{
				SubCategoryName: 'アブノーマル',
				Keywords: ['ディープスロート', 'ごっくん', 'アナル', 'アナルプラグ', '飲尿', 'イラマチオ'],
			},
			{
				SubCategoryName: 'プレイの激しさ・連続性',
				Keywords: [
					'汗だく',
					'アクメ',
					'オーガズム',
					'絶頂',
					'激イキ',
					'激しい',
					'ひたすら',
					'何度も何度も',
					'ハメまくり',
					'ヤリまくり',
					'スプラッシュ',
					'性感開発',
					'濃厚セックス',
					'絶倫',
					'エンドレス',
					'ノンストップ',
					'トランス',
					'快楽堕ち',
					'絶倫男性',
					'凄テク我慢',
					'もうイッてる',
					'エクスタシー',
					'ハード',
					'プレス',
					'スローセックス',
					'もう射精してる',
				],
			},
		],
	},
]

/**
 * 2つのサブカテゴリーのキーワードを基に、両方向の組み合わせをグループ化して生成します。
 * 表示用と検索用の両方のフォーマットを生成します。
 *
 * @param subcat1 - 第一のサブカテゴリー名
 * @param subcat2 - 第二のサブカテゴリー名
 * @returns GroupedCombinedKeywords の配列
 */
export function GenerateCombinedKeywordsGeneric(
	subcat1: string,
	subcat2: string,
): GroupedCombinedKeywords[] {
	// サブカテゴリー1のキーワードを取得
	const keywords1 = AllCategories.flatMap(category =>
		category.Subcategories.filter(sub => sub.SubCategoryName === subcat1).flatMap(
			sub => sub.Keywords,
		),
	)

	// サブカテゴリー2のキーワードを取得
	const keywords2 = AllCategories.flatMap(category =>
		category.Subcategories.filter(sub => sub.SubCategoryName === subcat2).flatMap(
			sub => sub.Keywords,
		),
	)

	const groups: GroupedCombinedKeywords[] = []

	// サブカテゴリー1を基にした組み合わせを生成
	for (const k1 of keywords1) {
		groups.push({
			base: k1,
			combinations: keywords2.map(k2 => `${k1}×${k2}`),
			fetchCombinations: keywords2.map(k2 => `${k1}|${k2}`),
		})
	}

	// サブカテゴリー2を基にした組み合わせを生成
	for (const k2 of keywords2) {
		groups.push({
			base: k2,
			combinations: keywords1.map(k1 => `${k2}×${k1}`),
			fetchCombinations: keywords1.map(k1 => `${k2}|${k1}`),
		})
	}

	return groups
}

// 体型とバストの組み合わせキーワードをグループ化して生成
export const CombinedGroupedKeywords: GroupedCombinedKeywords[] = GenerateCombinedKeywordsGeneric(
	'体型',
	'バスト',
)
