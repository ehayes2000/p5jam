

export function formatDate(date: Date) {
  const dateObj = new Date(date);
  const monthAbbreviations = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];

  const month = monthAbbreviations[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day} ${year}`;
};
