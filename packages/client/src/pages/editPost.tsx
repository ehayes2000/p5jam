import { client, type TPost } from '../client';
import { useLoaderData, useNavigate } from 'react-router-dom';
import PostEditor from '../components/PostEditor';

function EditPost() {
  const post = useLoaderData() as TPost;
  const nav = useNavigate();
  const updatePost = async ({
    script,
    description,
  }: {
    script: string;
    description: string;
  }) => {
    // TODO use return code?
    await client.api.posts({ id: post.id }).put({ script, description });
    if (post.jamId) nav(`/jam/${post.jamId}`);
    else nav('/profile');
  };

  return (
    <div>
      {post ? (
        <PostEditor
          post={{ description: post.description, script: post.script }}
          callback={updatePost}
          callbackText="Post"
        /> // TODO reroute to profile?
      ) : (
        <></>
      )}
    </div>
  );
}

export default EditPost;
