import {createElement} from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';
import Modal from '../../7-module/2-task/modal.js';


const POSITION = {
  TOP_MARGIN: 50,
  LEFT_MARGIN: 10,
  RIGHT_MARGIN: 20
};

export default class CartIcon {
  elem = null;

  constructor(cart) {
    this.cart = cart;
    this.render();
    this.addEventListeners();
    this.subscribeToCart();
    this.initModal(); // Настраиваем модальное окно
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getCartIcon());
    }
    return this.elem;
  }

  subscribeToCart() {
    // Подписываемся на событие изменения корзины
    this.cart.addEventListener('cart-changed', (event) => {
      this.update(event.detail);
    });
  }

  initModal() {
    this.modal = new Modal();

    // При клике на иконку открываем модалку
    this.elem.addEventListener('click', () => {
      if (!this.cart.isEmpty()) {
        this.openModal();
      }
    });
  }

  openModal() {
    this.renderModal();
    this.modal.open();
    this.addModalEventListeners();
  }

  renderModal() {
    this.modal.setTitle('Your order');

    // Создаем новый контейнер
    this.modalBody = document.createElement('div');

    // Рендерим все товары из корзины
    for (let item of this.cart.cartItems) {
      this.modalBody.append(this.renderProduct(item.product, item.count));
    }

    this.modal.setBody(this.modalBody);
  }

  renderProduct({id, image, name, price}, count) {
    return createElement(`
      <div class="cart-product" data-product-id="${id}">
        <div class="cart-product__img">
          <img src="/assets/images/products/${image}" alt="product">
        </div>
        <div class="cart-product__info">
          <div class="cart-product__title">${escapeHtml(name)}</div>
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
            <div class="cart-product__price">${this.formatPrice(price * count)}</div>
          </div>
        </div>
      </div>
    `);
  }

  addModalEventListeners() {
    // Обработчик для кнопок +/-
    this.modalBody.addEventListener('click', (event) => {
      const button = event.target.closest('.cart-counter__button');
      if (!button) {
        return;
      }

      const productElem = button.closest('.cart-product');
      const productId = productElem.dataset.productId;

      const isPlus = button.classList.contains('cart-counter__button_plus');
      const amount = isPlus ? 1 : -1;

      this.cart.updateProductCount(productId, amount);
    });

    // Подписка на изменения корзины для обновления модалки
    this.cart.addEventListener('cart-changed', (event) => {
      this.updateModal(event.detail);
    });
  }

  updateModal(cartData) {
    // Если корзина пуста — закрываем модалку
    if (cartData.isEmpty) {
      this.modal.close();
      return;
    }

    // Обновляем отображение товаров
    cartData.items.forEach(item => {
      const productElement = this.modalBody.querySelector(`[data-product-id="${item.product.id}"]`);
      if (productElement) {
        const countElem = productElement.querySelector('.cart-counter__count');
        const priceElem = productElement.querySelector('.cart-product__price');

        countElem.textContent = item.count;
        priceElem.textContent = this.formatPrice(item.product.price * item.count);
      }
    });

    // Удаляем товары, которых больше нет в корзине
    const allProductElements = this.modalBody.querySelectorAll('.cart-product');
    allProductElements.forEach(productElem => {
      const productId = productElem.dataset.productId;
      const itemExists = cartData.items.some(item => item.product.id === productId);

      if (!itemExists) {
        productElem.remove();
      }
    });
  }

  update(cartData) {
    const countElem = this.elem.querySelector('.cart-icon__count');
    const priceElem = this.elem.querySelector('.cart-icon__price');

    countElem.textContent = cartData.totalCount;
    priceElem.textContent = this.formatPrice(cartData.totalPrice);

    // Анимируем иконку только если корзина не пуста
    if (!cartData.isEmpty && !this.elem.classList.contains('shake')) {
      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});
    }
  }

  formatPrice(price) {
    return `€${parseFloat(price).toFixed(2)}`;
  }

  getCartIcon() {
    return `
    <div class="cart-icon cart-icon_visible">
        <div class="cart-icon__inner">
          <span class="cart-icon__count">0</span>
          <span class="cart-icon__price">€0.00</span>
        </div>
    </div>
    `;
  }

  getClientWidth() {
    return document.documentElement.clientWidth;
  }

  /* ---------- Позиционирование ---------- */
  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }
  resetPosition() {
    Object.assign(this.elem.style, {position: '', top: '', left: '', zIndex: ''});
  }

  updatePosition() {
    const DIST_Y = window.scrollY || document.documentElement.scrollTop;
    const cartIcon = this.elem;
    const container = document.querySelector('.container');

    if (!container || !(cartIcon.offsetHeight || cartIcon.offsetWidth)) {
      return;
    }
    const {right} = container.getBoundingClientRect();
    const rightOffset = right + POSITION.RIGHT_MARGIN;
    const leftOffset = document.documentElement.clientWidth - cartIcon.offsetWidth - POSITION.LEFT_MARGIN;


    if (DIST_Y > cartIcon.offsetTop) {

      Object.assign(cartIcon.style, {
        position: 'fixed',
        top: `${POSITION.TOP_MARGIN}px`,
        left: `${Math.min(rightOffset, leftOffset)}px`,
        zIndex: 100
      });
    } else {
      this.resetPosition();
    }

    if (document.documentElement.clientWidth <= 767) {
      this.resetPosition();
    }
  }
}
