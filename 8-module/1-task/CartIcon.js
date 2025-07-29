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

  getCartIcon() {
    return `
    <div class="cart-icon cart-icon_visible">
        <div class="cart-icon__inner">
          <span class="cart-icon__count">5</span>
          <span class="cart-icon__price">€10.00</span>
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
    const cartIcon = document.querySelector('.cart-icon');
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
