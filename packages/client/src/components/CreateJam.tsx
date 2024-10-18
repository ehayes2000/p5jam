import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { client } from '../client';

export default function NewJam({
  closeCallback,
}: {
  closeCallback: () => void;
}) {
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const nav = useNavigate();

  const createJam: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const durationMs =
      Number(hours) * 60 * 60 * 1000 + Number(minutes) * 60 * 1000;
    const response = await client.api.jams.post({
      title,
      durationMs,
    });
    if (response.data) {
      const jam = response.data;
      nav(`/jam/${jam.id}`);
    } else if (response.error.status === 401) {
      nav(`/login`)
    }
    else {
      alert('Could not create jam');
    }
  };

  return (
    <div className="content-left">
      <button
        className="z-25 -ml-4 h-8 w-8 border border-black bg-red-400 hover:bg-red-600"
        onClick={closeCallback}
      >
        <i className="bi bi-x-lg" />
      </button>
      <div className="-mt-4 w-full content-center border border-black bg-white p-6 text-center">
        <div className="text-4xl font-bold">Create New Jam</div>
        <form
          id="createEvent"
          onSubmit={(e) => {
            createJam(e);
          }}
          className="flex flex-col gap-2 text-left"
        >
          <div className="w-full">
            <div>Duration</div>

            <div className="grid grid-cols-2 gap-1">
              <input
                className="min-w-0 border border-black p-1"
                type="text"
                name="hours"
                placeholder="Hours"
                value={hours}
                size={1}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (e.target.value.length === 0) {
                    setHours('');
                  } else if (!Number.isNaN(parsed)) {
                    setHours(e.target.value);
                  }
                }}
              />
              <input
                className="border border-black p-1"
                type="text"
                name="minutes"
                placeholder="Minutes"
                size={1}
                value={minutes}
                onChange={(e) => {
                  const parsed = Number(e.target.value);
                  if (e.target.value.length === 0) setMinutes('');
                  else if (parsed < 60 && parsed > 0)
                    setMinutes(e.target.value);
                }}
              />
            </div>
          </div>
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
  );
}
