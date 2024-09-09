import { useEffect } from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import Header from "./header";
import Posts from "./Posts";
import Users from "./components/Users";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

function App() {
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="">
        <Users />
        <Header />
        <Posts />
      </div>
    </ApolloProvider>
  );
}

export default App;
