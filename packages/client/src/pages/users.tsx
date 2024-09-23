import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { client } from '../client'

function Users() {
  const [users, setUsers] = useState<
    NonNullable<Awaited<ReturnType<typeof client.api.users.get>>['data']>
  >([])

  useEffect(() => {
    ;(async () => {
      const { data } = await client.api.users.get()
      if (data) setUsers(data)
    })()
  }, [])

  return (
    <div className="grid gap-4">
      {users.map((u) => (
        <Link key={u.id} className="border p-4 rounded-md" to={`/user/${u.id}`}>
          <span className="fw-bold">{u.name}</span>
          <div className="d-flex gap-4">
            <span className="comment-icon ">
              <i className="bi bi-chat"> </i>
              <span> {u.commentCount} </span>
            </span>
            <span className="comment-icon ">
              <i className="bi bi-bar-chart"></i>
              <span> {u.postCount} </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default Users
