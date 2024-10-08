import { type TJam } from '../client';
import { Link, useLoaderData } from 'react-router-dom';

export default function CompleteJams() {
  const jams = useLoaderData() as { owner: TJam[]; participant: TJam[] };
  const combinedView = [...jams.owner, ...jams.participant];
  combinedView.sort((a, b) => {
    let at = new Date(b.startTime);
    let bt = new Date(a.startTime);
    return at.getTime() - bt.getTime();
  });

  return (
    <div className="flex flex-col gap-2 px-6 py-4">
      {jams ? (
        combinedView.map((jam) => (
          <div key={jam.id} className="border p-2">
            <Link to={`/jam/${jam.id}`}>
              <h2 className=""> {jam.title} </h2>
              <h3 className="text-gray-600"> {jam.endTime.toString()} </h3>
              <div> </div>
            </Link>
          </div>
        ))
      ) : (
        <> loading ... </>
      )}
    </div>
  );
}
