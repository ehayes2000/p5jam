import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { client } from '../client'

export default function NewJam({
  closeCallback,
}: {
  closeCallback: () => void
}) {
  const [title, setTitle] = useState('')
  const [hours, setHours] = useState('1')
  const [minutes, setMinutes] = useState('30')
  const nav = useNavigate()

  const validateForm = ({
    title,
    hours,
    minutes,
  }: {
    title: string
    hours: string
    minutes: string
  }) => {
    try {
      if (title.length > 255 || title.length <= 0) return false
      if (minutes.length && Number(minutes) >= 60) return false
      if (hours.length && Number(hours) >= 96) return false
      if (!hours && !minutes) return false
      return true
    } catch (e) {
      {
        return false
      }
    }
  }

  const createJam: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const durationMs =
      Number(hours) * 60 * 60 * 1000 + Number(minutes) * 60 * 1000
    if (!validateForm({ title, hours, minutes })) return
    const newPost = await client.api.jams.index.post({
      title,
      durationMs,
    })
    if (newPost.data?.id) {
      nav(`/jam/${newPost.data.id}`)
    } else {
      alert(':P')
    }
  }

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="content-left w-1/3">
        <button
          className="z-50 -ml-4 h-8 w-8 border border-black bg-red-400 hover:bg-red-600"
          onClick={closeCallback}
        >
          <i className="bi bi-x-lg" />
        </button>
        <div className="-mt-4 w-full content-center border border-black bg-white p-6 text-center">
          <div className="text-4xl font-bold">Create New Jam</div>
          <form
            id="createEvent"
            onSubmit={(e) => {
              createJam(e)
            }}
            className="flex flex-col gap-2 text-left"
          >
            <div>
              <div>
                <label htmlFor="title">Title</label>
              </div>
              <input
                className="w-full border border-black p-1"
                type="text"
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <div>Duration</div>
              <div className="flex gap-2">
                <div className="flex flex-1 items-center">
                  <input
                    className="w-full border border-black p-1"
                    type="text"
                    required
                    name="hours"
                    placeholder="Hours"
                    value={hours}
                    onChange={(e) => {
                      if (e.target.value.length === 0) {
                        setHours('')
                      } else if (
                        e.target.value.length <= 2 &&
                        Number(e.target.value)
                      ) {
                        setHours(e.target.value)
                      }
                    }}
                  />
                  <span className="-mx-[50px] font-light text-gray-600">
                    Hours
                  </span>
                </div>
                <div className="flex flex-1 items-center gap-1">
                  <input
                    className="w-full border border-black p-1"
                    type="text"
                    required
                    name="minutes"
                    placeholder="Minutes"
                    value={minutes}
                    onChange={(e) => {
                      if (e.target.value.length === 0) setMinutes('')
                      else if (e.target.value.length < 2)
                        setMinutes(e.target.value)
                      else if (Number(e.target.value) < 60)
                        setMinutes(e.target.value)
                    }}
                  />
                  <span className="-mx-[68px] font-light text-gray-500">
                    Minutes
                  </span>
                </div>
              </div>
            </div>
            {/* <button className="mt-4 bg-blue-500 p-2 text-white">Submit</button> */}
          </form>
        </div>
        <div className="-mr-6 -mt-4 text-right">
          <button
            type="submit"
            form="createEvent"
            className="relative z-50 border border-black bg-emerald-400 p-1 hover:bg-emerald-600"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  )
}
