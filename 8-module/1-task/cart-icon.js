import {createElement} from '../../assets/lib/create-element.js';

export default class CartIcon {
  elem = null;

  constructor() {
    this.render();
    this.addEventListeners();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getCartIcon());
    }
    return this.elem;
  }

  update(cart) {
    const countElem = this.elem.querySelector('.cart-icon__count');
    const priceElem = this.elem.querySelector('.cart-icon__price');

    countElem.textContent = cart.getTotalCount();
    priceElem.textContent = this.formatPrice(cart.getTotalPrice());


    // Анимируем иконку в зависимости от наличия товаров
    if (!cart.isEmpty() && !this.elem.classList.contains('shake')) {
      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});
    }
  }

  formatPrice = (num) => {
    return `€${parseFloat(num).toFixed(2)}`;
  };

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

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  getClientWidth() {
    return document.documentElement.clientWidth;
  }

  updatePosition() {
    const DIST_Y = window.scrollY || document.documentElement.scrollTop;
    const TOP_MARGIN = 50;
    const LEFT_MARGIN = 10;
    const RIGHT_MARGIN = 20;
    const cartIcon = this.elem;
    const container = document.querySelector('.container');
    const {right} = container.getBoundingClientRect();
    const rightOffset = right + RIGHT_MARGIN;
    const leftOffset = document.documentElement.clientWidth - cartIcon.offsetWidth - LEFT_MARGIN;
    if (!(cartIcon.offsetHeight || cartIcon.offsetWidth)) {
      return false;
    }

    if (DIST_Y > cartIcon.offsetTop) {
      cartIcon.style.position = 'fixed';
      cartIcon.style.top = `${TOP_MARGIN}px`;
      cartIcon.style.left = `${Math.min(rightOffset, leftOffset)}px`;
      cartIcon.style.zIndex = 100;
    } else {
      cartIcon.style.position = '';
      cartIcon.style.top = '';
      cartIcon.style.left = '';
      cartIcon.style.zIndex = '';
    }
    if (document.documentElement.clientWidth <= 767) {
      cartIcon.style.position = '';
      cartIcon.style.top = '';
      cartIcon.style.left = '';
      cartIcon.style.zIndex = '';
    }
  }
}
