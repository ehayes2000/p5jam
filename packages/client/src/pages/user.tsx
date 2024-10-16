import type { TPost } from '../client';
import { useLoaderData } from 'react-router-dom';
import Post from '../components/Post';

export default function User() {
  const { posts } = useLoaderData() as { posts: TPost[]; myId?: string };
  return (
    <div className="grid justify-center gap-4 p-6">
      {posts?.length ? (
        posts.map((p) => <Post key={p.id} post={p} />)
      ) : (
        <div> This user has no posts </div>
      )}
    </div>
  );
}
