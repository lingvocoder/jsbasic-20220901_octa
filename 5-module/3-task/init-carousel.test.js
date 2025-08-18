import initCarousel from "./init-carousel.js";
import slides from "../../6-module/3-task/slides.js";

describe('Функция, которая создаёт элемент интерфейса – карусель', () => {
  let carouselWrapper;
  let clickEvent;

  beforeEach(() => {
    clickEvent = new MouseEvent('click', { bubbles: true });
    carouselWrapper = document.createElement('div');
    carouselWrapper.classList.add('container');
    carouselWrapper.innerHTML = `
          <section class="carousel" aria-label="Меню блюд" role="region">
            <button class="carousel__nav-button carousel__next-button" aria-label="Следующий слайд" type="button">
                <img src="/assets/images/icons/angle-icon.svg" alt="" role="presentation">
            </button>
            <button class="carousel__nav-button carousel__prev-button" aria-label="Предыдущий слайд" type="button">
                <img src="/assets/images/icons/angle-left-icon.svg" alt="" role="presentation">
            </button>

            <div class="carousel__slides-container" role="listbox" aria-live="polite">
                <article class="carousel__slide" data-id="penang-shrimp" role="option">
          <img src="/assets/images/carousel/penang_shrimp.png" class="carousel__product-image" alt="Пенанг креветки - блюдо тайской кухни">
          <div class="carousel__slide-content">
            <span class="carousel__price-badge">€16.00</span>
            <h3 class="carousel__title">Penang shrimp</h3>
            <button type="button" class="carousel__add-button" aria-label="Добавить Penang shrimp в корзину">
              <img src="/assets/images/icons/plus-icon.svg" alt="" role="presentation">
            </button>
          </div>
        </article>

                <article class="carousel__slide" data-id="chicken-cashew" role="option">
          <img src="/assets/images/carousel/chicken_cashew.png" class="carousel__product-image" alt="Курица с кешью - блюдо тайской кухни">
          <div class="carousel__slide-content">
            <span class="carousel__price-badge">€14.00</span>
            <h3 class="carousel__title">Chicken cashew</h3>
            <button type="button" class="carousel__add-button" aria-label="Добавить Chicken cashew в корзину">
              <img src="/assets/images/icons/plus-icon.svg" alt="" role="presentation">
            </button>
          </div>
        </article>

                <article class="carousel__slide" data-id="red-curry-veggies" role="option">
          <img src="/assets/images/carousel/red_curry_vega.png" class="carousel__product-image" alt="Красное карри с овощами - вегетарианское блюдо тайской кухни">
          <div class="carousel__slide-content">
            <span class="carousel__price-badge">€12.50</span>
            <h3 class="carousel__title">Red curry veggies</h3>
            <button type="button" class="carousel__add-button" aria-label="Добавить Red curry veggies в корзину">
              <img src="/assets/images/icons/plus-icon.svg" alt="" role="presentation">
            </button>
          </div>
        </article>

                <article class="carousel__slide" data-id="chicken-springrolls" role="option">
          <img src="/assets/images/carousel/chicken_loempias.png" class="carousel__product-image" alt="Спринг-роллы с курицей - закуска тайской кухни">
          <div class="carousel__slide-content">
            <span class="carousel__price-badge">€6.50</span>
            <h3 class="carousel__title">Chicken spring rolls</h3>
            <button type="button" class="carousel__add-button" aria-label="Добавить Chicken spring rolls в корзину">
              <img src="/assets/images/icons/plus-icon.svg" alt="" role="presentation">
            </button>
          </div>
        </article>
            </div>
          </section>

    `;
    document.body.append(carouselWrapper);

    initCarousel();
  });

  afterEach(() => {
    carouselWrapper.remove();
  });

  describe('Переключение слайдов с помощью кнопок "назад"/"вперёд"', () => {

    it('Корректно показывает/скрывает кнопки навигации', () => {
      let carouselArrowLeft = carouselWrapper.querySelector('.carousel__prev-button');
      let carouselArrowRight = carouselWrapper.querySelector('.carousel__next-button');

      expect(carouselArrowLeft.style.visibility).toBe('hidden');
      expect(carouselArrowRight.style.visibility).toBe('visible');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowRight.dispatchEvent(clickEvent);

      expect(carouselArrowLeft.style.visibility).toBe('visible');
      expect(carouselArrowRight.style.visibility).toBe('visible');

      for (let i = 1; i < slides.length - 1; i++) {
        carouselArrowRight.dispatchEvent(clickEvent);
      }

      expect(carouselArrowLeft.style.visibility).toBe('visible');
      expect(carouselArrowRight.style.visibility).toBe('hidden');
    });

    it('Не перемещается дальше первого слайда при клике "назад"', () => {
      let carouselInner = carouselWrapper.querySelector('.carousel__slides-container');
      let carouselArrowLeft = carouselWrapper.querySelector('.carousel__prev-button');

      // В начале мы на первом слайде
      expect(carouselInner.style.transform).toBe('');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowLeft.dispatchEvent(clickEvent);

      // После клика "назад" на первом слайде ничего не должно измениться
      expect(carouselInner.style.transform).toBe('');
    });

    it('Не перемещается дальше последнего слайда при клике "вперёд"', () => {
      let carouselInner = carouselWrapper.querySelector('.carousel__slides-container');
      let carouselArrowRight = carouselWrapper.querySelector('.carousel__next-button');

      const clickEvent = new MouseEvent('click', {bubbles: true});

      for (let i = 0; i < slides.length; i++) {
        carouselArrowRight.dispatchEvent(clickEvent);
      }

      // Проверяем что мы на последнем слайде
      const lastPosition = carouselInner.style.transform;

      // Пытаемся кликнуть еще раз "вперёд"
      carouselArrowRight.dispatchEvent(clickEvent);

      // Counter и позиция не должны измениться
      expect(carouselInner.style.transform).toBe(lastPosition);
    });
  });

});
