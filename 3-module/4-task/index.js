function showSalary(users, age) {
  return users.filter(elem => elem.age <= age)
    .map(({name, balance}) => `${name}, ${balance}`)
    .join('\n');
}

module.exports = showSalary;
