import NewJam from '../components/CreateJam'
import JoinJam from '../components/JoinJam'
import useStore from '../stateStore'

export default function Home() {
  const { jamPopup, setPopup } = useStore()
  return (
    <div className="h-full w-full bg-amber-400">
      {jamPopup === 'createJam' ? (
        <NewJam closeCallback={() => setPopup('none')} />
      ) : (
        <></>
      )}
      {jamPopup === 'joinJam' ? (
        <JoinJam closeCallback={() => setPopup('none')} />
      ) : (
        <></>
      )}
    </div>
  )
}
