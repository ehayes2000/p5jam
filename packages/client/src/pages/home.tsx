import { useState, useEffect } from 'react'
import { useSelector } from '@xstate/store/react'
import NewJam from '../components/CreateJam'
import JoinJam from '../components/JoinJam'
import { store } from '../stateStore'
import HighlightedPost from '../components/highlightedPost'
import { client, TPost } from '../client'

export default function Home() {
  const { jamPopup } = useSelector(store, (state) => state.context)
  const [featuredPost, setFeaturedPost] = useState<TPost | null>()

  useEffect(() => {
    client.api.posts.featured.get().then((response) => {
      if (response.data) setFeaturedPost(response.data)
    })
  }, [])

  return (
    <div className="-z-50 flex h-full w-full items-center justify-center">
      {!featuredPost || (
        <div className="absolute left-0 top-0 -z-0 h-screen w-screen">
          <HighlightedPost post={featuredPost} />
        </div>
      )}
      {jamPopup === 'createJam' ? (
        <div className="z-50">
          <NewJam
            closeCallback={() => store.send({ type: 'userClosedPopup' })}
          />
        </div>
      ) : (
        <></>
      )}
      {jamPopup === 'joinJam' ? (
        <div className="z-50">
          <JoinJam
            closeCallback={() => store.send({ type: 'userClosedPopup' })}
          />
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}
