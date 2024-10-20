import { useState, useEffect } from "react"
import { useNavigate, useLoaderData } from 'react-router-dom';
import { type TPost } from '../client';
import PostPreview from '../components/PostPreview';
import CodeMirror from '@uiw/react-codemirror'
import { vim } from '@replit/codemirror-vim'
import { javascript } from '@codemirror/lang-javascript'
import { githubLight } from '@uiw/codemirror-theme-github'
import Post from '../components/Post';
import type { Keybind } from "../types"

export default function PostDetails() {
  const nav = useNavigate();
  const post = useLoaderData() as TPost;
  const deleteCallback = () => {
    nav("/")
  }
  const [keybind, setKeyBind] = useState<Keybind>(() => {
    const savedKeybind = localStorage.getItem('keybind')
    return (savedKeybind as Keybind) || 'Normal'
  })

  useEffect(() => {
    localStorage.setItem('keybind', keybind)
  }, [keybind])

  const [scriptSrc, setScriptSrc] = useState(post.script)

  return (
    <div className="px-10 pt-4">
      <div className="w-full gap-1 flex flex-row ">
        <Post post={post} isComments={true} showJam={true} deletePost={deleteCallback}
          sketch={<PostPreview key="live-sketch" draft={{ script: scriptSrc }} />}
        />
        <CodeMirror
          value={post.script}
          theme={githubLight}
          extensions={
            keybind === 'Vim' ? [vim(), javascript()] : [javascript()]
          }
          className="flex-grow border "
          height='550px'
          onChange={setScriptSrc}
        />
      </div>
      <span className="mt-1 flex gap-2 justify-end ">
        Key bindings
        <select
          className="px-2"
          onChange={(e) => setKeyBind(e.target.value as Keybind)}
          value={keybind}
        >
          <option value="Normal"> Normal </option>
          <option value="Vim"> Vim </option>
        </select>
      </span>

    </div>
  );
}
