export default function formatNumber(num: number) {
  let absNum = Math.abs(num);

  if (absNum >= 1e6) {
    // Format for millions
    return (num / 1e6).toFixed(1).replace(/\.0$/, "") + "m";
  } else if (absNum >= 1e3) {
    // Format for thousands
    return (num / 1e3).toFixed(1).replace(/\.0$/, "") + "k";
  } else {
    // Format for numbers under 1000
    return num.toString();
  }
}
