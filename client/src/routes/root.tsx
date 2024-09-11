import { useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

function Root() {
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <div className="container-fluid d-flex flex-column">
      <div className="row overflow-hidden vh-100">
        <div className="col-3 border-end h-100 px-0">
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
        <div className="col h-100 px-0 overflow-y-auto">
          <h4 className="d-flex border-bottom sticky-top bg-dark py-2 justify-content-center">
            <a className="header px-5"> Trending </a>
            <a className="header px-5"> Following </a>
          </h4>
          <div>
            <Outlet />
          </div>
        </div>
        <div className="col-3 border-start h-100 px-0">
          <div className="">:)</div>
        </div>
      </div>
    </div>
  );
}

export default Root;
