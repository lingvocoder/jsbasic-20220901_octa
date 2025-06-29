import checkSpam from "./checkSpam";

describe('Функция, которая проверяет, содержит ли строка \'1xBet\' или \'XXX\'', () => {
  it('Возвращает true, если строка содержит \'1XbeT now\'', () => {
    expect(checkSpam('1XbeT now')).toBe(true);
  });

  it('Возвращает true, если строка содержит \'free xxxxx\'', () => {
    expect(checkSpam('free xxxxx')).toBe(true);
  });

  it('Возвращает false, если строка содержит \'innocent rabbit\'', () => {
    expect(checkSpam('innocent rabbit')).toBe(false);
  });
});
