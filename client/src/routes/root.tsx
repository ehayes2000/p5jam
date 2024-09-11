import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

function Root() {
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <div className="container-fluid d-flex flex-column vh-100">
      <div className="row flex-shrink-0  border-bottom p-3">
        <h1 className="h5 mb-0">Fixed Header</h1>
      </div>
      <div className="row flex-grow-1 overflow-hidden">
        <div className="col-3 border-end overflow-auto h-100 px-0">
          <div className="p-3">
            <ul className="list-unstyled">
              <li>
                <Link to="users/">Users</Link>
              </li>
              <li>
                <Link to="explore/">Explore</Link>
              </li>
              <li>
                <Link to="makePost/">New Post</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-6 overflow-x-hidden overflow-y-auto h-100 px-0">
          <div>
            <Outlet />
          </div>
        </div>
        <div className="col-3 border-start overflow-auto h-100 px-0">
          <div className="p-3">:)</div>
        </div>
      </div>
    </div>
  );
}

export default Root;
