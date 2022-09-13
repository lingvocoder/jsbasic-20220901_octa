function getMinMax(str) {
  const numString = str.split(' ').map(elem => Number(elem)).filter(elem => !isNaN(elem));
  const min = Math.min(...numString);
  const max = Math.max(...numString);
  return {min, max};
}
