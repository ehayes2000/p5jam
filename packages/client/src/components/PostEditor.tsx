import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostPreview from './PostPreview'
import CodeMirror, { EditorView, EditorState } from '@uiw/react-codemirror'
import { vim } from '@replit/codemirror-vim'
import { javascript } from '@codemirror/lang-javascript'
import { githubLight } from '@uiw/codemirror-theme-github'

type Keybind = 'Vim' | 'Normal'

const MAX_DESCRIPTION = 255

export default function PostEditor({
  post,
  callbackText,
  callback,
}: {
  callback: ({
    description,
    script,
  }: {
    description: string
    script: string
  }) => Promise<boolean>
  callbackText: string
  post: { description: string; script: string }
}) {
  const nav = useNavigate()
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
    <div className="w-full grid gap-1">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const success = await callback({ description, script })
          if (success) nav('/profile')
        }}
      >
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <h1 className="font-medium"> Script </h1>
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
            <div className="w-full flex gap-2">
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
                className={`h-[${editSize}] overflow-hidden border-gray-400
                 `}
              >
                <div className="border">
                  <PostPreview draft={{ script, description }} />
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="flex justify-between">
              <h1 className="font-medium content-end"> Description </h1>
              <span className="text-sm  font-light content-end">
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
              className="px-2  bg-gray-200 hover:bg-gray-300"
            >
              {callbackText}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
