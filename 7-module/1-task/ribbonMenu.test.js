import categories from './categories.js';
import RibbonMenu from "./ribbonMenu.js";
import {expect, jest, test} from '@jest/globals';

describe('Класс, описывающий компонент "Лента-Меню"', () => {
  let sut;

  let ribbonInner;
  let ribbonArrowRight;
  let ribbonArrowLeft;

  let clickEvent;

  beforeEach(() => {
    sut = new RibbonMenu(categories);
    document.body.append(sut.elem);

    ribbonInner = sut.elem.querySelector('.ribbon__inner');

    ribbonArrowRight = sut.elem.querySelector('.ribbon__arrow_right');
    ribbonArrowLeft = sut.elem.querySelector('.ribbon__arrow_left');

    clickEvent = new MouseEvent('click', {bubbles: true});
  });

  afterEach(() => {
    sut.elem.remove();
  });

  describe('Отрисовка вёрстки после создания экземпляра класса', () => {
    it('Добавляет корневой элемент в свойство elem', () => {
      expect(sut.elem.classList.contains('ribbon')).toBe(true);
    });

    it('Отрисовывает все категории меню', () => {
      let categoryElements = sut.elem.querySelectorAll('.ribbon__item');

      expect(categoryElements.length).toBe(9);
    });
  });

  describe('Прокрутка ленты меню', () => {
    let scrollBySpy = jest.fn();

    beforeEach(() => {
      ribbonInner.scrollBy = scrollBySpy;
    });

    describe('Прокрутка вперёд', () => {
      it('При нажатии кнопки "вперёд", передвигает на 350px вперёд', () => {
        ribbonArrowRight.dispatchEvent(clickEvent);

        expect(ribbonInner.scrollBy).toHaveBeenCalledWith(350, 0);
      });
    });

    describe('Прокрутка назад', () => {
      beforeEach(() => {
        ribbonArrowRight.dispatchEvent(clickEvent);
        ribbonArrowRight.dispatchEvent(clickEvent);
      });

      it('При нажатии кнопки "назад" передвигает на 350px назад', () => {
        ribbonArrowLeft.dispatchEvent(clickEvent);

        expect(ribbonInner.scrollBy).toHaveBeenCalledWith(-350, 0);
      });
    });

  });

  describe('Выбор категории', () => {
    let ribbonSelectEventName;
    let ribbonSelectEvent;
    let category;

    beforeEach(() => {
      ribbonSelectEventName = 'ribbon-select';

      document.body.addEventListener(ribbonSelectEventName, (event) => {
        ribbonSelectEvent = event;
      }, {once: true});

      category = categories[1];
      let categorySelectButton = sut.elem.querySelector(`[data-id="${category.id}"]`);

      categorySelectButton.dispatchEvent(clickEvent);
    });

    it('При нажатии по кнопке создаётся событие', () => {
      expect(ribbonSelectEvent instanceof CustomEvent).toBe(true);
    });

    it('Созданное событие содержит в себе уникальный идентификатор категории ("id")', () => {
      expect(ribbonSelectEvent.detail).toBe(category.id);
    });
  });
});
