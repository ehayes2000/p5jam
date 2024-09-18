
function Header() { 
  return (
    <header className="py-3 border-bottom"> 
      <div className="container">
      <div className="d-flex align-items-center justify-content-center justify-content-lg-between px-5 px-md-0">
        {/* <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-decoration-none">
          <svg className="bi me-2" width="40" height="32" role="img" aria-label="Bootstrap"><use xlinkHref="#bootstrap"></use></svg>
        </a> */}

        {/* <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
          <li><a href="#" className="nav-link px-2 link-light">Overview</a></li>
        </ul> */}
        <span> text! </span>
        <form className="col-12 col-lg-auto">
          <input type="search" className="form-control" placeholder="Search..." aria-label="Search"/>
        </form>

      </div>
      </div>
    </header>
  )
}

export default Header;