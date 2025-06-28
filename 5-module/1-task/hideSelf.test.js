const hideSelf = require('./hideSelf');

describe('Функция, которая скрывает/показывает кнопку', () => {
  let buttonElement;

  beforeEach(() => {
    buttonElement = document.createElement('button');
    buttonElement.textContent = 'Нажмите, чтобы спрятать';
    buttonElement.className = 'hide-self-button';

    document.body.append(buttonElement);

    hideSelf();
  });

  afterEach(() => {
    buttonElement.remove();
  });

  it('При первом нажатии кнопки она скрывается', () => {
    let clickEvent = new MouseEvent('click', { bubbles: true });
    buttonElement.dispatchEvent(clickEvent);

    expect(buttonElement.hidden).toBeTruthy();
  });
});
