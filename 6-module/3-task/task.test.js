const data = require('./slides.mjs');
const Carousel = require('./index.mjs');


describe('Класс, описывающий компонент "Карусель"', () => {
  let sut;

  let carouselInner;
  let carouselArrowRight;
  let carouselArrowLeft;

  let clickEvent;
  let testSlides;

  beforeEach(() => {
    testSlides = data.slice(1);

    sut = new Carousel(testSlides);
    document.body.append(sut.elem);

    let slideWidth = '500px';

    carouselInner = sut.elem.querySelector('.carousel__inner');
    carouselInner.style.width = slideWidth;

    let slides = sut.elem.querySelectorAll('.carousel__slide');

    slides.forEach((slide) => {
      slide.style.width = slideWidth;
      let img = slide.querySelector('.carousel__img');

      if (img) {
        img.style.width = slideWidth;
      }
    });

    carouselArrowRight = sut.elem.querySelector('.carousel__arrow_right');
    carouselArrowLeft = sut.elem.querySelector('.carousel__arrow_left');

    clickEvent = new MouseEvent('click', {bubbles: true});
  });

  afterEach(() => {
    sut.elem.remove();
  });

  describe('Отрисовка вёрстки после создания экземпляра класса', () => {
    it('Добавляет корневой элемент в свойство "elem"', () => {
      expect(sut.elem.classList.contains('carousel')).toBe(true);
    });

    it('Отрисовывает все слайды', () => {
      let slides = sut.elem.querySelectorAll('.carousel__slide');

      expect(slides.length).toBe(3);
    });
  });

  describe('Переключение слайдов', () => {
    describe('Переключение вперёд', () => {
      it('При клике по кнопке "вперёд", передвигает на один слайд вперёд', () => {
        carouselArrowRight.dispatchEvent(clickEvent);

        expect(carouselInner.style.transform).toBe("translateX(-500px)");
      });
    });

    describe('Переключение назад', () => {
      beforeEach(() => {
        carouselArrowRight.dispatchEvent(clickEvent);
        carouselArrowRight.dispatchEvent(clickEvent);
        carouselArrowRight.dispatchEvent(clickEvent);
      });

      it('При клике по кнопке "назад", передвигает на один слайд назад', () => {
        carouselArrowLeft.dispatchEvent(clickEvent);

        expect(carouselInner.style.transform).toBe('translateX(-1000px)');
      });
    });

    describe('Скрытие стрелок переключения', () => {
      it('В исходном состоянии скрывает стрелку переключения назад', () => {
        expect(carouselArrowLeft.style.display).toBe('none');
      });

      it('При достижении крайнего слайда скрывает стрелку переключения вперёд', () => {
        carouselArrowRight.dispatchEvent(clickEvent);
        carouselArrowRight.dispatchEvent(clickEvent);

        expect(carouselArrowRight.style.display).toBe('none');
      });
    });
  });

  describe('Генерация события добавления в корзину("product-add")', () => {
    let productAddEvent;

    beforeEach(() => {
      productAddEvent = null;

      document.body.addEventListener('product-add', (event) => {
        productAddEvent = event;
      }, {once: true});
    });

    afterEach(() => {
      productAddEvent = null;
    });

    it('При нажатии по кнопке, создаётся событие', () => {
      let addButton = sut.elem.querySelector('.carousel__button');
      addButton.dispatchEvent(clickEvent);

      expect(productAddEvent instanceof CustomEvent).toBe(true);
    });

    it('Созданное событие содержит в себе уникальный идентификатор товара("id") из 1-го слайда,' +
      'Если нажатие на 1-м слайде', () => {
      let addButton = sut.elem.querySelector('.carousel__button');
      addButton.dispatchEvent(clickEvent);

      expect(productAddEvent.detail).toBe(testSlides[0].id);
    });

    it('Созданное событие содержит в себе уникальный идентификатор товара("id") из 2-го слайда,' +
      'Если нажатие на 2-м слайде', () => {
      carouselArrowRight.dispatchEvent(clickEvent);
      let addButtons = sut.elem.querySelectorAll('.carousel__button');
      addButtons[1].dispatchEvent(clickEvent);

      expect(productAddEvent.detail).toBe(testSlides[1].id);
    });
  });
});
