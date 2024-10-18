import type { TJamPage } from "../types"
import { useLoaderData } from "react-router-dom"
import { useState } from 'react';
import PostCollection from './PostCollection';
import Timer from './Timer';
import CreateSketch from "./CreateSketch";

export default function Jam() {
  const { posts, jam } = useLoaderData() as TJamPage
  const [isComplete, _] = useState(
    new Date(jam.endTime) <= new Date(),
  );

  return (
    <div className="">
      <div className="grid grid-cols-2 justify-center gap-4 border-b border-black p-16 text-4xl font-bold">
        <div className="justify-center flex text-center text-sm ">
          <div className="flex gap-2 text-4xl text-black">
            {Array.from(jam.id).map((c, i) => (
              <div
                key={i}
                className="w-[3.2rem] border border-black py-1 text-center font-light"
              >
                {c}
              </div>
            ))}
          </div>
          {isComplete || (
            <h4 className="relative -ml-6 mt-12 h-0 w-0 -rotate-45 animate-oscillate text-amber-400">
              Join!
            </h4>
          )}
        </div>
        <div className="align-center flex content-center items-center justify-center">
          {isComplete ? <div> Jam Over </div> : <Timer endTime={jam.endTime} />}{' '}
        </div>
      </div>
      <div
        className={`-my-6 ${isComplete ? 'invisible' : ''} flex items-center justify-around px-16 text-2xl`}
      >
        <CreateSketch jamId={jam.id} />
      </div>
      <div className="mt-6 flex justify-center p-4 flex-col gap-2">
        <PostCollection posts={posts} />
      </div>
    </div >
  );
}