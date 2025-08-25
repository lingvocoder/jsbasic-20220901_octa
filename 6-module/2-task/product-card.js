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
     <article class="product-card" aria-label="Add ${this.name} to cart">
       <div class="product-card__media">
         <img src="../../assets/images/products/${this.image}" class="product-card__image" alt="${this.name}">
         <span class="product-card__price-badge">${this.formatPrice(this.price)}</span>
       </div>
       <div class="product-card__content">
         <h3 class="product-card__title">${this.name}</h3>
         <button type="button" class="product-card__add-button" aria-label="Add ${this.name} to cart">
           <img src="../../assets/images/icons/plus-icon.svg" alt="" aria-hidden="true">
         </button>
       </div>
     </article>
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
    const addBtn = target.closest('.product-card__add-button');
    if (!addBtn) {
      return;
    }
    const event = new CustomEvent('product-add', {
      bubbles: true,
      detail: this.productID,
    });
    this.elem.dispatchEvent(event);
  };

}


