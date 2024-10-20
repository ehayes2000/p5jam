import { useNavigate, useLoaderData } from 'react-router-dom';
import { type TPost } from '../client';
import CodeMirror, { EditorView, EditorState } from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { githubLight } from '@uiw/codemirror-theme-github'
import Post from '../components/Post';

export default function PostDetails() {
  const nav = useNavigate();
  const post = useLoaderData() as TPost;
  const deleteCallback = () => {
    nav("/")
  }
  return (
    <div className="w-full gap-1 flex flex-row py-4 px-10">
      {post ? <Post post={post} isComments={true} showJam={true} deletePost={deleteCallback} /> : 'loading ...'}
      <CodeMirror
        value={post.script}
        theme={githubLight}
        extensions={[javascript()]}
        className="flex-grow border "
        height='550px'
        editable={false}
      />
    </div>
  );
}
