import { Link } from 'react-router-dom'
import { client } from '../client'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '../queries/client'

function Users() {
  const { data: users } = useQuery({
    queryKey: QUERY_KEYS.USERS,
    queryFn: async () => {
      const { data } = await client.api.users.get()
      return data
    },
  })

  return (
    <div className="grid gap-4">
      {users?.map((u) => (
        <Link key={u.id} className="rounded-md border p-4" to={`/user/${u.id}`}>
          <span className="fw-bold">{u.name}</span>
          <div className="d-flex gap-4">
            <span className="comment-icon">
              <i className="bi bi-chat"> </i>
              <span> {u.commentCount} </span>
            </span>
            <span className="comment-icon">
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
