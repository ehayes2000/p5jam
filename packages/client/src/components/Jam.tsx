import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { type TJam, type TPost, client } from '../client';
import Post from '../components/Post';
import Timer from './Timer';

export default function Jam({ jam }: { jam: TJam }) {
  const nav = useNavigate();
  const [isComplete, setIsComplete] = useState(
    new Date(jam.endTime) <= new Date(),
  );

  // useEffect(() => {
  //   const timer = setTimeout(
  //     () => {
  //       setIsComplete(true);
  //       store.send({ type: 'jamEnded' });
  //     },
  //     new Date(jam.endTime).getTime() - new Date().getTime(),
  //   );
  //   return () => clearTimeout(timer);
  // }, []);

  // const leaveJam = () => {
  //   (async () => {
  //     if (confirm('Are you sure you want to leave the Jam?') === true) {
  //       client.api.jams({ id: jam.id }).leave.post();
  //       store.send({ type: 'leftJam' });
  //       nav('/');
  //     }
  //   })();
  // };

  const newSketch = async () => {
    const response = await client.api.posts.post({ jamId: jam.id });
    // TODO fix error inference
    if (response.error !== null) {
      nav('/login');
      return;
    }
    const newPost = response.data;
    nav(`/editPost/${newPost.id}`);
  };

  return (
    <div className="">
      <div className="grid grid-cols-3 justify-center gap-8 border-b border-black p-16 text-4xl font-bold">
        <h1 className="align-center px-2 text-right"> {jam.title} </h1>
        <div className="align-center flex content-center items-center justify-center">
          {isComplete ? <div> Jam Over </div> : <Timer endTime={jam.endTime} />}{' '}
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

          {isComplete || (
            <h4 className="relative -ml-6 mt-10 h-0 w-0 -rotate-45 animate-oscillate text-amber-400">
              Join!
            </h4>
          )}
        </div>
      </div>
      <div
        className={`-my-6 ${isComplete ? 'invisible' : ''} flex items-center justify-around px-16 text-2xl`}
      >
        <button
          onClick={newSketch}
          className="border border-black bg-emerald-400 px-4 py-2 font-medium hover:bg-emerald-600"
        >
          <i className="italic"> + </i> New Sketch
        </button>
      </div>
      <div className="mt-6 flex justify-center p-4 flex-col gap-2">
        <JamPosts jamId={jam.id} />
      </div>
    </div>
  );
}

const JamPosts = ({ jamId }: { jamId: string }) => {
  const [posts, setPosts] = useState<TPost[] | null>(null);
  useEffect(() => {
    client.api.posts.get({ query: { jamId } }).then((response) => {
      if (response.data) {
        setPosts(response.data);
      } else {
        alert('handle this');
      }
    });
  }, []);

  return (
    <>
      {posts ? (
        <>
          {' '}
          {posts.map((p) => (
            <Post post={p} key={p.id} />
          ))}
        </>
      ) : (
        <> loading ... </>
      )}
    </>
  );
};
