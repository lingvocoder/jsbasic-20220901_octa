import {createElement} from "../../assets/lib/create-element.js";
import StepSlider from "./slider.js";
import {it} from "vitest";

describe('Класс, описывающий компонент "Пошаговый слайдер"', () => {
  const SLIDER_LEFT = 100;
  const SLIDER_WIDTH = 330;
  let config;
  let stepSlider;
  let sliderContainer;

  beforeEach(() => {
    //Конфиг слайдера
    config = {
      steps: 3,
      value: 0,
    };

    sliderContainer = createElement(`
      <div class="container" id="holder" style="padding: 50px;">
      </div>
    `);

    //Добавляем DOM-элементы (контейнер для слайдера)
    document.body.append(sliderContainer);

    // Создаём экземпляр слайдера
    stepSlider = new StepSlider(config);

    let holder = document.querySelector('#holder');
    holder.append(stepSlider.elem);
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    sliderContainer.remove();
  });

  describe('Отрисовка вёрстки компонента после создания экземпляра класса', () => {
    it('Отрисовывает слайдер с количеством шагов, указанным в конфигурации в момент создания экземпляра класса', () => {
      let steps = stepSlider.elem.querySelectorAll('.slider__steps span');
      expect(steps.length).toBe(3);
    });

    it('Первый шаг активен и имеет соответсвующий класс', () => {
      let step1 = stepSlider.elem.querySelector('.slider__steps span');
      expect(step1.classList.contains('slider__step-active')).toBe(true);
    });

    it('Задаёт корректное значение CSS-переменной --slider-progress', () => {
      let sliderProgress = stepSlider.elem.style.getPropertyValue('--slider-progress');
      expect(sliderProgress).toBe('0%');

      const progressValue = stepSlider.elem.querySelector('.slider__value');
      expect(progressValue.textContent).toBe('0');
    });
  });

  describe('При нажатии происходит замена текущего значения на значение, указанное в атрибуте активного шага', () => {
    let thumb;
    let progress;
    let slider;

    beforeEach(() => {
      slider = stepSlider.elem;
      thumb = stepSlider.elem.querySelector('.slider__thumb');
      progress = stepSlider.elem.querySelector('.slider__progress');
      mockSliderDimensions(slider, SLIDER_WIDTH);
    });

    afterEach(() => {
      // Очищаем моки
      vi.restoreAllMocks();
    });

    function mockSliderDimensions(slider, SLIDER_WIDTH) {
      Object.defineProperty(slider, 'offsetWidth', {
        value: SLIDER_WIDTH,
        configurable: true,
        writable: true
      });

      vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
        left: SLIDER_LEFT,
        right: SLIDER_LEFT + SLIDER_WIDTH,
        width: SLIDER_WIDTH,
        top: 0,
        bottom: 8,
        height: 8
      });
    }

    it('При нажатии на первый разделитель слайдера устанавливает значение 0', () => {
      mockSliderDimensions(slider, SLIDER_WIDTH);

      const clickEvent = new MouseEvent('click', {
        clientX: SLIDER_LEFT,
        bubbles: true,
      });

      slider.dispatchEvent(clickEvent);

      expect(stepSlider.value).toBe(0);
      let sliderProgress = slider.style.getPropertyValue('--slider-progress');
      expect(sliderProgress).toBe('0%');

      const progressValue = slider.querySelector('.slider__value');
      expect(progressValue.textContent).toBe('0');
    });

    it('При нажатии задаёт корректное значение CSS-переменной --slider-progress', () => {
      mockSliderDimensions(slider, SLIDER_WIDTH);

      const clickEvent = new MouseEvent('click', {
        clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2),
        bubbles: true
      });

      slider.dispatchEvent(clickEvent);

      expect(stepSlider.value).toBe(1);

      let sliderProgress = slider.style.getPropertyValue('--slider-progress');
      expect(sliderProgress).toBe('50%');

      const progressValue = slider.querySelector('.slider__value');
      expect(progressValue.textContent).toBe('1');
    });

    it('При нажатии на последний разделитель слайдера устанавливает максимальное значение', () => {
      mockSliderDimensions(slider, SLIDER_WIDTH);

      const clickEvent = new MouseEvent('click', {
        clientX: SLIDER_LEFT + SLIDER_WIDTH,
        bubbles: true,
      });

      slider.dispatchEvent(clickEvent);

      expect(stepSlider.value).toBe(stepSlider.steps - 1);

      let sliderProgress = slider.style.getPropertyValue('--slider-progress');
      expect(sliderProgress).toBe('100%');

      const progressValue = slider.querySelector('.slider__value');
      expect(progressValue.textContent).toBe('2');
    });

    it("При нажатии происходит корректная замена текущего значения detail в пользовательском событии slider-change", async () => {
      // Проверка промежуточных позиций
      const LEFT_EDGE = SLIDER_LEFT;
      const MIDDLE = SLIDER_LEFT + SLIDER_WIDTH / 2;
      const RIGHT_EDGE = SLIDER_LEFT + SLIDER_WIDTH;

      const testCases = [
        {clientX: LEFT_EDGE, expectedValue: 0, expectedProgress: '0%'},
        {clientX: MIDDLE, expectedValue: 1, expectedProgress: '50%'},
        {clientX: RIGHT_EDGE, expectedValue: 2, expectedProgress: '100%'}
      ];

      for (const {clientX, expectedValue, expectedProgress} of testCases) {
        const eventPromise = new Promise((resolve) => {
          slider.addEventListener('slider-change', (event) => {
            resolve(event.detail);
          }, {once: true});
        });

        slider.dispatchEvent(new MouseEvent('click', {
          clientX: clientX,
          bubbles: true
        }));

        const detail = await eventPromise;
        expect(detail).toBe(expectedValue);

        const sliderProgress = slider.style.getPropertyValue('--slider-progress');
        expect(sliderProgress).toBe(expectedProgress);
      }
    });

    it('При нажатии активный шаг имеет соответствующий класс', () => {
      const clickEvent = new MouseEvent('click', {
        clientX: SLIDER_LEFT + SLIDER_WIDTH / 2,
        bubbles: true,
      });

      slider.dispatchEvent(clickEvent);
      let steps = slider.querySelectorAll('.slider__steps span');
      const activeSteps = slider.querySelectorAll('.slider__steps span.slider__step-active');

      expect(activeSteps.length).toBe(1);
      expect(steps[0].classList.contains('slider__step-active')).toBe(false);
      expect(steps[1].classList.contains('slider__step-active')).toBe(true);
      expect(steps[2].classList.contains('slider__step-active')).toBe(false);
    });

    describe('Отслеживание нажатий за пределами слайдера', () => {
      it('Отслеживание нажатий левее слайдера', () => {
        const clickEvent = new MouseEvent('click', {
          clientX: SLIDER_LEFT - 10,
          bubbles: true,
        });

        slider.dispatchEvent(clickEvent);
        expect(stepSlider.value).toBe(0);
        expect(slider.style.getPropertyValue('--slider-progress')).toBe('0%');
      });

      it('Отслеживание нажатий правее слайдера', () => {
        const clickEvent = new MouseEvent('click', {
          clientX: SLIDER_LEFT + SLIDER_WIDTH + 10,
          bubbles: true,
        });

        slider.dispatchEvent(clickEvent);
        expect(stepSlider.value).toBe(2);
        expect(slider.style.getPropertyValue('--slider-progress')).toBe('100%');
      });
    });
  });
});
