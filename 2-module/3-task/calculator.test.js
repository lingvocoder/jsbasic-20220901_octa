const calculator = require('./calculator');

describe('Объект calculator, который имеет 3 метода: read, sum, multiply', () => {
  it('Возвращает сумму чисел', () => {
    calculator.read(3, 5);
    expect(calculator.sum()).toBe(8);
  });

  it('Возвращает произведение чисел', () => {
    calculator.read(3, 5);
    expect(calculator.multiply()).toBe(15);
  });

  it('Корректно суммирует числа, если первый аргумент равен 0', () => {
    calculator.read(0, 1);
    expect(calculator.sum()).toBe(1);
  });

  it('Корректно суммирует числа, если второй аргумент равен 0', () => {
    calculator.read(1, 0);
    expect(calculator.sum()).toBe(1);
  });

  it('Корректно суммирует числа, если аргументы переданы в виде строк', () => {
    calculator.read('1', '9');
    expect(calculator.sum()).toBe(10);
  });

  it('Корректно перемножает числа, если аргументы переданы в виде строк', () => {
    calculator.read('3', '5');
    expect(calculator.multiply()).toBe(15);
  });
});
