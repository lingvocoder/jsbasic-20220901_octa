import createElement from "../../assets/lib/create-element.js";
import StepSlider from "./slider.js";
import {expect, it, jest} from '@jest/globals';


describe('Класс, описывающий компонент "Пошаговый слайдер"', () => {
  let stepSlider;
  let mainElements;
  const SLIDER_WIDTH = 330;
  const SLIDER_LEFT = 100;
  let config;

  beforeEach(() => {
    //Создание конфигурации слайдера
    config = {
      steps: 3,
      value: 0,
    };

    mainElements = createElement(`
      <div class="container" id="holder" style="padding: 50px;">
      </div>
    `);

    //Добавляем DOM-элементы (контейнер для слайдера)
    document.body.append(mainElements);

    // Создаём экземпляр слайдера
    stepSlider = new StepSlider(config);

    let holder = document.querySelector('#holder');
    holder.append(stepSlider.elem);
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    mainElements.remove();
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

    it('Задаёт корректное значение ширины закрашенной области', () => {
      let progress = stepSlider.elem.querySelector('.slider__progress');
      let thumb = stepSlider.elem.querySelector('.slider__thumb');

      expect(progress.style.width).toBe('0%');
      expect(thumb.style.left).toBe('0%');
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
      jest.restoreAllMocks();
    });

    function mockSliderDimensions(slider, SLIDER_WIDTH) {
      Object.defineProperty(slider, 'offsetWidth', {
        value: SLIDER_WIDTH,
        configurable: true,
        writable: true
      });

      jest.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
        left: SLIDER_LEFT,
        right: SLIDER_LEFT + SLIDER_WIDTH,
        width: SLIDER_WIDTH,
        top: 0,
        bottom: 8,
        height: 8
      });
    }

    it('При нажатии на первый разделитель слайдера устанавливает значение шага равное 0', () => {
      mockSliderDimensions(slider, SLIDER_WIDTH);

      const clickEvent = new MouseEvent('click', {
        clientX: 110,
        bubbles: true,
      });

      slider.dispatchEvent(clickEvent);

      expect(stepSlider.value).toBe(0);
      expect(thumb.style.left).toBe('0%');
      expect(progress.style.width).toBe('0%');
    });

    it('При нажатии задаёт корректное значение ширины закрашенной области', () => {
      mockSliderDimensions(slider, SLIDER_WIDTH);

      const clickEvent = new MouseEvent('click', {
        clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2),
        bubbles: true
      });

      slider.dispatchEvent(clickEvent);

      expect(stepSlider.value).toBe(1);
      expect(thumb.style.left).toBe('50%');
      expect(progress.style.width).toBe('50%');
    });

    it('При нажатии на последний разделитель слайдера устанавливает значение шага равное config.steps - 1', () => {
      mockSliderDimensions(slider, SLIDER_WIDTH);

      const clickEvent = new MouseEvent('click', {
        clientX: SLIDER_LEFT + SLIDER_WIDTH,
        bubbles: true,
      });

      slider.dispatchEvent(clickEvent);

      expect(stepSlider.value).toBe(stepSlider.steps - 1);
      expect(thumb.style.left).toBe('100%');
      expect(progress.style.width).toBe('100%');
    });

    it("При нажатии происходит корректная замена текущего значения detail в пользовательском событии для разных позиций", async () => {
      // Проверка промежуточных позиций
      const LEFT_EDGE = SLIDER_LEFT;
      const MIDDLE = SLIDER_LEFT + SLIDER_WIDTH / 2;
      const RIGHT_EDGE = SLIDER_LEFT + SLIDER_WIDTH;

      const testCases = [
        {clientX: LEFT_EDGE, expectedValue: 0, description: 'левый край'},
        {clientX: MIDDLE, expectedValue: 1, description: 'середина'},
        {clientX: RIGHT_EDGE, expectedValue: 2, description: 'правый край'}
      ];

      for (const {clientX, expectedValue} of testCases) {
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
      }
    });
  });

});
