import { gql, useQuery } from "@apollo/client";
import PostCard from "./postCard";

const POSTS_QUERY = gql`
  query POSTS_QUERY {
    posts {
      id
      viewCount
      likeCount
      description
      script
      author {
        name
      }
    }
  }
`;

interface Post {
  id: string;
  description?: string;
  script: string;
  author: {
    name: string;
  };
}

function Posts() {
  const { loading, error, data } = useQuery(POSTS_QUERY);
  if (loading) return <p> Loading ... </p>;
  if (error) return <p> {error.message} </p>;
  // console.log(data.map((p: Post) => console.log(p)));
  return (
    <div className="container py-4">
      <div className="row row-cols-1 row-cols-lg-3 g-4">
        {data.posts.map((post: Post) => (
          <div className="col" key={`"${post.id}"`}>
            <body>{post.description}</body>
            <body>{post.author.name}</body>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
