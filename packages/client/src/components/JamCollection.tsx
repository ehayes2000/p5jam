import { Link } from "react-router-dom"
import JamTag from './JamTag';
import { useContext } from "react"
import { LoginContext } from "../login"
import { formatDate } from "./FormatDate";
import type { TJamCollection } from "../types"

export default function JamCollection(props: { jams: TJamCollection }) {
  const { jams } = props
  const { user } = useContext(LoginContext)
  const combinedView = [...jams.owner, ...jams.participant]
  combinedView.sort((a, b) => {
    let at = new Date(b.startTime);
    let bt = new Date(a.startTime);
    return at.getTime() - bt.getTime();
  });

  return (
    <div className="flex flex-col gap-2 px-6 py-4">
      {
        combinedView.map((jam) => (
          <div key={jam.id} className="border p-2">
            <Link to={`/jam/${jam.id}`}
              className="grid grid-cols-3"
            >
              <div className="grid grid-cols-2 gap-12">
                <div> <JamTag jamId={jam.id} interactive={false} /> </div>
                {jam.title && jam.title !== "" ? `${jam.title}` : ''}
              </div>
              {formatDate(jam.endTime)}
              <div className="flex justify-end ">
                {
                  jam.ownerId === user?.id ?
                    <div className="bg-amber-400 border px-2"> creator </div> :
                    <div className="bg-sky-400 border px-2"> jammer </div>
                }
              </div>
            </Link>
          </div >
        ))
      }
    </div >
  )
} 