import promiseClick from './promise.js';

describe('Функция, описывающая процесс промисификации нажатия по кнопке', () => {
  it('Возвращает promise, который разрешится после нажатия по кнопке', (done) => {
    let button = document.createElement('button');
    let clickEvent = new MouseEvent('click');

    promiseClick(button).then((event) => {
      expect(event).toBe(clickEvent);
    });

    button.dispatchEvent(clickEvent);
  });
});
