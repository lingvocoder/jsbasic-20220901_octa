import Cart from './cart.js';

describe('Класс, описывающий компонент "Корзины"', () => {
  let cart;
  let sampleProduct;
  let anotherProduct;

  beforeEach(() => {

    // Создаем экземпляр корзины
    cart = new Cart();

    // Тестовые товары
    sampleProduct = {
      name: "Laab kai chicken salad",
      price: 10,
      category: "salads",
      image: "laab_kai_chicken_salad.png",
      id: "laab-kai-chicken-salad"
    };

    anotherProduct = {
      name: "Tom yam soup",
      price: 8.5,
      category: "soups",
      image: "tom_yam.png",
      id: "tom-yam"
    };
  });

  describe('Инициализация экземпляра класса Cart', () => {
    it('Создает пустую корзину', () => {
      expect(cart.cartItems).toEqual([]);
      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotalCount()).toBe(0);
      expect(cart.getTotalPrice()).toBe(0);
    });

  });

  describe('Метод addProduct() — добавить блюда', () => {
    it('Добавляет новое блюдо в пустую корзину', () => {
      cart.addProduct(sampleProduct);

      expect(cart.cartItems).toHaveLength(1);
      expect(cart.cartItems[0]).toEqual({
        product: sampleProduct,
        count: 1
      });
      expect(cart.isEmpty()).toBe(false);
    });

    it('Увеличивает количество заказов данного блюда', () => {
      cart.addProduct(sampleProduct);
      cart.addProduct(sampleProduct);

      expect(cart.cartItems).toHaveLength(1);
      expect(cart.cartItems[0].count).toBe(2);
    });

    it('Добавляет разные блюда в корзину заказов', () => {
      cart.addProduct(sampleProduct);
      cart.addProduct(anotherProduct);

      expect(cart.cartItems).toHaveLength(2);
      expect(cart.cartItems[0].product.id).toBe(sampleProduct.id);
      expect(cart.cartItems[1].product.id).toBe(anotherProduct.id);
      expect(cart.cartItems[0].count).toBe(1);
      expect(cart.cartItems[1].count).toBe(1);
    });

    it('Игнорирует значения null и undefined', () => {
      cart.addProduct(null);
      cart.addProduct(undefined);
      cart.addProduct();

      expect(cart.cartItems).toHaveLength(0);
    });

    it('Игнорирует блюда без свойства ID', () => {
      const productWithoutId = {
        name: "Product without ID",
        price: 5
      };

      cart.addProduct(productWithoutId);

      expect(cart.cartItems).toHaveLength(0);
    });
  });

  describe('Метод updateProductCount() — обновить количество заказанных блюд', () => {
    beforeEach(() => {
      // Добавляем товары для тестирования
      cart.addProduct(sampleProduct);
      cart.addProduct(anotherProduct);
    });

    it('Увеличивает количество заказанных блюд на 1', () => {
      cart.updateProductCount(sampleProduct.id, 1);

      const item = cart.cartItems.find(item => item.product.id === sampleProduct.id);
      expect(item.count).toBe(2);
    });

    it('Уменьшает количество заказанных блюд на 1', () => {
      // Сначала добавим еще один товар
      cart.addProduct(sampleProduct);
      expect(cart.cartItems[0].count).toBe(2);

      cart.updateProductCount(sampleProduct.id, -1);

      const item = cart.cartItems.find(item => item.product.id === sampleProduct.id);
      expect(item.count).toBe(1);
    });

    it('Удаляет блюдо из корзины когда количество заказов становится 0', () => {
      cart.updateProductCount(sampleProduct.id, -1);

      expect(cart.cartItems).toHaveLength(1);
      expect(cart.cartItems.find(item => item.product.id === sampleProduct.id)).toBeUndefined();
    });

    it('Удаляет блюдо из корзины когда количество заказов становится отрицательным', () => {
      cart.updateProductCount(sampleProduct.id, -5);

      expect(cart.cartItems).toHaveLength(1);
      expect(cart.cartItems.find(item => item.product.id === sampleProduct.id)).toBeUndefined();
    });

    it('Корректно удаляет блюдо из массива заказанных блюд, используя алгоритм O(1)', () => {
      // Добавляем третий товар, чтобы проверить алгоритм быстрого удаления
      const thirdProduct = { ...sampleProduct, id: 'third-product', name: 'Third Product' };
      cart.addProduct(thirdProduct);

      expect(cart.cartItems).toHaveLength(3);

      // Удаляем первый товар
      cart.updateProductCount(sampleProduct.id, -1);

      expect(cart.cartItems).toHaveLength(2);
      // Проверяем что товар действительно удален
      expect(cart.cartItems.find(item => item.product.id === sampleProduct.id)).toBeUndefined();
      // Оставшиеся товары должны быть на месте (порядок может измениться из-за O(1) алгоритма)
      const remainingIds = cart.cartItems.map(item => item.product.id);
      expect(remainingIds).toContain(anotherProduct.id);
      expect(remainingIds).toContain(thirdProduct.id);
    });

    it('Игнорирует несуществующее блюдо', () => {
      const initialLength = cart.cartItems.length;

      cart.updateProductCount('non-existent-id', 1);
      expect(cart.cartItems).toHaveLength(initialLength);
    });

    it('Игнорирует некорректные параметры объекта блюда', () => {
      const initialCount = cart.cartItems[0].count;

      cart.updateProductCount(null, 1);
      cart.updateProductCount(sampleProduct.id, null);
      cart.updateProductCount(sampleProduct.id, 0);
      cart.updateProductCount();

      expect(cart.cartItems[0].count).toBe(initialCount);
    });
  });

  describe('Метод isEmpty() — проверить пуста ли корзина', () => {

    it('Возвращает true для пустой корзины', () => {
      expect(cart.isEmpty()).toBe(true);
    });

    it('Возвращает false для непустой корзины', () => {
      cart.addProduct(sampleProduct);
      expect(cart.isEmpty()).toBe(false);
    });

    it('Возвращает true после удаления блюда из корзины', () => {
      cart.addProduct(sampleProduct);
      cart.updateProductCount(sampleProduct.id, -1);
      expect(cart.isEmpty()).toBe(true);
    });
  });

  describe('Мтод getTotalCount() — вычисляет общее количество заказанных блюд', () => {

    it('Возвращает 0 для пустой корзины', () => {
      expect(cart.getTotalCount()).toBe(0);
    });

    it('Возвращает корректное значение заказов для одного блюда', () => {
      cart.addProduct(sampleProduct);
      expect(cart.getTotalCount()).toBe(1);

      cart.addProduct(sampleProduct);
      expect(cart.getTotalCount()).toBe(2);
    });

    it('Возвращает корректное значение всех заказов', () => {
      cart.addProduct(sampleProduct); // count: 1
      cart.addProduct(sampleProduct); // count: 2
      cart.addProduct(anotherProduct); // count: 1

      expect(cart.getTotalCount()).toBe(3);
    });

    it('Корректно пересчитывает количество заказов после удаления блюда из корзины', () => {
      cart.addProduct(sampleProduct);
      cart.addProduct(anotherProduct);
      expect(cart.getTotalCount()).toBe(2);

      cart.updateProductCount(sampleProduct.id, -1);
      expect(cart.getTotalCount()).toBe(1);
    });
  });

  describe('Метод getTotalPrice() — вычисляет общую стоимость заказа', () => {

    it('Возвращает 0 для пустой корзины', () => {
      expect(cart.getTotalPrice()).toBe(0);
    });

    it('Возвращает корректное значение стоимости для одного блюда', () => {
      cart.addProduct(sampleProduct); // price: 10
      expect(cart.getTotalPrice()).toBe(10);

      cart.addProduct(sampleProduct); // count: 2
      expect(cart.getTotalPrice()).toBe(20);
    });

    it('Корректно суммирует стоимость разных блюд', () => {
      cart.addProduct(sampleProduct); // 10
      cart.addProduct(anotherProduct); // 8.5

      expect(cart.getTotalPrice()).toBe(18.5);
    });

    it('Корректно учитывает количество каждого блюда', () => {
      cart.addProduct(sampleProduct); // 10 * 1 = 10
      cart.addProduct(sampleProduct); // 10 * 2 = 20
      cart.addProduct(anotherProduct); // 8.5 * 1 = 8.5
      cart.addProduct(anotherProduct); // 8.5 * 2 = 17

      expect(cart.getTotalPrice()).toBe(37); // 20 + 17
    });

    it('Корректно пересчитывает сумму заказа после изменений', () => {
      cart.addProduct(sampleProduct); // 10
      cart.addProduct(anotherProduct); // 8.5
      expect(cart.getTotalPrice()).toBe(18.5);

      cart.updateProductCount(sampleProduct.id, 1); // 10 * 2 = 20
      expect(cart.getTotalPrice()).toBe(28.5); // 20 + 8.5

      cart.updateProductCount(anotherProduct.id, -1); // удаляется
      expect(cart.getTotalPrice()).toBe(20);
    });
  });

  describe('Дополнительные методы', () => {

    it('getItems() возвращает копию товаров', () => {
      cart.addProduct(sampleProduct);

      const items = cart.getItems();

      expect(items).toEqual(cart.cartItems);
      expect(items).not.toBe(cart.cartItems); // Проверяем что это копия
    });
  });

  describe('Интеграционные тесты', () => {

    it('Полный жизненный цикл корзины', () => {
      // Пустая корзина
      expect(cart.isEmpty()).toBe(true);
      expect(cart.getTotalCount()).toBe(0);
      expect(cart.getTotalPrice()).toBe(0);


      cart.addProduct(sampleProduct); // 10, count: 1

      expect(cart.getTotalCount()).toBe(1);

      // Удаляем последний товар
      cart.updateProductCount(sampleProduct.id, -1); // count: 1

      expect(cart.isEmpty()).toBe(true);
    });

    it('Вызывает метод onProductUpdate даже для несуществующих товаров', () => {
      cart.addProduct(sampleProduct);
      cart.updateProductCount('non-existent-id', 1);

    });
  });

  describe('Особые случаи', () => {

    it('Корректно обрабатывает блюда с ценой равной 0', () => {
      const freeProduct = { ...sampleProduct, price: 0 };

      cart.addProduct(freeProduct);
      expect(cart.getTotalPrice()).toBe(0);
    });

    it('Корректно обрабатывает блюда с ценой, выраженной десятичной дробью', () => {
      const expensiveProduct = { ...sampleProduct, price: 12.99 };

      cart.addProduct(expensiveProduct);
      cart.addProduct(expensiveProduct);
      expect(cart.getTotalPrice()).toBe(25.98);
    });

    it('Корректно обрабатывает большие количества заказов', () => {
      cart.addProduct(sampleProduct);
      cart.updateProductCount(sampleProduct.id, 999);

      expect(cart.getTotalCount()).toBe(1000);
      expect(cart.getTotalPrice()).toBe(10000);
    });
  });
});
