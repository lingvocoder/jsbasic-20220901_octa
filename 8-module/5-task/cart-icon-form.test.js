import {describe, it, expect, vi, beforeEach, afterEach} from 'vitest';
import CartIcon from './cart-icon.js';
import Cart from '../3-task/cart.js';
import {createElement} from '../../assets/lib/create-element.js';

// Эмуляция модального окна
vi.mock('../../7-module/2-task/modal.js', () => ({
  default: vi.fn(() => ({
    elem: document.createElement('div'),
    open: vi.fn(),
    close: vi.fn(),
    setTitle: vi.fn(),
    setBody: vi.fn()
  }))
}));

// Эмуляция fetch и alert
global.fetch = vi.fn();
global.alert = vi.fn();

describe('CartIcon — интеграция с формой заказа', () => {
  let cartIcon, cart, container, sampleProduct;

  beforeEach(() => {
    // Очистка всех моков
    vi.clearAllMocks();

    container = createElement(`
      <div class="container">
        <div class="cart-icon-holder"></div>
      </div>
    `);
    document.body.append(container);

    // Создание экземпляров корзины и иконки корзины
    cart = new Cart();
    cartIcon = new CartIcon(cart);

    sampleProduct = {
      name: "Test Product",
      price: 15.5,
      category: "test",
      image: "test.png",
      id: "test-product"
    };

    document.querySelector('.cart-icon-holder').append(cartIcon.elem);
  });

  afterEach(() => {
    container.remove();
  });

  describe('Основная функциональность', () => {

    test('Создает модальное окно и настраивает обработчики', () => {
      expect(cartIcon.elem).toBeTruthy();
      expect(cartIcon.modal).toBeTruthy();
      expect(typeof cartIcon.modal.open).toBe('function');
    });

    test('Открывает модальное окно при нажатии на непустую корзину', () => {
      cart.addProduct(sampleProduct);

      cartIcon.elem.click();

      expect(cartIcon.modal.open).toHaveBeenCalled();
    });

    test('Не открывает модальное окно для пустой корзины', () => {
      cartIcon.elem.click();

      expect(cartIcon.modal.open).not.toHaveBeenCalled();
    });
  });

  describe('Отрисовка формы заказа', () => {

    beforeEach(() => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();
    });

    test('Добавляет форму заказа в модальное окно', () => {
      const form = cartIcon.modalBody.querySelector('.cart-form');

      expect(form).toBeTruthy();
      expect(form.tagName).toBe('FORM');

      const submitButton = form.querySelector('button[type="submit"]');
      expect(submitButton).toBeTruthy();
    });

    test('Форма содержит все необходимые поля', () => {
      const form = cartIcon.modalBody.querySelector('.cart-form');

      const fields = ['name', 'email', 'tel', 'address'];
      fields.forEach(field => {
        const input = form.querySelector(`input[name="${field}"]`);
        expect(input).toBeTruthy();
        expect(input.required).toBe(true);
      });
    });

    it('Отображает корректную общую сумму', () => {
      cart.addProduct(sampleProduct); // Итого: €31.00
      cartIcon.renderModal();

      const totalPrice = cartIcon.modalBody.querySelector('.cart-buttons__info-price');
      expect(totalPrice.textContent).toBe('€31.00');
    });

    it('Экранирует HTML в названиях товаров', () => {
      const dangerousProduct = {
        ...sampleProduct,
        name: 'Evil <script>alert("hack")</script> Product',
        id: 'dangerous'
      };

      // Очищаем корзину и добавляем опасный товар
      cart.cartItems = [];
      cart.addProduct(dangerousProduct);
      cartIcon.renderModal();

      const title = cartIcon.modalBody.querySelector('.cart-product__title');
      expect(title.innerHTML).not.toContain('<script>');
      expect(title.textContent).toContain('<script>alert("hack")</script>');
    });
  });

  describe('Отправка формы', () => {

    beforeEach(() => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();
    });

    it('Отправляет данные на сервер при submit', async () => {
      fetch.mockResolvedValue({ok: true});

      const form = cartIcon.modalBody.querySelector('.cart-form');
      const mockEvent = {preventDefault: vi.fn(), target: form};

      await cartIcon.onSubmit(mockEvent);

      expect(fetch).toHaveBeenCalledWith(
        'https://httpbin.org/post',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData)
        })
      );
      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('Показывает состояние загрузки при отправке запроса на сервер', async () => {
      let resolvePromise;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });
      fetch.mockReturnValue(promise);

      const form = cartIcon.modalBody.querySelector('.cart-form');
      const submitButton = form.querySelector('button[type="submit"]');
      const mockEvent = {preventDefault: vi.fn(), target: form};

      // Инициируем отправку на сервер
      const submitPromise = cartIcon.onSubmit(mockEvent);

      // Проверяем состояние загрузки
      await vi.waitFor(() => {
        expect(submitButton.disabled).toBe(true);
        expect(submitButton.classList.contains('is-loading')).toBe(true);
      });

      // Завершаем загрузку
      resolvePromise({ok: true});
      await submitPromise;

      // Проверяем сброс состояния
      expect(submitButton.disabled).toBe(false);
      expect(submitButton.classList.contains('is-loading')).toBe(false);
    });

    it('Обрабатывает ошибки при неудачном запросе', async () => {
      fetch.mockRejectedValue(new Error('Network failed'));

      const form = cartIcon.modalBody.querySelector('.cart-form');
      const mockEvent = {preventDefault: vi.fn(), target: form};

      await cartIcon.onSubmit(mockEvent);

      expect(alert).toHaveBeenCalledWith('Error: Network failed');
    });
  });

  describe('Успешный заказ', () => {

    beforeEach(() => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();
    });

    it('Показывает экран при успешном запросе и очищает корзину', () => {
      expect(cart.cartItems).toHaveLength(1);

      cartIcon.showSuccess();

      expect(cartIcon.modal.setTitle).toHaveBeenCalledWith('Success!');
      expect(cart.cartItems).toHaveLength(0);
      expect(cartIcon.isShowingSuccess).toBe(true);
    });

    it('Не закрывает модальное окно при успешно выполненном запросе и показе сообщения', () => {
      cartIcon.isShowingSuccess = true;

      const emptyCartData = {
        isEmpty: true,
        totalCount: 0,
        totalPrice: 0,
        items: []
      };

      cartIcon.updateModal(emptyCartData);

      expect(cartIcon.modal.close).not.toHaveBeenCalled();
    });

    it('Сбрасывает флаг isShowingSuccess через timeout', async () => {
      cartIcon.showSuccess();
      expect(cartIcon.isShowingSuccess).toBe(true);

      // Ждем больше чем timeout в коде (100ms)
      await vi.waitFor(() => {
        expect(cartIcon.isShowingSuccess).toBe(false);
      }, {timeout: 200});
    });
    test('Генерирует событие изменения состояния корзины при очистке', () => {
      const updateSpy = vi.spyOn(cart, 'onProductUpdate');
      updateSpy.mockClear();

      cartIcon.showSuccess();

      expect(updateSpy).toHaveBeenCalled();
    });
  });

  describe('Интерактивность в модальном окне', () => {

    beforeEach(() => {
      cart.addProduct(sampleProduct);
      cart.addProduct({...sampleProduct, id: 'product-2', name: 'Product 2'});
      cartIcon.renderModal();
      cartIcon.addModalEventListeners();
    });

    it('Увеличивает количество товара по клику на +', () => {
      const plusButton = cartIcon.modalBody.querySelector('.cart-counter__button_plus');

      plusButton.click();

      const item = cart.cartItems.find(item => item.product.id === sampleProduct.id);
      expect(item.count).toBe(2);
    });

    it('Уменьшает количество товара по клику на -', () => {
      // Сначала увеличим количество
      cart.updateProductCount(sampleProduct.id, 1);
      cartIcon.renderModal();
      cartIcon.addModalEventListeners();

      const minusButton = cartIcon.modalBody.querySelector('.cart-counter__button_minus');

      minusButton.click();

      const item = cart.cartItems.find(item => item.product.id === sampleProduct.id);
      expect(item.count).toBe(1);
    });
  });

  describe('Обновление модального окна', () => {
    beforeEach(() => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();
    });
    test('Обновляет общую сумму при изменении состояния заказа в корзине', () => {
      const totalPriceElement = cartIcon.modalBody.querySelector('.cart-buttons__info-price');
      expect(totalPriceElement.textContent).toBe('€15.50');

      const updatedCartData = {
        isEmpty: false,
        totalCount: 3,
        totalPrice: 46.5,
        items: [{product: sampleProduct, count: 3}]
      };

      cartIcon.updateModal(updatedCartData);

      expect(totalPriceElement.textContent).toBe('€46.50');
    });

    test('Закрывает модальное окно при пустой корзине (обычный случай)', () => {
      const emptyCartData = {
        isEmpty: true,
        totalCount: 0,
        totalPrice: 0,
        items: []
      };

      cartIcon.updateModal(emptyCartData);

      expect(cartIcon.modal.close).toHaveBeenCalled();
    });
  });

  describe('Полный E2E сценарий', () => {

    it('Полный жизненный цикл заказа', async () => {
      fetch.mockResolvedValue({ok: true});

      // 1. Добавляем товар
      cart.addProduct(sampleProduct);
      expect(cart.getTotalCount()).toBe(1);

      // 2. Кликаем на иконку — открывается модальное окно
      cartIcon.elem.click();
      expect(cartIcon.modal.open).toHaveBeenCalled();

      // 3. Проверяем что форма отрисована
      const form = cartIcon.modalBody.querySelector('.cart-form');
      expect(form).toBeTruthy();

      const totalPrice = cartIcon.modalBody.querySelector('.cart-buttons__info-price');
      expect(totalPrice.textContent).toBe('€15.50');

      // 4. Заполняем и отправляем форму
      const nameInput = form.querySelector('input[name="name"]');
      nameInput.value = 'John Doe';

      const mockEvent = {preventDefault: vi.fn(), target: form};
      await cartIcon.onSubmit(mockEvent);

      // 5. Проверяем что запрос отправился
      expect(fetch).toHaveBeenCalledWith(
        'https://httpbin.org/post',
        expect.objectContaining({method: 'POST'})
      );

      // 6. Проверяем состояние после успешно выполненного заказа
      expect(cart.cartItems).toHaveLength(0);
      expect(cartIcon.modal.setTitle).toHaveBeenCalledWith('Success!')

      // 7. Проверяем, что модальное окно не закрыто по завершении заказа
      const emptyCartData = {
        isEmpty: true,
        totalCount: 0,
        totalPrice: 0,
        items: []
      }
      cartIcon.updateModal(emptyCartData)
      expect(cartIcon.modal.close).not.toHaveBeenCalled()
    });
  });
});
