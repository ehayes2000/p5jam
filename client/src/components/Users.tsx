import { gql, useQuery } from "@apollo/client";

const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      name
    }
  }
`;

interface User {
  name: string;
}

function Users() {
  const { loading, error, data } = useQuery(USERS_QUERY);
  if (loading) return <p> Loading ...</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <div>
      {data.users.map((u: User) => (
        <p>{u.name}</p>
      ))}
    </div>
  );
}

export default Users;
