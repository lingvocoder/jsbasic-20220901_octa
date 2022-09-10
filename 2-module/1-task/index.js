function sumSalary(salaries) {
  let resSum = 0;
  if (!Object.keys(salaries).length) {
    return resSum;
  }
  for (const salariesKey in salaries) {
    if (isFinite(salaries[salariesKey])) {
      resSum += salaries[salariesKey];
    }
  }
  return resSum;
}
