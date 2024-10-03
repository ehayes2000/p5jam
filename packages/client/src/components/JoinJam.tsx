import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { client } from '../client'

export default function JoinJam({
  closeCallback,
}: {
  closeCallback: () => void
}) {
  const [joinCode, setJoinCode] = useState('')

  const nav = useNavigate()

  const validateForm = ({ joinCode }: { joinCode: string }) => {
    return joinCode.length === 5
  }

  const joinJam: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (!validateForm({ joinCode })) return
    const comeOnAndSlam = await client.api.jams({ id: joinCode }).join.post()
    if (comeOnAndSlam.error)
      alert(
        'https://i.pinimg.com/originals/8f/59/68/8f5968f03ab0b891f58ba7d7ad4d0ede.jpg',
      )
    else nav(`/jam/${joinCode.toUpperCase()}`)
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="content-left">
        <button
          className="z-25 -ml-4 h-8 w-8 border border-black bg-red-400 hover:bg-red-600"
          onClick={closeCallback}
        >
          <i className="bi bi-x-lg" />
        </button>
        <div className="-mt-4 w-full content-center border border-black bg-white p-6 text-center">
          <div className="text-4xl font-bold">Join Jam</div>
          <form
            id="joinJam"
            onSubmit={(e) => {
              joinJam(e)
            }}
            className="flex flex-col gap-2 text-left"
          >
            <input
              className="w-full border border-black p-1 text-center uppercase tracking-widest"
              type="text"
              required
              name="inviteCode"
              placeholder="_ _ _ _ _"
              value={joinCode}
              onChange={(e) => {
                if (e.target.value.length <= 5) setJoinCode(e.target.value)
              }}
            />
          </form>
        </div>
        <div className="-mr-6 -mt-4 text-right">
          <button
            type="submit"
            form="joinJam"
            className="relative z-50 border border-black bg-emerald-400 p-1 hover:bg-emerald-600"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  )
}
