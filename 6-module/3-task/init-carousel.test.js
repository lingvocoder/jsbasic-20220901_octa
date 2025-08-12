import {createElement} from "../../assets/lib/create-element.js";
import Carousel from "./init-carousel.js";
import slides from "./slides.js";

describe('Класс, описывающий компонент Carousel', () => {
  let carousel;
  let container;
  const SLIDE_WIDTH = 300;

  beforeEach(() => {
    container = createElement(`<div id="carousel-holder"></div>`);
    document.body.append(container);

    carousel = new Carousel(slides);
    container.appendChild(carousel.elem);

    // Сбрасываем counter на 0
    carousel.counter = 0;

    const carouselInner = carousel.elem.querySelector('.carousel__inner');

    // Мокаем getComputedStyle ТОЛЬКО для carouselInner
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = (element, pseudoElement) => {
      if (element === carouselInner) {
        return {
          width: `${SLIDE_WIDTH}px`,
          getPropertyValue: (prop) => {
            if (prop === 'width') return `${SLIDE_WIDTH}px`;
            return '';
          }
        };
      }
      return originalGetComputedStyle.call(window, element, pseudoElement);
    };
  });

  afterEach(() => {
    container.remove();
  });

  describe('Отрисовка вёрстки компонента после создания экземпляра класса', () => {
    it('Добавляет корневой элемент в свойство elem', () => {
      expect(carousel.elem).not.toBeNull();
      expect(carousel.elem.classList.contains('carousel')).toBe(true);
    });

    it('Компонент Carousel содержит все слайды', () => {
      let slideElements = carousel.elem.querySelectorAll('.carousel__slide');
      expect(slideElements.length).toBe(slides.length);
    });

    it('Кнопка "назад" скрыта, кнопка "вперёд" видна', () => {
      let carouselArrowLeft = carousel.elem.querySelector('.carousel__arrow_left');
      let carouselArrowRight = carousel.elem.querySelector('.carousel__arrow_right');
      expect(carouselArrowLeft.style.display).toBe('none');
      expect(carouselArrowRight.style.display).toBe('');
    });

    it('Корректно создаёт разметку каждого слайда', () => {
      let slideElements = carousel.elem.querySelectorAll('.carousel__slide');
      let firstSlide = slideElements[0];

      expect(firstSlide.querySelector('.carousel__img')).not.toBeNull();
      expect(firstSlide.querySelector('.carousel__price')).not.toBeNull();
      expect(firstSlide.querySelector('.carousel__title')).not.toBeNull();
      expect(firstSlide.querySelector('.carousel__button')).not.toBeNull();
    });
  });

  describe('Переключение слайдов с помощью кнопок "назад"/"вперёд"', () => {

    it('При нажатии кнопки "вперёд" передвигает на один слайд вперёд', () => {
      let carouselInner = carousel.elem.querySelector('.carousel__inner');
      let carouselArrowRight = carousel.elem.querySelector('.carousel__arrow_right');

      expect(carousel.counter).toBe(0);
      expect(window.getComputedStyle(carouselInner).width).toBe('300px');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowRight.dispatchEvent(clickEvent);

      expect(carousel.counter).toBe(1);
      expect(carouselInner.style.transform).toBe('translateX(-300px)');
    });

    it('При нажатии кнопки "назад" передвигает на один слайд назад', () => {
      let carouselInner = carousel.elem.querySelector('.carousel__inner');
      let carouselArrowRight = carousel.elem.querySelector('.carousel__arrow_right');
      let carouselArrowLeft = carousel.elem.querySelector('.carousel__arrow_left');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowRight.dispatchEvent(clickEvent);
      expect(carouselInner.style.transform).toBe('translateX(-300px)');

      carouselArrowLeft.dispatchEvent(clickEvent);
      expect(carouselInner.style.transform).toBe('translateX(0px)');
    });

    it('Корректно показывает/скрывает кнопки навигации', () => {
      let carouselArrowLeft = carousel.elem.querySelector('.carousel__arrow_left');
      let carouselArrowRight = carousel.elem.querySelector('.carousel__arrow_right');

      expect(carouselArrowLeft.style.display).toBe('none');
      expect(carouselArrowRight.style.display).toBe('');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowRight.dispatchEvent(clickEvent);

      expect(carouselArrowLeft.style.display).toBe('');
      expect(carouselArrowRight.style.display).toBe('');

      for (let i = 1; i < slides.length - 1; i++) {
        carouselArrowRight.dispatchEvent(clickEvent);
      }

      expect(carouselArrowLeft.style.display).toBe('');
      expect(carouselArrowRight.style.display).toBe('none');
    });

    it('Не перемещается дальше первого слайда при клике "назад"', () => {
      let carouselInner = carousel.elem.querySelector('.carousel__inner');
      let carouselArrowLeft = carousel.elem.querySelector('.carousel__arrow_left');

      // В начале мы на первом слайде
      expect(carousel.counter).toBe(0);
      expect(carouselInner.style.transform).toBe('');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowLeft.dispatchEvent(clickEvent);

      // После клика "назад" на первом слайде ничего не должно измениться
      expect(carousel.counter).toBe(0);
      expect(carouselInner.style.transform).toBe('');
    });

    it('Не перемещается дальше последнего слайда при клике "вперёд"', () => {
      let carouselInner = carousel.elem.querySelector('.carousel__inner');
      let carouselArrowRight = carousel.elem.querySelector('.carousel__arrow_right');

      const clickEvent = new MouseEvent('click', {bubbles: true});

      for (let i = 0; i < slides.length; i++) {
        carouselArrowRight.dispatchEvent(clickEvent);
      }

      // Проверяем что мы на последнем слайде
      expect(carousel.counter).toBe(slides.length - 1);
      const lastPosition = carouselInner.style.transform;

      // Пытаемся кликнуть еще раз "вперёд"
      carouselArrowRight.dispatchEvent(clickEvent);

      // Counter и позиция не должны измениться
      expect(carousel.counter).toBe(slides.length - 1);
      expect(carouselInner.style.transform).toBe(lastPosition);
    });
  });
});
