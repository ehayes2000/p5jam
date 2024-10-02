import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { client, type TJamPreview } from '../client'
import { useMyID } from '../queries/queryClient'

export default function CompleteJams() {
  const [jams, setJams] = useState<TJamPreview[] | null>()
  const { data: myId } = useMyID()
  const nav = useNavigate()

  useEffect(() => {
    if (!myId) nav('/login')

    client.api.jams.get({ query: { userId: myId } }).then((jams) => {
      if (jams.data) setJams(jams.data)
    })
  }, [])

  return (
    <div>
      {jams ? (
        jams.map((jam) => (
          <div key={jam.id}>
            <Link to={`/jam/${jam.id}`}> {jam.title} </Link>
          </div>
        ))
      ) : (
        <> loading ... </>
      )}
    </div>
  )
}
