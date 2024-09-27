import { useSelector } from '@xstate/store/react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import Jam from '../components/Jam'
import { store } from '../stateStore'

export default function JamPage() {
  let { id } = useParams()
  const jam = useSelector(store, (state) => state.context.jam)

  useEffect(() => {
    if (!jam || jam.id !== id)
      (async () => {
        // ts narrowing isn't smart enough
        if (id) {
          const { data } = await client.api.jams({ id }).get()
          if (data)
            store.send({
              type: 'receivedJamFromServer',
              payload: { jam: data },
            })
        }
      })()
  }, [])
  return jam ? <Jam jam={jam} /> : <div> ... loading </div>
}
