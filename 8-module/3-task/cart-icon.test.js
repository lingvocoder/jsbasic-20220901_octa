import CartIcon from './cart-icon.js';
import Cart from './cart.js';
import {createElement} from '../../assets/lib/create-element.js';

describe('CartIcon — События и автоматическое обновление', () => {
  let cartIcon;
  let cart;
  let cartIconContainer;

  beforeEach(() => {
    // Создаем контейнер для DOM
    cartIconContainer = createElement(`
      <div style="width: 1000px; height: 2000px; margin: 0 auto;">
        <div class="container">
          <div class="cart-icon-holder"></div>
        </div>
      </div>
    `);

    document.body.append(cartIconContainer);

    // Мокаем размеры окна
    Object.defineProperty(document.documentElement, 'clientWidth', {
      value: 1200,
      writable: true,
      configurable: true,
    });

    // Создаем экземпляр корзины с поддержкой событий
    cart = new Cart();

    // Создаем иконку корзины с передачей корзины в конструктор
    cartIcon = new CartIcon(cart);

    // Добавляем иконку в DOM
    const iconHolder = document.querySelector('.cart-icon-holder');
    iconHolder.append(cartIcon.elem);
  });

  afterEach(() => {
    cartIconContainer.remove();
    vi.restoreAllMocks();
  });

  describe('Инициализация с корзиной', () => {

    it('Конструктор принимает объект корзины', () => {
      expect(cartIcon.cart).toBe(cart);
    });

    it('Подписывается на события корзины при инициализации', () => {
      const addEventListenerSpy = vi.spyOn(cart, 'addEventListener');

      // Создаем новую иконку чтобы проверить подписку
      const newCartIcon = new CartIcon(cart);

      expect(addEventListenerSpy).toHaveBeenCalledWith('cartChanged', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('Метод subscribeToCart корректно настраивает слушатель событий', () => {
      const addEventListenerSpy = vi.spyOn(cart, 'addEventListener');

      cartIcon.subscribeToCart();

      expect(addEventListenerSpy).toHaveBeenCalledWith('cartChanged', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledTimes(1);

      addEventListenerSpy.mockRestore();
    });
  });

  describe('Автоматическое обновление при изменениях корзины', () => {
    let sampleProduct;

    beforeEach(() => {
      sampleProduct = {
        name: "Test Product",
        price: 15.5,
        category: "test",
        image: "test.png",
        id: "test-product"
      };
    });

    it('Автоматически обновляется при добавлении товара в корзину', () => {
      const updateSpy = vi.spyOn(cartIcon, 'update');

      cart.addProduct(sampleProduct);

      expect(updateSpy).toHaveBeenCalledWith({
        totalCount: 1,
        totalPrice: 15.5,
        isEmpty: false,
        items: expect.any(Array)
      });

      updateSpy.mockRestore();
    });

    it('Отображает корректное количество товаров после автоматического обновления', () => {
      cart.addProduct(sampleProduct);
      cart.addProduct(sampleProduct);

      const countElem = cartIcon.elem.querySelector('.cart-icon__count');
      expect(countElem.textContent).toBe('2');
    });

    it('Отображает корректную общую стоимость после автоматического обновления', () => {
      cart.addProduct(sampleProduct);

      const priceElem = cartIcon.elem.querySelector('.cart-icon__price');
      expect(priceElem.textContent).toBe('€15.50');
    });

    it('Автоматически обновляется при удалении товара из корзины', () => {
      // Добавляем товар
      cart.addProduct(sampleProduct);

      const updateSpy = vi.spyOn(cartIcon, 'update');
      updateSpy.mockClear();

      // Удаляем товар
      cart.updateProductCount(sampleProduct.id, -1);

      expect(updateSpy).toHaveBeenCalledWith({
        totalCount: 0,
        totalPrice: 0,
        isEmpty: true,
        items: []
      });

      updateSpy.mockRestore();
    });

    it('Обновляется при изменении количества товара', () => {
      cart.addProduct(sampleProduct);

      const updateSpy = vi.spyOn(cartIcon, 'update');
      updateSpy.mockClear();

      cart.updateProductCount(sampleProduct.id, 2);

      expect(updateSpy).toHaveBeenCalledWith({
        totalCount: 3,
        totalPrice: 46.5,
        isEmpty: false,
        items: expect.any(Array)
      });

      updateSpy.mockRestore();
    });
  });

  describe('Метод update с новым API', () => {

    it('Принимает объект cartData вместо объекта cart', () => {
      const cartData = {
        totalCount: 5,
        totalPrice: 42.75,
        isEmpty: false,
        items: []
      };

      cartIcon.update(cartData);

      const countElem = cartIcon.elem.querySelector('.cart-icon__count');
      const priceElem = cartIcon.elem.querySelector('.cart-icon__price');

      expect(countElem.textContent).toBe('5');
      expect(priceElem.textContent).toBe('€42.75');
    });

    it('Корректно обрабатывает пустую корзину', () => {
      const cartData = {
        totalCount: 0,
        totalPrice: 0,
        isEmpty: true,
        items: []
      };

      cartIcon.update(cartData);

      const countElem = cartIcon.elem.querySelector('.cart-icon__count');
      const priceElem = cartIcon.elem.querySelector('.cart-icon__price');

      expect(countElem.textContent).toBe('0');
      expect(priceElem.textContent).toBe('€0.00');
    });

    it('Не добавляет анимацию shake для пустой корзины', () => {
      const cartData = {
        totalCount: 0,
        totalPrice: 0,
        isEmpty: true,
        items: []
      };

      cartIcon.update(cartData);

      expect(cartIcon.elem.classList.contains('shake')).toBe(false);
    });

    it('Добавляет анимацию shake для непустой корзины', () => {
      const cartData = {
        totalCount: 1,
        totalPrice: 10,
        isEmpty: false,
        items: [
          {
            product: { id: 'test' },
            count: 1 }
        ]
      };

      cartIcon.update(cartData);

      expect(cartIcon.elem.classList.contains('shake')).toBe(true);
    });

    it('Не добавляет анимацию shake повторно, если класс уже присутствует', () => {
      const cartData = {
        totalCount: 1,
        totalPrice: 10,
        isEmpty: false,
        items: [
          {
            product: {id: 'test' },
            count: 1 }
        ]
      };

      // Первое обновление добавляет класс shake
      cartIcon.update(cartData);
      expect(cartIcon.elem.classList.contains('shake')).toBe(true);

      // Второе обновление не должно добавить класс повторно
      const classListAddSpy = vi.spyOn(cartIcon.elem.classList, 'add');
      cartIcon.update(cartData);

      expect(classListAddSpy).not.toHaveBeenCalled();

      classListAddSpy.mockRestore();
    });

    it('Удаляет класс shake после окончания анимации', (done) => {
      const cartData = {
        totalCount: 1,
        totalPrice: 10,
        isEmpty: false,
        items: [
          {
            product: { id: 'test' },
            count: 1 }
        ]
      };

      cartIcon.update(cartData);

      expect(cartIcon.elem.classList.contains('shake')).toBe(true);

      // Имитируем событие окончания анимации
      const transitionEvent = new Event('transitionend');
      cartIcon.elem.dispatchEvent(transitionEvent);

      // Проверяем асинхронно, так как обработчик события может сработать с задержкой
      setTimeout(() => {
        expect(cartIcon.elem.classList.contains('shake')).toBe(false);
        done();
      }, 0);
    });
  });

  describe('Интеграционные тесты', () => {
    let product1, product2;

    beforeEach(() => {
      product1 = {
        name: "Product 1",
        price: 10,
        category: "test",
        image: "test1.png",
        id: "product-1"
      };

      product2 = {
        name: "Product 2",
        price: 15.75,
        category: "test",
        image: "test2.png",
        id: "product-2"
      };
    });

    it('Корректно обрабатывает полный жизненный цикл корзины', () => {
      // Изначально пустая корзина
      let countElem = cartIcon.elem.querySelector('.cart-icon__count');
      let priceElem = cartIcon.elem.querySelector('.cart-icon__price');

      expect(countElem.textContent).toBe('0');
      expect(priceElem.textContent).toBe('€0.00');

      // Добавляем первый товар
      cart.addProduct(product1);
      expect(countElem.textContent).toBe('1');
      expect(priceElem.textContent).toBe('€10.00');

      // Добавляем второй товар
      cart.addProduct(product2);
      expect(countElem.textContent).toBe('2');
      expect(priceElem.textContent).toBe('€25.75');

      // Увеличиваем количество первого товара
      cart.updateProductCount(product1.id, 1);
      expect(countElem.textContent).toBe('3');
      expect(priceElem.textContent).toBe('€35.75');

      // Удаляем все количество первого товара
      cart.updateProductCount(product1.id, -2);
      expect(countElem.textContent).toBe('1');
      expect(priceElem.textContent).toBe('€15.75');

      // Удаляем последний товар
      cart.updateProductCount(product2.id, -1);
      expect(countElem.textContent).toBe('0');
      expect(priceElem.textContent).toBe('€0.00');
    });

    it('Реагирует на множественные быстрые изменения корзины', () => {
      const updateSpy = vi.spyOn(cartIcon, 'update');

      // Быстро добавляем несколько товаров
      cart.addProduct(product1);
      cart.addProduct(product1);
      cart.addProduct(product2);
      cart.updateProductCount(product1.id, 1);

      // Проверяем что update вызывался для каждого изменения
      expect(updateSpy).toHaveBeenCalledTimes(4);

      // Проверяем финальное состояние
      const countElem = cartIcon.elem.querySelector('.cart-icon__count');
      const priceElem = cartIcon.elem.querySelector('.cart-icon__price');

      expect(countElem.textContent).toBe('4'); // 3 товара product1 + 1 товар product2
      expect(priceElem.textContent).toBe('€45.75'); // 30 + 15.75

      updateSpy.mockRestore();
    });
  });
});
