import { useEffect } from 'react'
import Jam from '../components/Jam'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import useStore from '../stateStore'

export default function JamPage() {
  let { id } = useParams()
  let { jam, setJam } = useStore()

  useEffect(() => {
    if (!jam || jam.id !== id)
      (async () => {
        if (id) {
          const { data } = await client.api.jams({ id }).get()
          if (data) setJam(data)
        }
      })()
  }, [])
  return jam ? <Jam jam={jam} /> : <div> ... loading </div>
}
