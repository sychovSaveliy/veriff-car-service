function getTime(timestamp) {
  if (!timestamp) return Date.now();

  return new Date(timestamp);
}

function diffBetweenTimestamp(from, to) {
  let diff = to - from;

  return diff / 1000 / 60 / 60;
}

export { getTime, diffBetweenTimestamp };
