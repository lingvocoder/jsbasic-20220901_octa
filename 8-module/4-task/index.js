import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  elem;
  modal;
  cartItems = [];

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
    this.addEventListeners();
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
    if (foundCartItem === undefined) {
      return;
    }
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

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
  product.id
}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">${this.formatPrice(product.price)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">${this.formatPrice(this.getTotalPrice())}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');
    this.modalBody = document.createElement('div');
    for (let item of this.cartItems) {
      this.modalBody.append(this.renderProduct(item.product, item.count));
    }
    this.modalBody.append(this.renderOrderForm());
    this.modal.setBody(this.modalBody);
    this.modal.open();

    this.modalBody.addEventListener("click", ({target}) => {
      const amount = target.closest('.cart-counter__button_plus') ? 1 : -1;
      const productID = target.closest('.cart-product[data-product-id]').dataset.productId;
      this.updateProductCount(productID, amount);
    });
    const form = this.modalBody.querySelector('.cart-form');
    form.addEventListener('submit', (ev) => this.onSubmit(ev));
  }

  formatPrice = (num) => {
    return `€${parseFloat(num).toFixed(2)}`;
  }

  onProductUpdate(cartItem) {
    if (document.body.classList.contains('is-modal-open')) {
      const productId = cartItem.product.id;
      const modalBody = this.modalBody;

      const productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      const productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      const infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = this.formatPrice(cartItem.count * cartItem.product.price);
      infoPrice.innerHTML = this.formatPrice(this.getTotalPrice());
    }
    if (!this.cartItems.length) {
      this.modal.close();
    }
    this.cartIcon.update(this);
  }

  onSubmit(event) {
    event.preventDefault();
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.classList.add('is-loading');
    const url = "https://httpbin.org/post";
    const modalBody = this.modalBody;
    const formData = modalBody.querySelector('.cart-form');

    fetch(url, {
      method: "POST",
      body: new FormData(formData),
    }).then(() => {
      this.modal.setTitle('Success!');
      modalBody.innerHTML = '' +
          '<div class="modal__body-inner">\n' +
          '  <p>\n' +
          '    Order successful! Your order is being cooked :) <br>\n' +
          '    We’ll notify you about delivery time shortly.<br>\n' +
          '    <img src="/assets/images/delivery.gif">\n' +
          '  </p>\n' +
          '</div>';
      this.cartItems.length = 0;
    });
  }

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();
  }
}

