import { useLoaderData } from 'react-router-dom';
import { type TPost } from '../client';
import Post from '../components/Post';

export default function PostDetails() {
  const post = useLoaderData() as TPost;
  return (
    <div className="grid justify-center gap-4 p-6">
      {post ? <Post post={post} isComments={true} /> : 'loading ...'}
    </div>
  );
}
