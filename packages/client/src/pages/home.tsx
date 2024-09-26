import NewJam from '../components/CreateJam'
import useStore from '../jamContext'

export default function Home() {
  const { jamPopup, setPopup } = useStore()
  return (
    <div className="h-full w-full bg-amber-400">
      {' '}
      {jamPopup === 'createJam' ? (
        <NewJam closeCallback={() => setPopup('none')} />
      ) : (
        <></>
      )}{' '}
    </div>
  )
}
