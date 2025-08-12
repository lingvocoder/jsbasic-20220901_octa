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
      <div class="carousel">
          <div class="carousel__arrow carousel__arrow_right">
              <img src="/assets/images/icons/angle-icon.svg" alt="icon">
          </div>
          <div class="carousel__arrow carousel__arrow_left">
              <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
          </div>

          <div class="carousel__inner">
              <div class="carousel__slide" data-id="penang-shrimp">
                  <img src="/assets/images/carousel/penang_shrimp.png" class="carousel__img" alt="slide">
                  <div class="carousel__caption">
                      <span class="carousel__price">€16.00</span>
                      <div class="carousel__title">Penang shrimp</div>
                      <button type="button" class="carousel__button">
                          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                      </button>
                  </div>
              </div>

              <div class="carousel__slide" data-id="chicken-cashew">
                  <img src="/assets/images/carousel/chicken_cashew.png" class="carousel__img" alt="slide">
                  <div class="carousel__caption">
                      <span class="carousel__price">€14.00</span>
                      <div class="carousel__title">Chicken cashew</div>
                      <button type="button" class="carousel__button">
                          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                      </button>
                  </div>
              </div>

              <div class="carousel__slide" data-id="red-curry-veggies">
                  <img src="/assets/images/carousel/red_curry_vega.png" class="carousel__img" alt="slide">
                  <div class="carousel__caption">
                      <span class="carousel__price">€12.50</span>
                      <div class="carousel__title">Red curry veggies</div>
                      <button type="button" class="carousel__button">
                          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                      </button>
                  </div>
              </div>

              <div class="carousel__slide" data-id="chicken-springrolls">
                  <img src="/assets/images/carousel/chicken_loempias.png" class="carousel__img" alt="slide">
                  <div class="carousel__caption">
                      <span class="carousel__price">€6.50</span>
                      <div class="carousel__title">Chicken springrolls</div>
                      <button type="button" class="carousel__button">
                          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
                      </button>
                  </div>
                </div>
            </div>
        </div>
    `;
    document.body.append(carouselWrapper);

    initCarousel();
  });

  afterEach(() => {
    carouselWrapper.remove();
  });

  describe('Переключение слайдов с помощью кнопок "назад"/"вперёд"', () => {

    it('Корректно показывает/скрывает кнопки навигации', () => {
      let carouselArrowLeft = carouselWrapper.querySelector('.carousel__arrow_left');
      let carouselArrowRight = carouselWrapper.querySelector('.carousel__arrow_right');

      expect(carouselArrowLeft.style.display).toBe('none');
      expect(carouselArrowRight.style.display).toBe('');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowRight.dispatchEvent(clickEvent);

      expect(carouselArrowLeft.style.display).toBe('none');
      expect(carouselArrowRight.style.display).toBe('');

      for (let i = 1; i < slides.length - 1; i++) {
        carouselArrowRight.dispatchEvent(clickEvent);
      }

      expect(carouselArrowLeft.style.display).toBe('none');
      expect(carouselArrowRight.style.display).toBe('');
    });

    it('Не перемещается дальше первого слайда при клике "назад"', () => {
      let carouselInner = carouselWrapper.querySelector('.carousel__inner');
      let carouselArrowLeft = carouselWrapper.querySelector('.carousel__arrow_left');

      // В начале мы на первом слайде
      expect(carouselInner.style.transform).toBe('');

      const clickEvent = new MouseEvent('click', {bubbles: true});
      carouselArrowLeft.dispatchEvent(clickEvent);

      // После клика "назад" на первом слайде ничего не должно измениться
      expect(carouselInner.style.transform).toBe('');
    });

    it('Не перемещается дальше последнего слайда при клике "вперёд"', () => {
      let carouselInner = carouselWrapper.querySelector('.carousel__inner');
      let carouselArrowRight = carouselWrapper.querySelector('.carousel__arrow_right');

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
