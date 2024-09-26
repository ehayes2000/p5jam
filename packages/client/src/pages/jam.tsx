import { useParams } from 'react-router-dom'
export default function Jam() {
  const { id } = useParams()
  return <div> Jam {id}</div>
}
