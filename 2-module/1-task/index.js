function sumSalary(salaries) {
  let resSum = 0;
  for (const salariesKey in salaries) {
    if (isFinite(salaries[salariesKey])) {
      resSum += salaries[salariesKey];
    }
  }
  return resSum;
}
