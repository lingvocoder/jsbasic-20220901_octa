const regulateConditioner = require('./regulateConditioner');

describe('Функция, определяющая температуру, которая будет установлена в комнате через час в зависимости от выбранного режима', () => {
  it('Возвращает 20 при температуре в комнате равной 10 и режиме работы heat', () => {
    expect(regulateConditioner(10, 20, 'heat')).toBe(20);
  });
  it('Возвращает 10 при температуре в комнате равной 10 и режиме работы freeze', () => {
    expect(regulateConditioner(10, 20, 'freeze')).toBe(10);
  });
  it('Возвращает 10 при температуре в комнате равной 20 и режиме работы freeze', () => {
    expect(regulateConditioner(20, 10, 'freeze')).toBe(10);
  });
  it('Возвращает 10 при температуре в комнате равной 10 и режиме работы fan', () => {
    expect(regulateConditioner(10, 20, 'fan')).toBe(10);
  });
  it('Возвращает 20 при температуре в комнате равной 25 и режиме работы auto', () => {
    expect(regulateConditioner(25, 20, 'auto')).toBe(20);
  });
});
