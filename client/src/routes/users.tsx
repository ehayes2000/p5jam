import { useEffect, useState } from "react";
import { getUsers } from "../client";
import { type User } from "../types";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers().then((users) => setUsers(users));
  }, []);
  return (
    <div className="grid gap-4">
      {users.map((u) => (
        <div className="border p-4 rounded-md">
          <span className="fw-bold">{u.name}</span>
          <div className="d-flex gap-4">
            <span className="comment-icon ">
              <i className="bi bi-heart"> </i>
              <span> {u.commentCount} </span>
            </span>
            <span className="comment-icon ">
              <i className="bi bi-bar-chart"></i>
              <span> {u.postCount} </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Users;
