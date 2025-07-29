import {createElement} from "../../assets/lib/create-element.js";
import StepSlider from "./slider_drag.js";

describe('Класс, описывающий компонент "Пошаговый слайдер"', () => {
  const SLIDER_LEFT = 100;
  const SLIDER_WIDTH = 330;
  let config;
  let stepSlider;
  let sliderContainer;

  beforeEach(() => {
    //Создание конфигурации слайдера
    config = {
      steps: 3,
      value: 0,
    };

    sliderContainer = createElement(`
      <div class="container" id="holder" style="padding: 50px;"></div>
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
      let firstStep = stepSlider.elem.querySelector('.slider__steps span');
      expect(firstStep.classList.contains('slider__step-active')).toBe(true);
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
        writable: true,
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
        clientX: SLIDER_LEFT,
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
        bubbles: true,
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

  describe('Обработка событий pointerdown, pointermove, pointerup, генерируемых при Drag-and-Drop', () => {
    let thumb;
    let progress;
    let slider;

    // Полифилл для PointerEvent
    if (!global.PointerEvent) {
      global.PointerEvent = class PointerEvent extends Event {
        constructor(type, options = {}) {
          super(type, options);
          this.pointerId = options.pointerId || 1;
          this.pointerType = options.pointerType || 'mouse';
          this.clientX = options.clientX || 0;
          this.clientY = options.clientY || 0;
          this.width = options.width || 1;
          this.height = options.height || 1;
          this.preventDefault = () => {};
        }
      };
    }

    beforeEach(() => {
      slider = stepSlider.elem;
      thumb = stepSlider.elem.querySelector('.slider__thumb');
      progress = stepSlider.elem.querySelector('.slider__progress');
      mockSliderDimensions(slider, SLIDER_WIDTH);
    });

    function mockSliderDimensions(slider, SLIDER_WIDTH) {
      Object.defineProperty(slider, 'offsetWidth', {
        value: SLIDER_WIDTH,
        configurable: true,
        writable: true,
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

    it('Добавляет обработчик события pointerdown при инициализации экземпляра класса StepSlider', () => {
      // Создаем новый слайдер для проверки инициализации
      const addEventListenerSpy = jest.spyOn(HTMLElement.prototype, 'addEventListener');
      const newSlider = new StepSlider(config);

      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('По завершении перетаскивания происходит корректная замена текущего значения detail в пользовательском событии slider-change', (done) => {
      const eventSpy = jest.fn((event) => {
        try {
          expect(event.type).toBe('slider-change');
          expect(event.detail).toBe(stepSlider.steps - 1); // Значение должно быть 2 для правого края 3-х шагового слайдера
          done();
        } catch (error) {
          done(error);
        }
      });

      slider.addEventListener('slider-change', eventSpy);

      // Симулируем полную последовательность: pointerdown -> pointermove -> pointerup
      const pointerDownEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        clientX: SLIDER_LEFT + 100,
        clientY: 20,
        bubbles: true
      });

      slider.dispatchEvent(pointerDownEvent);

      const pointerMoveEvent = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: SLIDER_LEFT + SLIDER_WIDTH, // 100% = step 2
        clientY: 20,
        bubbles: true
      });

      document.dispatchEvent(pointerMoveEvent);

      const pointerUpEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: SLIDER_LEFT + SLIDER_WIDTH,
        clientY: 20,
        bubbles: true
      });

      document.dispatchEvent(pointerUpEvent);

    });

    it('При перетаскивании ползунка происходит корректный расчёт текущего значения шага для разных позиций', () => {
      // Тестируем расчет позиции для разных координат
      const testCases = [
        {clientX: SLIDER_LEFT, expectedValue: 0, description: 'Левый край'},
        {clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2), expectedValue: 1, description: 'Середина'},
        {clientX: SLIDER_LEFT + SLIDER_WIDTH, expectedValue: 2, description: 'Правый край'},
        {clientX: SLIDER_LEFT - 50, expectedValue: 0, description: 'За левым краем'},
        {clientX: SLIDER_LEFT + SLIDER_WIDTH + 50, expectedValue: 2, description: 'За правым краем'},
      ];

      testCases.forEach(({clientX, expectedValue, description}) => {
        const currX = {clientX};
        const result = stepSlider.calculateDragLeftOffset(currX);

        expect(result.value).toBe(expectedValue);
      });
    });

    it('При перетаскивании корневому элементу добавляется класс slider_dragging', () => {
      const pointerDownEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        clientX: SLIDER_LEFT + 100,
        clientY: 20,
        bubbles: true
      });

      slider.dispatchEvent(pointerDownEvent);

      const pointerMoveEvent = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: SLIDER_LEFT + 150,
        clientY: 20,
        bubbles: true
      });

      document.dispatchEvent(pointerMoveEvent);

      expect(slider.classList.contains('slider_dragging')).toBe(true);

      const pointerUpEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: SLIDER_LEFT + 150,
        clientY: 20,
        bubbles: true
      });

      document.dispatchEvent(pointerUpEvent);

      expect(slider.classList.contains('slider_dragging')).toBe(false);
    });

    it('Корректно обновляет значение выбранного шага в элементе с классом slider__value при перетаскивании', () => {
      const valueOutput = slider.querySelector('.slider__value');

      const pointerDownEvent = new PointerEvent('pointerdown', {
        pointerId: 1,
        clientX: SLIDER_LEFT,
        clientY: 20,
        bubbles: true
      });

      slider.dispatchEvent(pointerDownEvent);

      const pointerMoveEvent = new PointerEvent('pointermove', {
        pointerId: 1,
        clientX: SLIDER_LEFT + SLIDER_WIDTH / 2,
        clientY: 20,
        bubbles: true
      });

      document.dispatchEvent(pointerMoveEvent);

      expect(valueOutput.textContent).toBe('1');
      expect(stepSlider.value).toBe(1);

      const pointerUpEvent = new PointerEvent('pointerup', {
        pointerId: 1,
        clientX: SLIDER_LEFT + SLIDER_WIDTH / 2,
        clientY: 20,
        bubbles: true
      });

      document.dispatchEvent(pointerUpEvent);
    });
  });

})



// it('должен обработать событие pointerdown и добавить обработчики на document', () => {
//   const documentAddEventListenerSpy = jest.spyOn(document, 'addEventListener');
//
//   // Симулируем событие pointerdown
//   const pointerDownEvent = new PointerEvent('pointerdown', {
//     pointerId: 1,
//     clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2),
//     clientY: 20,
//     bubbles: true
//   });
//
//   slider.dispatchEvent(pointerDownEvent);
//
//   // Проверяем, что добавились обработчики на document
//   expect(documentAddEventListenerSpy).toHaveBeenCalledWith('pointermove', stepSlider.onPointerMove);
//   expect(documentAddEventListenerSpy).toHaveBeenCalledWith('pointerup', stepSlider.onPointerUp, {once: true});
// });

// it('должен обработать событие pointermove и обновить позицию слайдера', () => {
//   // Сначала запускаем pointerdown
//   const pointerDownEvent = new PointerEvent('pointerdown', {
//     pointerId: 1,
//     clientX: SLIDER_LEFT + 100,
//     clientY: 20,
//     bubbles: true
//   });
//   slider.dispatchEvent(pointerDownEvent);
//
//   // Затем pointermove
//   const pointerMoveEvent = new PointerEvent('pointermove', {
//     pointerId: 1,
//     clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2), // 50% от ширины
//     clientY: 20,
//     bubbles: true
//   });
//
//   const preventDefaultSpy = jest.spyOn(pointerMoveEvent, 'preventDefault');
//
//   // Симулируем событие pointermove
//   document.dispatchEvent(pointerMoveEvent);
//
//   // Проверяем, что preventDefault был вызван
//   expect(preventDefaultSpy).toHaveBeenCalled();
//
//   // Проверяем, что добавился класс dragging
//   expect(slider.classList.contains('slider_dragging')).toBe(true);
//
//   // Проверяем, что значение слайдера обновилось
//   expect(stepSlider.value).toBe(1);
//   expect(thumb.style.left).toBe('50%');
//   expect(progress.style.width).toBe('50%');
// });

// it('должен обработать событие pointerup и очистить обработчики', () => {
//   const documentRemoveEventListenerSpy = jest.spyOn(document, 'removeEventListener');
//
//   // Сначала pointerdown
//   const pointerDownEvent = new PointerEvent('pointerdown', {
//     pointerId: 1,
//     clientX: SLIDER_LEFT + 100,
//     clientY: 20,
//     bubbles: true
//   });
//   slider.dispatchEvent(pointerDownEvent);
//
//   // Затем pointermove для добавления класса dragging
//   const pointerMoveEvent = new PointerEvent('pointermove', {
//     pointerId: 1,
//     clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2),
//     clientY: 20,
//     bubbles: true
//   });
//   document.dispatchEvent(pointerMoveEvent);
//
//   expect(slider.classList.contains('slider_dragging')).toBe(true);
//
//   // Затем pointerup
//   const pointerUpEvent = new PointerEvent('pointerup', {
//     pointerId: 1,
//     clientX: SLIDER_LEFT + (SLIDER_WIDTH / 2),
//     clientY: 20,
//     bubbles: true
//   });
//
//   const preventDefaultSpy = jest.spyOn(pointerUpEvent, 'preventDefault');
//
//   document.dispatchEvent(pointerUpEvent);
//
//   // Проверяем, что preventDefault был вызван
//   expect(preventDefaultSpy).toHaveBeenCalled();
//
//   // Проверяем, что класс dragging удалился
//   expect(slider.classList.contains('slider_dragging')).toBe(false);
//
//   // Проверяем, что обработчик pointermove удалился
//   expect(documentRemoveEventListenerSpy).toHaveBeenCalledWith('pointermove', stepSlider.onPointerMove);
// });


