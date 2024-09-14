import EditPost from "../components/EditPost";
import { type PostDraft } from "../types";

const newDraft = (): PostDraft => {
  return {
    script: DEFAULT_SCRIPT,
    description: "",
  };
};

const DEFAULT_SCRIPT = `
const WIDTH=360
const HEIGHT=360
function setup() {
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  // TODO
}
`;
export default function NewPost() {
  return (
    <div className="">
      <EditPost post={newDraft()} />
    </div>
  );
}
