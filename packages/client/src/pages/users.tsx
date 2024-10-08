import { Link, useLoaderData } from 'react-router-dom';
import { type TUser } from '../client';

function Users() {
  const users = useLoaderData() as TUser[];
  return (
    <div className="grid gap-4 p-6">
      {users ? (
        users.map((u) => (
          <Link key={u.id} className="border p-4" to={`/user/${u.name}`}>
            <span className="fw-bold">{u.name}</span>
          </Link>
        ))
      ) : (
        <> No Users :( </>
      )}
    </div>
  );
}

export default Users;
