const isEmpty = require('./index');

describe('Функция, которая проверяет наличие свойств в объекте', () => {
  it('Возвращает true, если объект пустой', () => {
    const obj = {};
    expect(isEmpty(obj)).toEqual(true);
  });

  it('Возвращает false, если объект не пустой', () => {
    const obj = {
      test: true,
    };

    obj.test = undefined;

    expect(isEmpty(obj)).toEqual(false);
  });

  it('Возвращает true, так как свойство было удалено и объект стал пустым', () => {
    const obj = {
      test: true,
    };

    delete obj.test;

    expect(isEmpty(obj)).toEqual(true);
  });

  it('Возвращает false, если объект не пустой', () => {
    const obj = {
      test: true,
    };

    expect(isEmpty(obj)).toEqual(false);
  });
});
