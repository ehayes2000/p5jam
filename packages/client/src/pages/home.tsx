import { useSelector } from '@xstate/store/react'
import NewJam from '../components/CreateJam'
import JoinJam from '../components/JoinJam'
import { store } from '../stateStore'

export default function Home() {
  const { jamPopup } = useSelector(store, (state) => state.context)
  return (
    <div className="h-full w-full bg-amber-400">
      {jamPopup === 'createJam' ? (
        <NewJam closeCallback={() => store.send({ type: 'userClosedPopup' })} />
      ) : (
        <></>
      )}
      {jamPopup === 'joinJam' ? (
        <JoinJam
          closeCallback={() => store.send({ type: 'userClosedPopup' })}
        />
      ) : (
        <></>
      )}
    </div>
  )
}
