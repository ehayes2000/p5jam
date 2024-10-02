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
    else {
      client.api.jams.get({ query: { userId: myId } }).then((jams) => {
        if (jams.data) setJams(jams.data)
      })
    }
  }, [])

  return (
    <div className="flex flex-col gap-2 px-6 py-4">
      {jams ? (
        jams.map((jam) => (
          <div key={jam.id} className="border p-2">
            <Link to={`/jam/${jam.id}`}>
              <h2 className=""> {jam.title} </h2>
              <h3 className="text-gray-600"> {jam.endTime.toString()} </h3>

              <div> </div>
            </Link>
          </div>
        ))
      ) : (
        <> loading ... </>
      )}
    </div>
  )
}
