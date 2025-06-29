import truncate from "./truncate";

describe('Функция, которая проверяет длину строки и сокращает её, если значение длины больше указанного значения', () => {
  it('Возвращает строку, укороченную на значение maxlength', () => {
    let baseStr = 'Вот, что мне хотелось бы сказать на эту тему:';
    let newStr = 'Вот, что мне хотело…';

    expect(truncate(baseStr, 20)).toBe(newStr);
  });

  it('Возвращает строку, укороченную на значение maxlength', () => {
    let baseStr = 'Вот, что мне хотелось бы сказать на эту тему:';
    let newStr = 'Вот, что …';

    expect(truncate(baseStr, 10)).toBe(newStr);
  });

  it('Возвращает исходную строку', () => {
    let baseStr = 'Всем привет!';

    expect(truncate(baseStr, 20)).toBe(baseStr);
  });
});
