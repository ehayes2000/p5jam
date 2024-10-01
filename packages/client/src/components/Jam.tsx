import { useNavigate } from 'react-router-dom'
import { type TJam, client } from '../client'
import { store } from '../stateStore'
import Post from '../components/Post'
import Timer from './Timer'

export default function Jam({ jam }: { jam: TJam }) {
  const nav = useNavigate()

  const leaveJam = () => {
    ;(async () => {
      if (confirm('Are you sure you want to leave the Jam?') === true) {
        client.api.jams({ id: jam.id }).leave.delete()
        store.send({ type: 'leftJam' })
        nav('/')
      }
    })()
  }

  const newSketch = () => {
    ;(async () => {
      const { data } = await client.api.posts.jam({ jamId: jam.id }).post()
      if (data) {
        store.send({ type: 'postCreated', payload: { post: data } })
      }
      if (data?.id) nav(`/editPost/${data.id}`)
    })()
  }

  return (
    <div className="">
      <div className="grid grid-cols-3 justify-center gap-8 border-b border-black p-16 text-4xl font-bold">
        <h1 className="align-center px-2 text-right"> {jam.title} </h1>
        <div className="align-center flex content-center items-center justify-center">
          <Timer endTime={jam.endTime} />
        </div>
        <div className="flex text-center text-sm">
          <div className="flex gap-2 text-2xl text-black">
            {Array.from(jam.id).map((c, i) => (
              <div
                key={i}
                className="w-[2.7rem] border border-black py-1 text-center font-light"
              >
                {c}
              </div>
            ))}
          </div>
          <h4 className="relative -ml-6 mt-10 h-0 w-0 -rotate-45 animate-oscillate text-amber-400">
            Join
          </h4>
        </div>
      </div>
      <div className="-my-6 flex items-center justify-around px-16 text-2xl">
        <button
          onClick={newSketch}
          className="border border-black bg-emerald-400 px-4 py-2 font-medium hover:bg-emerald-600"
        >
          <i className="italic"> + </i> New Sketch
        </button>
        <div className="flex gap-1">
          <button
            onClick={leaveJam}
            className="border border-black bg-red-400 px-2 py-1 text-sm hover:bg-red-600"
          >
            Leave
          </button>
        </div>
      </div>
      <div>
        {jam.posts.map((p) => (
          <Post post={p} key={p.id} />
        ))}
      </div>
    </div>
  )
}
