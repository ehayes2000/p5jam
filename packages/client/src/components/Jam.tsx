import { Link } from "react-router-dom"
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
      <div className="flex flex-col justify-between border-b border-black p-8 pb-6">
        <div className={`w-full ${jam.title.trim() !== "" ? "grid grid-cols-5" : "grid grid-cols-4 justify-end "} gap-10 text-4xl font-bold `}>
          <div className="col-span-2">
            <div className="justify-end flex ">
              <div className="flex gap-2 text-4xl text-black ">
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
                <h4 className="relative -translate-x-8 mt-10 h-0 w-0 -rotate-45 animate-oscillate text-amber-400">
                  Join!
                </h4>
              )}
            </div>
            <div className="py-2 text-sm font-thin text-end"> created by: <Link className="font-normal" to={`/user/${jam.creator.name}`}> {jam.creator.name} </Link> </div>
          </div>
          <div className={`${jam.title === "" ? "hidden" : ""} text-4xl text-center `}>
            {jam.title}
          </div>
          <div className="flex justify-start col-span-2">
            {isComplete ? <div> Jam Over </div> : <Timer endTime={jam.endTime} />}{' '}
          </div>
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