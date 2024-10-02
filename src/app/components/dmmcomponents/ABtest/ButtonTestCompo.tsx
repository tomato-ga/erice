import { trackImpression, trackClick } from '@/lib/abTestTracking'
// ... existing imports

export default function ButtonTestComponent({ ItemMain, actressInfo }: ButtonTestComponentProps) {
  const showButtonA = Math.random() > 0.5 // A/Bテスト用のランダマイザー

  useEffect(() => {
    const variant = showButtonA ? 'no-gradient-button' : 'with-gradient-button'
    trackImpression('ButtonGradientTest', variant, {
      itemId: ItemMain.content_id,
      actressId: actressInfo?.data?.[0]?.actress_id,
    })
  }, [showButtonA, ItemMain, actressInfo])

  const handleButtonClick = () => {
    const variant = showButtonA ? 'no-gradient-button' : 'with-gradient-button'
    trackClick('ButtonGradientTest', variant, {
      itemId: ItemMain.content_id,
      actressId: actressInfo?.data?.[0]?.actress_id,
    })
  }

  return showButtonA ? (
    <ButtonNoGradient ItemMain={ItemMain} actressInfo={actressInfo} onClick={handleButtonClick} />
  ) : (
    <ButtonWithGradient ItemMain={ItemMain} actressInfo={actressInfo} onClick={handleButtonClick} />
  )
}