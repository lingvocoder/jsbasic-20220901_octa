//Добавьте этот диагностический тест, если возникает проблема с тестированием компонента "Слайдер"
describe('Диагностика проблемы с Infinity', () => {
  let slider;
  const SLIDER_WIDTH = 330;
  const SLIDER_LEFT = 100;

  beforeEach(() => {
    slider = stepSlider.elem;

    // Мокаем размеры слайдера
    Object.defineProperty(slider, 'offsetWidth', {
      value: SLIDER_WIDTH,
      configurable: true
    });

    jest.spyOn(slider, 'getBoundingClientRect').mockReturnValue({
      left: SLIDER_LEFT,
      right: SLIDER_LEFT + SLIDER_WIDTH,
      width: SLIDER_WIDTH,
      top: 0,
      bottom: 8,
      height: 8
    });
  });

  it('Диагностика значений перед кликом', () => {
    console.log('=== ДИАГНОСТИКА ===');
    console.log('slider.offsetWidth:', slider.offsetWidth);
    console.log('slider.getBoundingClientRect():', slider.getBoundingClientRect());
    console.log('stepSlider.steps:', stepSlider.steps);
    console.log('stepSlider.value:', stepSlider.value);

    // Проверяем, что моки работают
    expect(slider.offsetWidth).toBe(SLIDER_WIDTH);
    expect(slider.getBoundingClientRect().left).toBe(SLIDER_LEFT);
  });

  it('Диагностика клика с подробным логированием', async () => {
    const originalCalculateLeftOffset = stepSlider.calculateLeftOffset;

    // Перехватываем вызов calculateLeftOffset для диагностики
    stepSlider.calculateLeftOffset = function (ev) {
      console.log('=== calculateLeftOffset ===');
      console.log('ev.clientX:', ev.clientX);
      console.log('this.elem.getBoundingClientRect().left:', this.elem.getBoundingClientRect().left);
      console.log('this.elem.offsetWidth:', this.elem.offsetWidth);

      const left = ev.clientX - this.elem.getBoundingClientRect().left;
      const leftRelative = left / this.elem.offsetWidth;

      console.log('calculated left:', left);
      console.log('calculated leftRelative:', leftRelative);
      console.log('this.steps:', this.steps);

      const result = originalCalculateLeftOffset.call(this, ev);
      console.log('result:', result);

      return result;
    };

    const eventPromise = new Promise((resolve) => {
      slider.addEventListener('slider-change', (event) => {
        console.log('Event detail:', event.detail);
        resolve(event.detail);
      }, {once: true});
    });

    const clientX = SLIDER_LEFT; // Клик по левому краю
    console.log('Dispatching click with clientX:', clientX);

    slider.dispatchEvent(new MouseEvent('click', {
      clientX: clientX,
      bubbles: true
    }));

    const detail = await eventPromise;
    console.log('Final detail:', detail);

    expect(detail).toBe(0);
  });
});

describe('Безопасная диагностика компонента', () => {
  it('Показываем всю информацию без падения теста', () => {
    console.log('=== НАЧАЛО ДИАГНОСТИКИ ===');

    try {
      console.log('1. Экземпляр класса StepSlider создан', !!stepSlider);
      console.log('2. Корневой DOM-элемент добавлен в свойство elem', !!stepSlider?.elem);

      if (stepSlider && stepSlider.elem) {
        console.log('3. HTML структура слайдера');
        console.log(stepSlider.elem.outerHTML);

        console.log('4. Поиск элементов:');
        const slider = stepSlider.elem;
        const thumb = stepSlider.elem.querySelector('.slider__thumb');
        const progress = stepSlider.elem.querySelector('.slider__progress');

        console.log('   - Ползунок слайдера найден:', thumb ? 'ДА' : 'НЕТ');
        console.log('   - progress bar слайдера найден:',  progress ? 'ДА' : 'НЕТ');
        console.log('   - Корневой элемент с классом .slider найден:',  slider ? 'ДА' : 'НЕТ');

        if (thumb) console.log('   - HTML ползунка слайдера:', thumb.outerHTML);
        if (progress) console.log('   - HTML progress bar слайдера:', progress.outerHTML);
        if (slider) console.log('   - HTML корневого элемента с классом .slider:', slider.outerHTML);

        console.log('5. Все классы в документе:');
        console.log('   - .slider__thumb:', document.querySelectorAll('.slider__thumb').length, 'элементов');
        console.log('   - .slider__progress:', document.querySelectorAll('.slider__progress').length, 'элементов');
        console.log('   - .slider:', document.querySelectorAll('.slider').length, 'элементов');
      } else {
        console.log('❌ Экземпляр класса stepSlider не создан DOM-элемент слайдера не сохранен в свойстве elem!');
      }
    } catch (error) {
      console.log('❌ Ошибка в диагностике:', error.message);
    }

    console.log('=== КОНЕЦ ДИАГНОСТИКИ ===');

    // Этот тест всегда проходит, чтобы мы могли увидеть вывод
    expect(true).toBe(true);
  });
});
//
