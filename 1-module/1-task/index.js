function factorial(n) {
  let counter = n - 1;
  while (counter > 1) {
    n *= counter;
    counter--;
  }
  return n === 0 || n === 1 ? 1 : n;
}
