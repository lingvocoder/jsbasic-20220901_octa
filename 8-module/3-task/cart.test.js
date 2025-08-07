import Cart from './cart.js';

describe('События корзины (CartChanged)', () => {
  let cart;
  let sampleProduct;
  let eventListener;

  beforeEach(() => {
    cart = new Cart();

    sampleProduct = {
      name: "Laab kai chicken salad",
      price: 10,
      category: "salads",
      image: "laab_kai_chicken_salad.png",
      id: "laab-kai-chicken-salad"
    };

    // Мок функция для отслеживания событий
    eventListener = vi.fn();
    cart.addEventListener('cartChanged', eventListener);
  });

  afterEach(() => {
    cart.removeEventListener('cartChanged', eventListener);
  });

  describe('Метод onProductUpdate() — генерация событий', () => {

    it('Генерирует событие cartChanged при добавлении товара', () => {
      cart.addProduct(sampleProduct);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cartChanged',
          detail: {
            totalCount: 1,
            totalPrice: 10,
            isEmpty: false,
            items: expect.arrayContaining([
              expect.objectContaining({
                product: sampleProduct,
                count: 1
              })
            ])
          }
        })
      );
    });

    it('Генерирует событие cartChanged при обновлении количества товара', () => {
      // Добавляем товар
      cart.addProduct(sampleProduct);
      eventListener.mockClear(); // Очищаем предыдущие вызовы

      // Обновляем количество
      cart.updateProductCount(sampleProduct.id, 2);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cartChanged',
          detail: {
            totalCount: 3,
            totalPrice: 30,
            isEmpty: false,
            items: expect.arrayContaining([
              expect.objectContaining({
                product: sampleProduct,
                count: 3
              })
            ])
          }
        })
      );
    });

    it('Генерирует событие cartChanged при удалении товара', () => {
      cart.addProduct(sampleProduct);
      eventListener.mockClear();

      // Удаляем товар
      cart.updateProductCount(sampleProduct.id, -1);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cartChanged',
          detail: {
            totalCount: 0,
            totalPrice: 0,
            isEmpty: true,
            items: []
          }
        })
      );
    });

    it('Генерирует событие даже при попытке обновления несуществующего товара', () => {
      cart.addProduct(sampleProduct);
      eventListener.mockClear();

      // Пытаемся обновить несуществующий товар
      cart.updateProductCount('non-existent-id', 1);

      expect(eventListener).toHaveBeenCalledTimes(1);
      // Состояние корзины не должно измениться
      expect(eventListener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'cartChanged',
          detail: {
            totalCount: 1,
            totalPrice: 10,
            isEmpty: false,
            items: expect.arrayContaining([
              expect.objectContaining({
                product: sampleProduct,
                count: 1
              })
            ])
          }
        })
      );
    });

    it('Возвращает копию элементов в событии, а не оригинальный массив', () => {
      cart.addProduct(sampleProduct);

      const eventCall = eventListener.mock.calls[0][0];
      const itemsFromEvent = eventCall.detail.items;

      expect(itemsFromEvent).toEqual(cart.cartItems);
      expect(itemsFromEvent).not.toBe(cart.cartItems); // Проверяем что это копия
    });

    it('Корректно передает данные в событии при сложных операциях', () => {
      const anotherProduct = {
        name: "Tom yam soup",
        price: 8.5,
        category: "soups",
        image: "tom_yam.png",
        id: "tom-yam"
      };

      // Добавляем несколько товаров
      cart.addProduct(sampleProduct); // 10 * 1 = 10
      cart.addProduct(sampleProduct); // 10 * 2 = 20
      cart.addProduct(anotherProduct); // 8.5 * 1 = 8.5

      // Берем последнее событие
      const lastCall = eventListener.mock.calls[eventListener.mock.calls.length - 1][0];

      expect(lastCall.detail).toEqual({
        totalCount: 3,
        totalPrice: 28.5,
        isEmpty: false,
        items: expect.arrayContaining([
          expect.objectContaining({
            product: sampleProduct,
            count: 2
          }),
          expect.objectContaining({
            product: anotherProduct,
            count: 1
          })
        ])
      });
    });
  });

  describe('Наследование от EventTarget', () => {

    it('Cart является экземпляром EventTarget', () => {
      expect(cart instanceof EventTarget).toBe(true);
    });

    it('Поддерживает множественных слушателей событий', () => {
      const secondListener = vi.fn();
      cart.addEventListener('cartChanged', secondListener);

      cart.addProduct(sampleProduct);

      expect(eventListener).toHaveBeenCalledTimes(1);
      expect(secondListener).toHaveBeenCalledTimes(1);

      cart.removeEventListener('cartChanged', secondListener);
    });

    it('Позволяет отписаться от событий', () => {
      cart.removeEventListener('cartChanged', eventListener);
      cart.addProduct(sampleProduct);

      expect(eventListener).not.toHaveBeenCalled();
    });
  });
});
