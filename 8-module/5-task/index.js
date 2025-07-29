export default class Cart {
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {
    if (!product) {
      return;
    }
    const {name, price, spiciness, category, image, id} = product;
    let foundCartItem = this.cartItems.find(item => item.product.id === product.id);

    if (foundCartItem === undefined) {
      foundCartItem = {
        product: {
          name,
          price,
          spiciness,
          category,
          image,
          id,
        },
        count: 1
      };
      this.cartItems.push(foundCartItem);
      this.onProductUpdate(foundCartItem);
    } else {
      foundCartItem.count++;
    }
  }

  updateProductCount(productId, amount) {
    const foundCartItem = this.cartItems.find(item => item.product.id === productId);
    if (foundCartItem === undefined) {return;}
    foundCartItem.count += amount;
    if (foundCartItem.count === 0) {
      this.cartItems.splice(this.cartItems.indexOf(foundCartItem), 1);
    }
    this.onProductUpdate(foundCartItem);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    return this.cartItems.reduce((acc, item) => acc + item.count, 0);
  }

  getTotalPrice() {
    return this.cartItems.reduce((acc, item) => acc + item.product.price * item.count, 0);
  }

  onProductUpdate(cartItem) {
    this.cartIcon.update(this);
  }
}

