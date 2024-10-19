import { Link } from "react-router-dom"
export default function JamTag(props: { jamId: string, interactive?: boolean }) {
  if (props.interactive ?? true)
    return <Link to={`/jam/${props.jamId}`}> <i className="hover:bg-purple-400 tracking-widest border px-2"> {props.jamId} </i> </Link>
  return <i className=" tracking-widest border px-2"> {props.jamId} </i>

}