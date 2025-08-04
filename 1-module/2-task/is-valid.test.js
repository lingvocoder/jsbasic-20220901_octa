import isValid from "./is-valid.js";

describe('Функция проверяет, что имя соответствует заявленным параметрам', () => {
  it('Возвращает true, если имя соответствует параметрам', () => {
    expect(isValid('Ilia')).toEqual(true);
  });

  it('Возвращает false, если имя содержит пробелы', () => {
    expect(isValid('Ilia Burlak')).toEqual(false);
  });

  it('Возвращает false, если длина имени меньше 4 символов', () => {
    expect(isValid('Ili')).toEqual(false);
  });

  it('Возвращает false, если параметр не передан', () => {
    expect(isValid(null)).toEqual(false);
  });
});
