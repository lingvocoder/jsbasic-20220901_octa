import camelize from "./camelize";

describe('Функция, которая преобразует строку вида "my-short-string" в "myShortString"', () => {
  it('Возвращает пустую строку без изменений', () => {
    expect(camelize('')).toBe('');
  });

  it('Возвращает преобразованную строку "background-color"', () => {
    expect(camelize('background-color')).toBe('backgroundColor');
  });

  it('Возвращает преобразованную строку "list-style-image"', () => {
    expect(camelize('list-style-image')).toBe('listStyleImage');
  });

  it('Возвращает преобразованную строку "-webkit-transition"', () => {
    expect(camelize('-webkit-transition')).toBe('WebkitTransition');
  });
});
