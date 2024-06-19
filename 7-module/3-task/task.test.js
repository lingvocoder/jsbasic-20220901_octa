const createElement = require('../../assets/lib/create-element.js');
const StepSlider = require('./index.js');

describe('Класс, описывающий компонент "Пошаговый слайдер"', () => {
  let stepSlider;
  let styleElement;
  let mainElements;

  let config;

  beforeEach(() => {
    config = {
      steps: 3,
      value: 0,
    };

    styleElement = createElement(`
      <style>
        .container {
          max-width: 988px;
          margin: 0 auto;
        }

        .slider {
          position: relative;
          background-color: var(--color-black-dark);
          margin: 0 16px;
          width: 330px;
          height: 8px;
          border-radius: 3px;
          cursor: pointer;
        }

        .slider__progress {
          height: 8px;
          border-radius: 3px;
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          z-index: 1;
          background: linear-gradient(90deg, #f3e273 0%, #dd6428 52%, #d31c34 100%);
          transform: translate(0, -50%);
        }

        .slider_dragging .slider__thumb {
          cursor: grabbing;
        }

        .slider__thumb {
          background-color: var(--color-white);
          border-radius: 3px;
          width: 20px;
          height: 20px;
          position: absolute;
          z-index: 2;
          top: 50%;
          left: 0;
          margin-left: -10px;
          transform: translate(0, -50%);
          cursor: grab;
        }

        .slider__value {
          color: var(--color-body);
          font-size: 12px;
          font-weight: 700;
          font-family: var(--font-primary);
          position: absolute;
          left: 0;
          top: calc(100% + 6px);
          text-align: center;
          width: 100%;
          pointer-events: none;
          cursor: default;
        }

        .slider__steps {
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
          position: absolute;
          top: calc(100% - 2px);
          left: 0;
          right: 0;
        }

        .slider__steps > span {
          background-color: var(--color-black-dark);
          display: inline-flex;
          width: 2px;
          height: 9px;
          margin-left: -1px;
          transition: 0.2s height;
        }

        .slider__steps > span:first-child,
        .slider__steps > span:last-child {
          margin-left: 0;
        }

        .slider__steps > .slider__step-active {
          background-color: var(--color-black-light);
          height: 14px;
        }

      </style>
    `);

    mainElements = createElement(`
      <div class="container" id="holder" style="padding: 50px;">
      </div>
    `);

    document.body.append(styleElement);
    document.body.append(mainElements);

    stepSlider = new StepSlider(config);

    let holder = document.querySelector('#holder');
    holder.append(stepSlider.elem);
  });

  afterEach(() => {
    mainElements.remove();
    styleElement.remove();
  });

  describe('Отрисовка вёрстки после создания экземпляра класса', () => {
    it('Отрисовывает слайдер с количеством шагов, указанным в конфигурации в момент создания', () => {
      let steps = stepSlider.elem.querySelectorAll('.slider__steps span');

      expect(steps.length).toBe(3);
    });

    it('Первый шаг активен и имеет соответсвующий класс', () => {
      let step1 = stepSlider.elem.querySelector('.slider__steps span');

      expect(step1.classList.contains('slider__step-active')).toBe(true);
    });
  });

  describe('При клике происходит изменение значения на значение, указанное в атрибуте активного шага', () => {
    let thumb;
    let progress;
    let clickEvent;
    let pointerMoveClientX;

    beforeEach(() => {
      thumb = stepSlider.elem.querySelector('.slider__thumb');
      progress = stepSlider.elem.querySelector('.slider__progress');

      let sliderRectLeft = stepSlider.elem.getBoundingClientRect().left;
      pointerMoveClientX = sliderRectLeft + 99;

      clickEvent = new MouseEvent('click', {clientX: pointerMoveClientX, bubbles: true});
    });

    it('При клике перемещает ползунок', () => {
      stepSlider.elem.dispatchEvent(clickEvent);

      expect(thumb.style.left).toBe('50%');
    });

    it('При клике задаёт ширину закрашиваемой области до ползунка', () => {
      stepSlider.elem.dispatchEvent(clickEvent);

      expect(progress.style.width).toBe('50%');
    });

    it('После клика создаётся событие изменения значения', (done) => {
      stepSlider.elem.addEventListener('slider-change', (event) => {
        expect(event.detail).toBe(1);

        done();
      });

      stepSlider.elem.dispatchEvent(clickEvent);
    });

  });

});
