import toggleText from "./toggleText";

describe("Функция, которая скрывает элемент при первом нажатии кнопки, а при повторном нажатии делает элемент видимым", () => {
  let buttonElement;
  let textElement;

  beforeEach(() => {
    buttonElement = document.createElement('button');
    buttonElement.textContent = 'Нажмите, чтобы скрыть/показать текст';
    buttonElement.className = 'toggle-text-button';

    textElement = document.createElement('div');
    textElement.className = 'text-container';

    document.body.append(buttonElement);
    document.body.append(textElement);

    toggleText();
  });

  afterEach(() => {
    buttonElement.remove();
    textElement.remove();
  });

  it('При первом нажатии кнопки текст скрывается', () => {
    let clickEvent = new MouseEvent('click', { bubbles: true });
    buttonElement.dispatchEvent(clickEvent);

    expect(textElement.hidden).toBeTruthy();
  });

  it('При повторном нажатии кнопки текст отображается', () => {
    let clickEvent = new MouseEvent('click', { bubbles: true });
    buttonElement.dispatchEvent(clickEvent);
    buttonElement.dispatchEvent(clickEvent);

    expect(textElement.hidden).toBeFalsy();
  });
});
