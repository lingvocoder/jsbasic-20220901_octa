const toUpperCaseFirst = require('./toUpperCaseFirst');

describe('Функция, которая возвращает строку str, начинающуюся с заглавной буквы', () => {
  it('Возвращает строку с заглавной первой буквой', () => {
    expect(toUpperCaseFirst('петя')).toBe('Петя');
  });

  it('Возвращает строку с заглавной первой буквой, если строка содержит один символ', () => {
    expect(toUpperCaseFirst('д')).toBe('Д');
  });

  it('Возвращает пустую строку, если длина строки равна 0', () => {
    expect(toUpperCaseFirst('')).toBe('');
  });
});
