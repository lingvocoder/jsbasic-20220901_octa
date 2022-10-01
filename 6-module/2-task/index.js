import createElement from "../../assets/lib/create-element.js";

export default class ProductCard {
  elem = null;

  constructor({name, price, image, id} = {}) {
    this.imgName = image;
    this.price = price;
    this.name = name;
    this.productID = id;
    this.render();
  }

  template() {
    return `
    <div class="card">
      <div class="card__top">
        <img src="/assets/images/products/${this.imgName}" class="card__image" alt="product">
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
    return `€${parseInt(num).toFixed(2)}`;
  }

  render() {
    this.elem = createElement(this.template());
    this.elem.addEventListener('click', this.onAddBtnClick);
  }
  onAddBtnClick = (ev) => {
    const target = ev.target;
    const addBtn = target.closest('.card__button');
    if (!addBtn) {return;}
    const event = new CustomEvent('product-add', {
      bubbles: true,
      detail: this.productID,
    });

    addBtn.dispatchEvent(event);
  }

}
