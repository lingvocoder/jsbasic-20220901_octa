import CartIcon from './cart-icon.js';
import {createElement} from '../../assets/lib/create-element.js';

describe('Класс, описывающий компонент "Иконка корзины"', () => {
  let cartIcon;
  let cartIconContainer;

  beforeEach(() => {

    cartIconContainer = createElement(`

    <div style="width: 1000px; height: 2000px; margin: 0 auto;">
      <header class="header container">
        <h1 class="heading logo">Бангкок Экспресс</h1>
        <h3 class="subheading">Отличная еда・Бесплатная доставка・Лучшие цены</h3>

        <!--Добавляем DOM-элементы (контейнер для иконки корзины)-->
        <div class="cart-icon-holder">
          <!--СЮДА ВСТАВЛЯЕТСЯ корневой элемент из свойства CartIcon.elem-->
        </div>
      </header>
    </div>
    `);

    //Добавляем DOM-элементы (контейнер для иконки корзины)
    document.body.append(cartIconContainer);

    //Мокаем размеры окна
    Object.defineProperty(document.documentElement, 'clientHeight', {
      value: 800,
      writable: true,
      enumerable: true,
    });

    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 1200,
      writable: true,
      enumerable: true,
    });

    //Мокаем прокрутку
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      enumerable: true,
    });

    Object.defineProperty(document.documentElement, 'scrollTop', {
      value: 0,
      writable: true,
      enumerable: true,
    });

    // Создаём экземпляр иконки корзины
    cartIcon = new CartIcon();

    let iconHolder = document.querySelector('.cart-icon-holder');
    iconHolder.append(cartIcon.elem);
  });

  afterEach(() => {
    // Очищаем DOM после каждого теста
    cartIconContainer.remove();
    vi.restoreAllMocks();
  });

  describe('Отрисовка вёрстки компонента после создания экземпляра класса', () => {

    test('Добавляет корневой элемент в свойство elem', () => {
      expect(cartIcon.elem).not.toBeNull();
      expect(cartIcon.elem.tagName).toBe('DIV');
    });

    test('Элемент иконки добавлен в документ и имеет соответсвующий класс', () => {
      expect(cartIcon.elem.classList.contains('cart-icon')).toBe(true);
      expect(cartIcon.elem.classList.contains('cart-icon_visible')).toBe(true);
    });

    test('Элемент иконки корзины отображает корректный HTML', () => {
      let iconInner = cartIcon.elem.querySelector('.cart-icon__inner');
      let itemsCount = cartIcon.elem.querySelector('.cart-icon__count');
      let totalPrice = cartIcon.elem.querySelector('.cart-icon__price');

      expect(iconInner).not.toBeNull();
      expect(itemsCount).not.toBeNull();
      expect(totalPrice).not.toBeNull();
    });

    test('Отрисовывает иконку корзины с количеством товаров и общей стоимостью, указанными в момент создания экземпляра класса', () => {
      let itemsCount = cartIcon.elem.querySelector('.cart-icon__count');
      let totalPrice = cartIcon.elem.querySelector('.cart-icon__price');

      expect(itemsCount.textContent).toBe('0');
      expect(totalPrice.textContent).toBe('€0.00');
    });

    test('Метод render возвращает созданный экземпляр класса', () => {
      const renderedIcon = cartIcon.render();
      expect(renderedIcon).toBe(cartIcon.elem);
    });

    test('Не создаёт новый экземпляр класса, если уже существует экземпляр данного класса', () => {
      const renderedFirst = cartIcon.render();
      const renderedSecond = cartIcon.render();

      expect(renderedFirst).toBe(renderedSecond);
    });
  });

  describe('Добавляет обработчики событий scroll и resize', () => {

    test('Добавляет обработчик события scroll', () => {
      const eventSpy = vi.spyOn(document, 'addEventListener');
      const cartIcon = new CartIcon();
      expect(eventSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
      eventSpy.mockRestore();
    });

    test('Добавляет обработчик события resize', () => {
      const eventSpy = vi.spyOn(window, 'addEventListener');
      const cartIcon = new CartIcon();
      expect(eventSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      eventSpy.mockRestore();
    });
  });

  describe('Позиционирование при прокрутке', () => {
    let icon;
    let containerElement;
    let updatePositionSpy;
    const CONTAINER_LEFT = 100;
    const CONTAINER_WIDTH = 1000;
    const CONTAINER_HEIGHT = 2000;
    const CONTAINER_BOTTOM = 2000;


    beforeEach(() => {
      icon = cartIcon.elem;
      containerElement = document.querySelector('.container');
      // Мокаем размеры и позицию элементов
      vi.spyOn(icon, 'offsetWidth', 'get').mockReturnValue(57);
      vi.spyOn(icon, 'offsetHeight', 'get').mockReturnValue(63);
      vi.spyOn(icon, 'offsetTop', 'get').mockReturnValue(100);
      mockContainerDimensions(containerElement);
      updatePositionSpy = vi.spyOn(cartIcon, 'updatePosition');
    });

    function mockContainerDimensions(containerElement) {

      vi.spyOn(containerElement, 'getBoundingClientRect').mockReturnValue({
        left: CONTAINER_LEFT,
        right: CONTAINER_LEFT + CONTAINER_WIDTH,
        top: 0,
        bottom: CONTAINER_BOTTOM,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT
      });
    }

    test('Вызывает метод updatePosition при событии scroll', () => {
      // Очищаем предыдущие вызовы
      updatePositionSpy.mockClear();

      // Имитируем событие прокрутки
      const scrollEvent = new Event('scroll');
      document.dispatchEvent(scrollEvent);

      expect(updatePositionSpy).toHaveBeenCalled();
    });

    test('Правильно вычисляет свойство left для position:fixed', () => {
      Object.defineProperty(window, 'scrollY', {
        value: 150,
        configurable: true,
        writable: true,
      });

      cartIcon.updatePosition();

      // Ожидаемая позиция: Math.min(getBoundingClientRect().right + 20, documentElement.clientWidth - this.elem.offsetWidth - 10)
      // Math.min(1100 + 20, 1200 - 57 - 10) = Math.min(1120, 1133) = 1120
      expect(cartIcon.elem.style.left).toBe('1120px');
    });

    test('Устанавливает position:fixed при прокрутке ниже верхней границы элемента', () => {
      // Имитируем прокрутку ниже верхней границы корзины
      Object.defineProperty(window, 'scrollY', {
        value: 150,
        configurable: true,
        writable: true,
      });

      cartIcon.updatePosition();

      expect(cartIcon.elem.style.position).toBe('fixed');
      expect(cartIcon.elem.style.top).toBe('50px');
      expect(cartIcon.elem.style.zIndex).toBe('100');
    });

    test('Очищает стили при прокрутке выше верхней границы элемента', () => {
      // Сначала устанавливаем фиксированное позиционирование
      Object.defineProperty(window, 'scrollY', {
        value: 150,
        configurable: true,
        writable: true,
      });
      cartIcon.updatePosition();

      // Затем прокручиваем назад вверх
      Object.defineProperty(window, 'scrollY', {
        value: 50,
        configurable: true,
        writable: true,
      });
      cartIcon.updatePosition();

      expect(cartIcon.elem.style.position).toBe('');
      expect(cartIcon.elem.style.top).toBe('');
      expect(cartIcon.elem.style.left).toBe('');
      expect(cartIcon.elem.style.zIndex).toBe('');
    });

  });

  describe('Позиционирование при изменении размера окна', () => {
    let icon;
    let containerElement;
    let updatePositionSpy;
    const CONTAINER_LEFT = 100;
    const CONTAINER_WIDTH = 1000;
    const CONTAINER_HEIGHT = 2000;
    const CONTAINER_BOTTOM = 2000;

    beforeEach(() => {
      icon = cartIcon.elem;
      containerElement = document.querySelector('.container');
      // Мокаем размеры и позицию элементов
      vi.spyOn(icon, 'offsetWidth', 'get').mockReturnValue(57);
      vi.spyOn(icon, 'offsetHeight', 'get').mockReturnValue(63);
      vi.spyOn(icon, 'offsetTop', 'get').mockReturnValue(100);
      mockContainerDimensions(containerElement);
      updatePositionSpy = vi.spyOn(cartIcon, 'updatePosition');
    });

    function mockContainerDimensions(containerElement) {

      vi.spyOn(containerElement, 'getBoundingClientRect').mockReturnValue({
        left: CONTAINER_LEFT,
        right: CONTAINER_LEFT + CONTAINER_WIDTH,
        top: 0,
        bottom: CONTAINER_BOTTOM,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT
      });
    }

    test('Вызывает метод updatePosition при событии resize', () => {
      updatePositionSpy.mockClear();

      const resizeEvent = new Event('resize');
      window.dispatchEvent(resizeEvent);

      expect(updatePositionSpy).toHaveBeenCalled();
    });

    test('Удаляет position:fixed на мобильных устройствах (при ширине экрана <= 767px)', () => {
      // Устанавливаем мобильную ширину
      vi.spyOn(cartIcon, 'getClientWidth').mockReturnValue( 767);

      cartIcon.updatePosition();

      expect(cartIcon.elem.style.position).toBe('');
      expect(cartIcon.elem.style.top).toBe('');
      expect(cartIcon.elem.style.left).toBe('');
      expect(cartIcon.elem.style.zIndex).toBe('');
    });

  });

  describe('Адаптивное поведение', () => {
    let icon;
    let containerElement;
    const CONTAINER_LEFT = 50;
    const CONTAINER_RIGHT = 650;
    const CONTAINER_WIDTH = 600;
    const CONTAINER_HEIGHT = 2000;
    const CONTAINER_BOTTOM = 2000;

    beforeEach(() => {
      icon = cartIcon.elem;
      containerElement = document.querySelector('.container');
      vi.spyOn(icon, 'offsetWidth', 'get').mockReturnValue(57);
      vi.spyOn(icon, 'offsetHeight', 'get').mockReturnValue(63);
      vi.spyOn(icon, 'offsetTop', 'get').mockReturnValue(100);
      mockContainerDimensions(containerElement);
    });

    function mockContainerDimensions(containerElement) {

      vi.spyOn(containerElement, 'getBoundingClientRect').mockReturnValue({
        left: CONTAINER_LEFT,
        right: CONTAINER_RIGHT,
        top: 0,
        bottom: CONTAINER_BOTTOM,
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT
      });
    }


    test('Корректно позиционирует элемент на планшете (ширина 768px)', () => {
      vi.spyOn(cartIcon, 'getClientWidth').mockReturnValue( 768);

      Object.defineProperty(window, 'scrollY', {
        value: 150,
        configurable: true,
        writable: true,
      });

      cartIcon.updatePosition();

      expect(cartIcon.elem.style.position).toBe('fixed');
      expect(cartIcon.elem.style.top).toBe('50px');
      expect(cartIcon.elem.style.left).toBe('670px'); //Ожидаемая позиция: Math.min(650 + 20, 768 - 57 - 10) = min(670, 701) = 670
    });

    test('Устанавливает корректные отступы при позиционировании иконки корзины', () => {
      vi.spyOn(cartIcon, 'getClientWidth').mockReturnValue( 1200);

      Object.defineProperty(window, 'scrollY', {
        value: 150,
        configurable: true,
        writable: true,
      });

      cartIcon.updatePosition();

      expect(cartIcon.elem.style.position).toBe('fixed');
      expect(cartIcon.elem.style.top).toBe('50px');
      expect(cartIcon.elem.style.zIndex).toBe('100');
    });
  });

});
