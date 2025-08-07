import {createElement} from "../../assets/lib/create-element.js";

export default class ProductCard {
  elem = null;

  constructor({name, price, category, image, id} = {}) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.image = image;
    this.productID = id;
    this.render();
    this.addEventListeners();
  }
  render() {
    if (!this.elem) {
      this.elem = createElement(this.getCard());
    }
    return this.elem;
  }

  getCard = () => {
    return `
    <div class="card">
      <div class="card__top">
        <img src="/assets/images/products/${this.image}" class="card__image" alt="product">
        <span class="card__price">${this.formatPrice(this.price)}</span>
      </div>
      <div class="card__body">
        <div class="card__title">${this.name}</div>
        <button type="button" class="card__button">
          <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
      </div>
    </div>
    `;
  }

  formatPrice = (num) => {
    return `€${parseFloat(num).toFixed(2)}`;
  };

  addEventListeners() {
    this.elem.addEventListener('click', this.onAddBtnClick);
  }

  onAddBtnClick = (ev) => {
    const {target} = ev;
    const addBtn = target.closest('.card__button');
    if (!addBtn) {
      return;
    }
    const event = new CustomEvent('product-add', {
      bubbles: true,
      detail: this.productID,
    });
    console.log(event.detail);
    this.elem.dispatchEvent(event);
  };

}


