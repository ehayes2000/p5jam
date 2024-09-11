import { useEffect, useState } from "react";
import { getUsers } from "../client";
import { type User } from "../types";
import formatNumber from "../junkDrawer/formatNumber";

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    getUsers().then((users) => setUsers(users));
  }, []);
  return (
    <div className="d-flex flex-column p-3 gap-2">
      {users.map((u) => (
        <div className="p-3 border rounded d-flex justify-content-between">
          <span className="fw-bold">{u.displayName}</span>
          <div className="d-flex gap-4">
            <span className="comment-icon ">
              <i className="bi bi-heart"> </i>
              <span> {formatNumber(u.commentCount)} </span>
            </span>
            <span className="comment-icon ">
              <i className="bi bi-bar-chart"></i>
              <span> {formatNumber(u.postCount)} </span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
export default Users;
