import { client, type TPost } from '../client';
import { useLoaderData, useNavigate } from 'react-router-dom';
import PostEditor from '../components/PostEditor';

function EditPost() {
  const post = useLoaderData() as TPost;
  const nav = useNavigate();
  const postPost = async ({
    script,
    description,
  }: {
    script: string;
    description: string;
  }) => {
    // TODO use return code?
    await client.api.posts({ id: post.id }).put({ script, description, published: true });
    if (post.jamId) nav(`/jam/${post.jamId}`);
    else nav('/profile');
  };

  const saveDraft = async ({
    script,
    description,
  }: {
    script: string;
    description: string;
  }) => {
    // TODO use return code?
    await client.api.posts({ id: post.id }).put({ script, description, published: false });
    if (post.jamId) nav(`/jam/${post.jamId}`);
    else nav('/profile');
  };

  return (
    <div className='px-10 py-4 h-full'>
      <PostEditor
        post={{ description: post.description, script: post.script }}
        postCallback={postPost}
        saveDraftCallback={saveDraft}
      />
    </div>
  );
}

export default EditPost;
