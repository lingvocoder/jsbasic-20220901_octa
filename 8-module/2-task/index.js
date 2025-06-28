import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.mjs';

export default class ProductGrid {
  elem = null;

  constructor(products) {
    this.products = products;
    this.filters = {};
    this.render();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getProductGrid(this.products));
    }
    return this.elem;
  }

  getProductGrid = (data) => {
    return `
        <div class="products-grid">
            <div class="products-grid__inner">
            ${this.getProductCards(data)}
            </div>
        </div>
    `;
  };

  getProductCards = (data) => {
    return data.map(item => {
      return new ProductCard(item).elem.outerHTML;
    }).join('');
  };

  updateFilter = (filter = {}) => {
    Object.assign(this.filters, filter);
    this.renderFilteredProducts();
  };

  renderFilteredProducts = () => {
    const gridInner = document.querySelector('.products-grid__inner');
    const products = this.products;
    const filters = this.filters;

    function filter() {
      return products.filter(product => {
        return Object.keys(filters).some(key => {
          return product[key] === filters[key];
        });
      });
    }

    let filteredProducts = filter();
    gridInner.innerHTML = this.getProductCards(filteredProducts);
  };

};

