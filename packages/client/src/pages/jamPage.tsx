import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { client } from '../client'
import Jam from '../components/Jam'
import { QUERY_KEYS } from '../queries/client'

export default function JamPage() {
  let { id } = useParams()
  const { data: jam } = useQuery({
    queryKey: QUERY_KEYS.JAM_BY_ID(id ?? ''),
    queryFn: async () => {
      const { data } = await client.api.jams({ id: id ?? '' }).get()
      return data
    },
  })

  return jam ? <Jam jam={jam} /> : <div> ... loading </div>
}
