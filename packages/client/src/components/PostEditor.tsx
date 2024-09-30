import { useState, useEffect } from 'react'
import PostPreview from './PostPreview'
import CodeMirror, { EditorView, EditorState } from '@uiw/react-codemirror'
import { vim } from '@replit/codemirror-vim'
import { javascript } from '@codemirror/lang-javascript'
import { githubLight } from '@uiw/codemirror-theme-github'

type Keybind = 'Vim' | 'Normal'

const MAX_DESCRIPTION = 255

export default function PostEditor({
  post,
  callback,
}: {
  callback: ({
    description,
    script,
  }: {
    description: string
    script: string
  }) => void
  callbackText: string
  post: { description: string; script: string }
}) {
  const [script, setScript] = useState<string>(post.script)
  const [description, setDescription] = useState<string>(post.description)
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
    <div className="grid w-full gap-1">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          callback({ description, script })
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
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
          </div>
          <div className="">
            <div className="flex w-full gap-2">
              <CodeMirror
                value={post.script}
                theme={githubLight}
                extensions={
                  keybind === 'Vim' ? [vim(), javascript()] : [javascript()]
                }
                className="flex-grow border"
                onChange={setScript}
                height={editSize}
              />
              <div
                className={`h-[${editSize}] overflow-hidden border-gray-400`}
              >
                <div className="border">
                  <PostPreview draft={{ script, description }} />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="flex justify-between">
              <h1 className="content-end font-medium"> Description </h1>
              <span className="content-end text-sm font-light">
                {description.length} / {MAX_DESCRIPTION}
              </span>
            </div>
            <CodeMirror
              value={post.description}
              onChange={(v) => {
                if (v.length <= MAX_DESCRIPTION) setDescription(v)
              }}
              extensions={descriptionExtensions}
              className="border"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-gray-200 px-2 hover:bg-gray-300"
            >
              Post
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
