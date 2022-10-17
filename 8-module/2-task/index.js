import createElement from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/index.js';

export default class ProductGrid {
  elem = null;

  constructor(products) {
    this.products = products.map(product => this.modifyProductsObject(product));
    this.filters = {};
    this.render();
  }

  modifyProductsObject = (obj) => {
    if (!obj.hasOwnProperty('nuts')) {
      if (!obj.hasOwnProperty('vegeterian')) {
        obj = {
          ...obj,
          vegeterian: false,
          nuts: true
        };
      } else {
        obj = {
          ...obj,
          nuts: true
        };
      }
    } else {
      obj = {
        ...obj,
        nuts: false,
        vegeterian: false,
      };
    }
    return obj;
  }

  render() {
    this.elem = createElement(this.getProductGrid(this.products));
  }

  getProductGrid = (data) => {
    return `
        <div class="products-grid">
            <div class="products-grid__inner">
            ${this.getProductCards(data)}
            </div>
        </div>
    `;
  }

  getProductCards = (data) => {
    return data.map(item => {
      return new ProductCard(item).elem.outerHTML;
    }).join('');
  }

  updateFilter = (filters = {}) => {
    const gridInner = document.querySelector('.products-grid__inner');

    const vocabulary = {
      maxSpiciness: 'spiciness',
      category: 'category',
      vegeterianOnly: 'vegeterian',
      noNuts: 'nuts'
    };

    for (const prop in filters) {
      const propName = vocabulary[prop];
      const propValue = filters[prop];

      switch (prop) {
      case 'maxSpiciness':
        this.filters[propName] = propValue;
        break;
      case 'vegeterianOnly':
        this.filters[propName] = propValue;
        break;
      case 'noNuts':
        this.filters[propName] = propValue;
        break;
      case 'category':
        this.filters[propName] = propValue;
        break;
      }
    }

    const filterProductObjects = (filter) => this.products.filter(product => {
      return Object.keys(filter).every(key => key === 'spiciness' ? product[key] <= filter[key] : product[key] === filter[key]);
    });

    gridInner.innerHTML = this.getProductCards(filterProductObjects(this.filters));
  };
}

