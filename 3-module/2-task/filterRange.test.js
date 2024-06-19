const filterRange = require('./index');

describe('Функция, которая принимает в качестве аргумента массив чисел и возвращает отфильтрованный массив', () => {
  let arr;

  beforeEach(() => {
    arr = [5, 3, 8, 1];
  });

  it('Возвращает массив, отфильтрованный в указанном диапазоне', () => {
    let actualFiltered = filterRange(arr, 1, 4);
    let expectedFiltered = [3, 1];

    expect(actualFiltered).toEqual(expectedFiltered);
  });

  it('Не изменяет исходный массив', () => {
    let copyOfOriginalArr = [...arr];
    filterRange(arr, 1, 4);

    expect(arr).toEqual(copyOfOriginalArr);
  });
});
