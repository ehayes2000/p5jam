import formatNumber from "../junkDrawer/formatNumber";

export default function Posts(n: number, callback: () => void) {
  return (
    <span className="comment-icon px-1">
      <i className="bi bi-chat"></i>
      <span> {formatNumber(n)} </span>
    </span>
  );
}
