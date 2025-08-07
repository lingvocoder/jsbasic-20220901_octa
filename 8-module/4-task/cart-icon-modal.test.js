import CartIcon from './cart-icon.js';
import Cart from '../3-task/cart.js';
import {createElement} from '../../assets/lib/create-element.js';
import {vi} from "vitest";

// Мокаем Modal компонент
vi.mock('../../7-module/2-task/modal.js', () => {
  return {
    default: vi.fn(() => ({
      elem: document.createElement('div'),
      open: vi.fn(),
      close: vi.fn(),
      setTitle: vi.fn(),
      setBody: vi.fn()
    }))
  }
})

describe('CartIcon — интеграция с модальным окном', () => {
  let cart;
  let cartIcon;
  let mockModal;
  let cartIconContainer;
  let sampleProduct;

  beforeEach(() => {
    vi.clearAllMocks();

    cartIconContainer = createElement(`
      <div class="container">
        <div class="cart-icon-holder"></div>
      </div>
    `);
    document.body.append(cartIconContainer);

    cart = new Cart();
    cartIcon = new CartIcon(cart);

    // Создаем spy-функции для мокового Modal после создания cartIcon
    mockModal = cartIcon.modal;
    vi.spyOn(mockModal, 'open');
    vi.spyOn(mockModal, 'close');
    vi.spyOn(mockModal, 'setTitle');
    vi.spyOn(mockModal, 'setBody');

    sampleProduct = {
      name: "Test Product",
      price: 15.5,
      category: "test",
      image: "test.png",
      id: "test-product"
    };

    const iconHolder = document.querySelector('.cart-icon-holder');
    iconHolder.append(cartIcon.elem);
  });

  afterEach(() => {
    cartIconContainer.remove();
    vi.restoreAllMocks();
  });

  describe('Инициализация и клики', () => {

    it('Создает экземпляр класса Modal и настраивает обработчик нажатия', () => {
      expect(cartIcon.modal).toBeDefined();
      expect(typeof cartIcon.modal.open).toBe('function');
      expect(typeof cartIcon.modal.close).toBe('function');
    });

    it('Открывает модальное окно при клике на непустую корзину', () => {
      cart.addProduct(sampleProduct);
      cartIcon.elem.click();

      expect(mockModal.open).toHaveBeenCalled();
    });

    it('Не открывает модальное окно при клике на пустую корзину', () => {
      cartIcon.elem.click();

      expect(mockModal.open).not.toHaveBeenCalled();
    });
  });

  describe('Рендеринг модального окна', () => {

    it('Устанавливает заголовок и рендерит товары в модальном окне', () => {
      cart.addProduct(sampleProduct);
      cart.addProduct(sampleProduct); // count: 2

      cartIcon.renderModal();

      expect(mockModal.setTitle).toHaveBeenCalledWith('Your order');
      expect(mockModal.setBody).toHaveBeenCalledWith(cartIcon.modalBody);

      const productElements = cartIcon.modalBody.querySelectorAll('.cart-product');
      expect(productElements).toHaveLength(1);

      const countElement = cartIcon.modalBody.querySelector('.cart-counter__count');
      const priceElement = cartIcon.modalBody.querySelector('.cart-product__price');

      expect(countElement.textContent).toBe('2');
      expect(priceElement.textContent).toBe('€31.00');
    });

    it('Экранирует HTML в названиях товаров', () => {
      const dangerousProduct = {
        ...sampleProduct,
        name: 'Product <script>alert("xss")</script>',
        id: 'dangerous-product'
      };

      cart.addProduct(dangerousProduct);
      cartIcon.renderModal();

      const titleElement = cartIcon.modalBody.querySelector('.cart-product__title');
      expect(titleElement.innerHTML).not.toContain('<script>');
      expect(titleElement.textContent).toContain('<script>alert("xss")</script>');
    });
  });

  describe('Интерактивность в модальном окне', () => {

    beforeEach(() => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();
      cartIcon.addModalEventListeners();
    });

    it('Обрабатывает нажатия по кнопкам +/-', () => {
      const updateSpy = vi.spyOn(cart, 'updateProductCount');

      const plusButton = cartIcon.modalBody.querySelector('.cart-counter__button_plus');
      const minusButton = cartIcon.modalBody.querySelector('.cart-counter__button_minus');

      plusButton.click();
      expect(updateSpy).toHaveBeenCalledWith('test-product', 1);

      minusButton.click();
      expect(updateSpy).toHaveBeenCalledWith('test-product', -1);

      updateSpy.mockRestore();
    });

    it('Игнорирует нажатия не по кнопкам', () => {
      const updateSpy = vi.spyOn(cart, 'updateProductCount');

      const productTitle = cartIcon.modalBody.querySelector('.cart-product__title');
      productTitle.click();

      expect(updateSpy).not.toHaveBeenCalled();

      updateSpy.mockRestore();
    });
  });

  describe('Обновление модального окна', () => {

    it('Закрывает модальное окно, когда корзина пуста', () => {
      const cartData = {
        isEmpty: true,
        totalCount: 0,
        totalPrice: 0,
        items: []
      };

      cartIcon.updateModal(cartData);

      expect(mockModal.close).toHaveBeenCalled();
    });

    it('Обновляет количество и цену товаров', () => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();

      const cartData = {
        isEmpty: false,
        totalCount: 3,
        totalPrice: 46.5,
        items: [{ product: sampleProduct, count: 3 }]
      };

      cartIcon.updateModal(cartData);

      const countElement = cartIcon.modalBody.querySelector('.cart-counter__count');
      const priceElement = cartIcon.modalBody.querySelector('.cart-product__price');

      expect(countElement.textContent).toBe('3');
      expect(priceElement.textContent).toBe('€46.50');
    });

    it('Удаляет товары, которых больше нет в корзине', () => {
      const product2 = { ...sampleProduct, id: 'product-2' };

      cart.addProduct(sampleProduct);
      cart.addProduct(product2);
      cartIcon.renderModal();

      expect(cartIcon.modalBody.querySelectorAll('.cart-product')).toHaveLength(2);

      const cartData = {
        isEmpty: false,
        totalCount: 1,
        totalPrice: 15.5,
        items: [
          { product:
            sampleProduct,
            count: 1
          }
          ]
      };

      cartIcon.updateModal(cartData);

      expect(cartIcon.modalBody.querySelectorAll('.cart-product')).toHaveLength(1);
      expect(cartIcon.modalBody.querySelector('[data-product-id="product-2"]')).toBeNull();
    });
  });

  describe('Полный жизненный цикл', () => {

    it('Полный сценарий взаимодействия с модальным окном', () => {
      // Добавляем товары
      cart.addProduct(sampleProduct);

      // Открываем модальное окно
      cartIcon.elem.click();

      expect(mockModal.setTitle).toHaveBeenCalledWith('Your order');
      expect(mockModal.open).toHaveBeenCalled();

      // Увеличиваем количество через модальное окно
      const plusButton = cartIcon.modalBody.querySelector('.cart-counter__button_plus');
      const updateSpy = vi.spyOn(cart, 'updateProductCount');

      plusButton.click();

      expect(updateSpy).toHaveBeenCalledWith('test-product', 1);

      updateSpy.mockRestore();
    });

    it('Модальное окно автоматически закрывается при удалении всех товаров', () => {
      cart.addProduct(sampleProduct);
      cartIcon.renderModal();
      cartIcon.addModalEventListeners();

      // Удаляем товар, корзина становится пустой
      cart.updateProductCount(sampleProduct.id, -1);

      expect(mockModal.close).toHaveBeenCalled();
    });

    it('Корректно обрабатывает быстрые изменения данных о заказе в корзине', () => {
      const product2 = { ...sampleProduct, id: 'product-2', price: 20 };

      cart.addProduct(sampleProduct);
      cart.addProduct(product2);
      cartIcon.renderModal();
      cartIcon.addModalEventListeners();

      const updateModalSpy = vi.spyOn(cartIcon, 'updateModal');

      // Быстрые изменения
      cart.updateProductCount(sampleProduct.id, 1);
      cart.updateProductCount(product2.id, -1);

      expect(updateModalSpy).toHaveBeenCalledTimes(2);

      updateModalSpy.mockRestore();
    });
  });
});
