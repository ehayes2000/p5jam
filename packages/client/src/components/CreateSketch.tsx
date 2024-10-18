import { LoginContext } from "../login";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../client"

export default function CreateSketch(props: { jamId?: string }) {
  const { user } = useContext(LoginContext)
  const nav = useNavigate();

  const newSketch = async () => {
    if (!user)
      nav("/login")
    const { data, error } = await client.api.posts.post({ jamId: props.jamId });
    // TODO fix error inference
    if (error?.status === 401) {
      nav('/login');
      return;
    }
    if (!data) {
      alert("Something went wrong!")
      return
    }
    nav(`/editPost/${data.id}`);
  };

  return (
    <button
      onClick={newSketch}
      className="border border-black bg-emerald-400 px-4 py-2 font-medium hover:bg-emerald-600"
    >
      <i className="italic"> + </i> New Sketch
    </button>
  )

}