function LoginPage() {
  return (
    <div className="group text-gray-700 hover:text-black">
      <a
        href={`${import.meta.env.VITE_API_BASE}/api/login/github`}
        className="border py-1 px-2 font-semibold cursor-pointer rounded-md bg-gray-200 group-hover:bg-gray-300"
      >
        Login with Github
        <i className="pl-1 bi bi-github text-gray-600 group-hover:text-black" />
      </a>
    </div>
  )
}

export default LoginPage
