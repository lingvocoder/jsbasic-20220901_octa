const sumSalary = require('./index');

describe('Функция, которая суммирует зарплаты всех участников', () => {
  it('Возвращает сумму зарплат участников', () => {
    let salaries = {
      John: 1000,
      Ann: 1600,
      Pete: 1300
    };

    expect(sumSalary(salaries)).toEqual(3900);
  });

  it('Игнорирует значения нечислового типа', () => {
    let salaries = {
      John: 1000,
      Ann: 1600,
      Pete: 1300,
      month: 'December',
      currency: 'USD',
      isPayed: false
    };

    expect(sumSalary(salaries)).toEqual(3900);
  });

  it('Игнорирует специальные числовые значения (Infinity, -Infinity, NaN)', () => {
    let salaries = {
      John: 1000,
      Ann: 1600,
      Pete: 1300,
      Bob: NaN,
      Peter: Infinity,
      Ivan: -Infinity,
      month: 'December',
      currency: 'USD',
      isPayed: false
    };

    expect(sumSalary(salaries)).toEqual(3900);
  });

  it('Возвращает 0, если нет свойств с числовыми значениями', () => {
    let salaries = {
      month: 'December',
      currency: 'USD',
      isPayed: false
    };

    expect(sumSalary(salaries)).toEqual(0);
  });
});
