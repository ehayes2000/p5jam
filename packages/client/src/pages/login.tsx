function LoginPage() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="group flex text-black hover:text-gray-500 ">
      <a
        href={`${import.meta.env.VITE_API_BASE}/api/login/github`}
        className="border border-black  group-hover:border-gray-500 py-1 px-2 font-semibold cursor-pointer group-hover:text-gray-500"
      >
        Login with Github
        <i className="pl-1 bi bi-github group-hover:text-gray-500 " />
      </a>
      </div>
    </div>
  )
}

export default LoginPage
