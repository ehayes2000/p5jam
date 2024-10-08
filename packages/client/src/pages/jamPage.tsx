import { useLoaderData } from 'react-router-dom';
import type { TJam } from '../client';
import Jam from '../components/Jam';

export default function JamPage() {
  const jam = useLoaderData() as TJam;
  return jam ? <Jam jam={jam} /> : <div> ... loading </div>;
}
