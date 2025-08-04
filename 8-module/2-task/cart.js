export default class Cart {
  cartItems = [];

  constructor() {}

  addProduct(product) {
    if (!product || !product.id) return;

    let isFoundItem = -1;

    // Проходим по всему массиву, ищем товар
    for (let i = 0; i < this.cartItems.length; i++) {
      const currItem = this.cartItems[i];
      if (currItem.product.id === product.id && isFoundItem === -1) {
        isFoundItem = i;
        currItem.count++; // Увеличиваем количество найденного товара
      }
    }
    // Блюдо не найдено, значит добавляем
    if (isFoundItem === -1) {
      const itemToAdd = {
        product: product,
        count: 1
      };
      this.cartItems.push(itemToAdd);
    }
  }

  updateProductCount(productId, amount) {
    if (!productId || !amount) return;

    let isFoundItem = -1;

    // Проходим по массиву, ищем товар для обновления
    for (let i = 0; i < this.cartItems.length; i++) {
      let currItem = this.cartItems[i];
      if (currItem.product.id === productId && isFoundItem === -1) {
        isFoundItem = i;
        currItem.count += amount;// Обновляем количество
      }

      // Если блюдо найдено и его количество стало 0 или меньше — удаляем
      if (isFoundItem !== -1 && this.cartItems[isFoundItem].count <= 0) {
        // Быстрое удаление O(1): заменяем на последний элемент массива и удаляем его
        this.cartItems[isFoundItem] = this.cartItems[this.cartItems.length - 1];
        this.cartItems.pop();
      }
    }
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      const currItem = this.cartItems[i];
      totalCount += currItem.count;
    }
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    for (let i = 0; i < this.cartItems.length; i++) {
      const currItem = this.cartItems[i];
      totalPrice += currItem.count * currItem.product.price;
    }
    return totalPrice;
  }

  getItems() {
    return [...this.cartItems];
  }

}
