import { type TPost } from "../client"
import { useState, useEffect } from 'react'
import PostPreview from './PostPreview'
import CodeMirror, { EditorView, EditorState } from '@uiw/react-codemirror'
import { vim } from '@replit/codemirror-vim'
import { javascript } from '@codemirror/lang-javascript'
import { githubLight } from '@uiw/codemirror-theme-github'
import type { Keybind } from "../types"

const MAX_DESCRIPTION = 255

export default function PostEditor({
  post,
  postCallback,
  saveDraftCallback,
}: {
  postCallback: ({
    description,
    script,
  }: {
    description: string
    script: string
  }) => void,
  saveDraftCallback: ({
    description,
    script,
  }: {
    description: string
    script: string
  }) => void
  post: TPost
}) {
  const [script, setScript] = useState<string>(post.script)
  const [description, setDescription] = useState<string>("")
  const [keybind, setKeyBind] = useState<Keybind>(() => {
    const savedKeybind = localStorage.getItem('keybind')
    return (savedKeybind as Keybind) || 'Normal'
  })

  useEffect(() => {
    localStorage.setItem('keybind', keybind)
  }, [keybind])

  const characterLimitExtension = EditorState.transactionFilter.of((tr) => {
    const newContent = tr.newDoc.sliceString(0)
    if (newContent.length <= MAX_DESCRIPTION) {
      return tr
    }
    return []
  })

  const descriptionExtensions = [
    EditorView.lineWrapping,
    EditorView.theme({
      '&': { height: '150px' },
      '.cm-gutters': { display: 'none' },
      '.cm-lineNumbers': { display: 'none' },
    }),
    characterLimitExtension,
    ...(keybind === 'Vim' ? [vim()] : []),
  ]
  let editSize = '550px'
  return (
    <div className="w-full gap-1 h-full">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
        }}
        className="h-full flex flex-col justify-between"
      >
        <div className="flex flex-col gap-1 w-full">
          <div className="">
            <div className="flex w-full gap-2">
              <div className="flex-grow">
                <CodeMirror
                  value={post.script}
                  theme={githubLight}
                  extensions={
                    keybind === 'Vim' ? [vim(), javascript()] : [javascript()]
                  }
                  className="flex-grow border col-span-3"
                  onChange={setScript}
                  height={editSize}
                />
              </div>
              <div
                className={`h-[${editSize}] border-gray-400`}
              >
                <div className="border">
                  <PostPreview draft={{ script }} />
                </div>
              </div>

            </div>
          </div>

        </div>
        <div className="flex justify-end gap-2">
          <span className="flex gap-2">
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
          <button
            type="button"
            onClick={() => { saveDraftCallback({ description, script }) }}
            className={`${post.published ? "hidden" : ""} bg-yellow-400 px-2 hover:bg-yellow-600`}
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => { postCallback({ description, script }) }}
            className="px-2 bg-green-400 hover:bg-green-600"
          >
            {post.published ? "Update" : "Post"}
          </button>
        </div>
      </form>
    </div>
  )
}
