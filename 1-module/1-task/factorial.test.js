import factorial from "./factorial.js";

describe('Функция вычисляет факториал числа', () => {
  it('Факториал 0 равен 1', () => {
    expect(factorial(0)).toEqual(1);
  });

  it('Факториал 1 равен 1', () => {
    expect(factorial(1)).toEqual(1);
  });

  it('Факториал 3 равен 6', () => {
    expect(factorial(3)).toEqual(6);
  });

  it('Факториал 5 равен 120', () => {
    expect(factorial(5)).toEqual(120);
  });

  it('Факториал 6 равен 720', () => {
    expect(factorial(6)).toEqual(720);
  });

});
