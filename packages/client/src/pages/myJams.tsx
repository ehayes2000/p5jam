import { type TJam } from '../client';
import { Link, useLoaderData, useNavigate } from 'react-router-dom';
import JamTag from '../components/JamTag';
import { useContext } from "react"
import { LoginContext } from '../login';

export default function CompleteJams() {
  const jams = useLoaderData() as { owner: TJam[]; participant: TJam[] };
  const combinedView = [...jams.owner, ...jams.participant];
  const nav = useNavigate()
  const { user } = useContext(LoginContext)

  if (!user) {
    nav("/login")
    return
  }

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
              <div> <JamTag jamId={jam.id} interactive={false} /> </div>
              <h3 className="text-gray-600"> {jam.endTime.toString()} </h3>
              <div className="flex justify-end">
                {
                  jam.ownerId === user.id ?
                    <div className="bg-amber-400 border px-2"> creator </div> :
                    <div className="bg-sky-400 border px-2"> jammer </div>
                }
              </div>
            </Link>
          </div >
        ))
      }
    </div >
  );
}
