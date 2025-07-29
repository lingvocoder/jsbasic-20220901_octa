import {createElement} from '../../assets/lib/create-element.js';

export default class CartIcon {
  elem = null;

  constructor() {
    this.render();
    this.addEventListeners();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getProductCard());
    }
    return this.elem;
  }

  getProductCard() {
    return `
      <div class="cart-icon__inner">
          <span class="cart-icon__count">1</span>
          <span class="cart-icon__price">€2.00</span>
        </div>;
    `;
  }

      // this.elem.classList.add('cart-icon_visible');

  update(cart) {
    if (!cart.isEmpty()) {

      this.updatePosition();

      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});

    } else {
      this.elem.classList.remove('cart-icon_visible');
    }
  }

  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  updatePosition() {
    const DIST_Y = window.scrollY || document.documentElement.scrollTop;
    const cartIcon = document.querySelector('.cart-icon');
    const container = document.querySelector('.container');
    const {right} = container.getBoundingClientRect();
    const rightOffset = right + 20;
    const leftOffset = document.documentElement.clientWidth - cartIcon.offsetWidth - 10;
    if (!(cartIcon.offsetHeight || cartIcon.offsetWidth)) {
      return false;
    }

    if (DIST_Y > cartIcon.offsetTop) {
      cartIcon.style.position = 'fixed';
      cartIcon.style.top = '50px';
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
