import {createElement} from "../../assets/lib/create-element.js";

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
    this.subscribeToCart(); // Подписываемся на события корзины
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getCartIcon());
    }
    return this.elem;
  }

  update(cartData) {
    const countElem = this.elem.querySelector('.cart-icon__count');
    const priceElem = this.elem.querySelector('.cart-icon__price');

    countElem.textContent = cartData.totalCount;
    priceElem.textContent = this.formatPrice(cartData.totalPrice);

    // Анимируем иконку в зависимости от наличия товаров
    if (!cartData.isEmpty && !this.elem.classList.contains('shake')) {
      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});
    }
  }

  formatPrice (num)  {
    return `€${parseFloat(num).toFixed(2)}`;
  };

  getCartIcon() {
    return `
    <div class="cart-icon">
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

  subscribeToCart() {
    // Подписываемся на событие изменения корзины
    this.cart.addEventListener('cart-changed', (ev) => {
      this.update(ev.detail);
    });
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
