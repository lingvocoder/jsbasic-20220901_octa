import Modal from "./modal.js";

describe('Класс, описывающий компонент "Модальное окно"', () => {
  let modal;

  beforeEach(() => {
    modal = new Modal();
  });

  afterEach(() => {
    modal.close();
  });

  describe('Метод open()', () => {
    beforeEach(() => {
      modal.open();
    });

    afterEach(() => {
      modal.close();
    });

    it('Создаёт корневой элемент модального окна', () => {
      let modalElement = document.body.querySelector('.modal');

      expect(modalElement).toBeTruthy();
    });

    it('Создаёт прозрачный фон', () => {
      let modalElement = document.body.querySelector('.modal .modal__overlay');

      expect(modalElement).toBeTruthy();
    });

    it('Добавляет класс "is-modal-open" элементу body', () => {
      let hasIsModalOpenClass = document.body.classList.contains('is-modal-open');

      expect(hasIsModalOpenClass).toBe(true);
    });
  });

  describe(`Метод setTitle('modal title')`, () => {
    it('Устанавливает значение переменной для заголовка модального окна', () => {
      let title = 'Я главное модальное окно';

      modal.setTitle(title);
      modal.open();

      let titleElement = document.querySelector('.modal__title');

      expect(titleElement.textContent.trim()).toBe(title);

      modal.close();
    });

    it('Устанавливает значение строки заголовка модального окна после его открытия', () => {
      let title = 'Я главное модальное окно';

      modal.open();
      modal.setTitle(title);

      let titleElement = document.querySelector('.modal__title');

      expect(titleElement.textContent.trim()).toBe(title);

      modal.close();
    });
  });

  describe(`Метод setBody(node)`, () => {
    const createModalBody = (text) => {
      let node = document.createElement('div');
      node.className = 'test-node-class';
      node.innerHTML = `<h4>${text}</h4>`;

      return node;
    };

    const selectInnerTitle = () => {
      let modalBody = document.querySelector('.modal .modal__body');
      let nodeFromModal = modalBody.querySelector('.test-node-class');
      let innerTitle = nodeFromModal && nodeFromModal.querySelector('h4');

      return innerTitle.textContent;
    };

    afterEach(() => {
      modal.close();
    });

    it('Вставляет HTML-разметку содержимого модального окна в элемент с классом "modal__body"', () => {
      let innerTitleText = 'Внутренний заголовок содержимого';
      const node = createModalBody(innerTitleText);

      modal.setBody(node);

      modal.open();

      expect(selectInnerTitle()).toBe(innerTitleText);
    });

    it('Вставляет HTML-разметку содержимого модального окна в элемент с классом "modal__body" после открытия модального окна', () => {
      modal.open();

      let innerTitleText = 'Внутренний заголовок содержимого';
      const node = createModalBody(innerTitleText);

      modal.setBody(node);

      expect(selectInnerTitle()).toBe(innerTitleText);
    });
  });

  describe('Закрытие', () => {
    let clickEvent;
    let closeButton;

    beforeEach(() => {
      modal.open();

      clickEvent = new MouseEvent('click', {bubbles: true});
      closeButton = document.body.querySelector('.modal .modal__close');
    });

    it('При вызове метода close() вёрстка модального окна удаляется из body', () => {
      modal.close();

      let modalElement = document.querySelector('.modal');

      expect(modalElement).toBeNull();
    });

    it('При вызове метода close() класс "is-modal-open" удаляется у элемента body', () => {
      modal.close();

      let hasIsModalOpenClass = document.body.classList.contains('is-modal-open');

      expect(hasIsModalOpenClass).toBe(false);
    });

    it('При нажатии по кнопке [X], вёрстка модального окна удаляется из body', () => {
      closeButton.dispatchEvent(clickEvent);

      let modalElement = document.querySelector('.modal');

      expect(modalElement).toBeNull();
    });

    it('При нажатии по кнопке [X] класс "is-modal-open" удаляется у элемента body', () => {
      closeButton.dispatchEvent(clickEvent);

      let hasIsModalOpenClass = document.body.classList.contains('is-modal-open');

      expect(hasIsModalOpenClass).toBe(false);
    });

    describe('Если была нажата клавиша ESC', () => {
      let escKeyDownEvent;

      beforeEach(() => {
        escKeyDownEvent = new KeyboardEvent('keydown', {
          code: 'Escape',
          key: 'Escape',
          bubbles: true
        });
      });

      it('Вёрстка модального окна удаляется из body', () => {
        document.body.dispatchEvent(escKeyDownEvent);

        let modalElement = document.querySelector('.modal');

        expect(modalElement).toBeNull();
      });

      it('Удаляется класс "is-modal-open" у элемента body', () => {
        document.body.dispatchEvent(escKeyDownEvent);

        let hasIsModalOpenClass = document.body.classList.contains('is-modal-open');

        expect(hasIsModalOpenClass).toBe(false);
      });
    });

    describe('Если была нажата любая другая клавиша кроме ESC', () => {
      let spaceButtonKeyDownEvent;

      beforeEach(() => {
        spaceButtonKeyDownEvent = new KeyboardEvent('keydown', {
          code: ' ',
          key: 'Space',
          bubbles: true
        });
      });

      it('Вёрстка модального окна не удаляется из body', () => {
        document.body.dispatchEvent(spaceButtonKeyDownEvent);

        let modalElement = document.querySelector('.modal');

        expect(modalElement).not.toBeNull();
      });

      it('Класс "is-modal-open" не удаляется у элемента body', () => {
        document.body.dispatchEvent(spaceButtonKeyDownEvent);

        let hasIsModalOpenClass = document.body.classList.contains('is-modal-open');

        expect(hasIsModalOpenClass).toBe(true);
      });
    });

  });
});
