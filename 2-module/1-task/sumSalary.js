function sumSalary(salaries) {
  let resSum = 0;
  for (const prop in salaries) {
    if (isFinite(salaries[prop])) {
      resSum += salaries[prop];
    }
  }
  return resSum;
}

export default sumSalary;
