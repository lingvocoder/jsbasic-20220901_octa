import createElement from "../../assets/lib/create-element.js";
export class ProductCard {
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

  get template() {
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

  render() {
    if (!this.elem) {
      this.elem = createElement(this.template);
    }
    return this.elem;
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
    this.elem.dispatchEvent(event);
  };

}

const card = new ProductCard({
  name: "Laab kai chicken salad",
  price: 10,
  category: "salads",
  image: "laab_kai_chicken_salad.png",
  id: "laab-kai-chicken-salad"
});

const holder = document.getElementById('holder');
holder.append(card.elem);
