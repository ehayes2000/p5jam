import { useEffect } from "react";
import Header from "./header";
import Posts from "./Posts";
import Users from "./components/Users";

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <div>
      <Users />
      <Header />
      <Posts />
    </div>
  );
}

export default App;
