function filterRange(arr, a, b) {
  return arr.filter(elem => elem >= a && elem <= b);
}

module.exports = filterRange;
