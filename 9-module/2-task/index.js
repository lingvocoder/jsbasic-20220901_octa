import Carousel from '../../6-module/3-task/init-carousel.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/ribbon-menu.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/slider-drag.js';
import ProductsGrid from '../../8-module/6-task/product-grid.js';

import CartIcon from '../../8-module/5-task/cart-icon.js';
import Cart from '../../8-module/3-task/cart.js';

export default class Main {

  constructor() {
  }

  async render() {
    this.initCarousel();
    this.initRibbonMenu();
    this.initSlider();
    this.cart = new Cart();
    this.initCartIcon(this.cart);
    this.productArray = await fetch('products.json').then(res => res.json());
    await this.getProductGrid();


    document.body.addEventListener('product-add', (ev) => {
      const productID = ev.detail;
      let product = this.productArray.find(item => item.id === productID);
      this.cart.addProduct(product);
    });

    const excludeNutsCheckbox = document.getElementById('exclude-nuts');
    excludeNutsCheckbox.addEventListener('change', (ev) => {
      const excludeNuts = ev.target.checked || undefined;
      this.grid.updateFilter({excludeNuts});
      this.grid.getVisibleProductsCount();
    });

    this.stepSlider.elem.addEventListener('slider-change', (ev) => {
      this.grid.updateFilter({
        maxSpiciness: ev.detail
      });
      this.grid.getVisibleProductsCount();
    });

    const vegetarianOnlyCheckbox = document.getElementById('vegetarian-only');
    vegetarianOnlyCheckbox.addEventListener('change', (ev) => {
      const onlyVegetarian = ev.target.checked || undefined;
      this.grid.updateFilter({onlyVegetarian});
      this.grid.getVisibleProductsCount();
    });
  }

  initCarousel = () => {
    const carouselHolder = document.querySelector('.carousel-holder');
    this.carousel = new Carousel(slides);
    carouselHolder.append(this.carousel.elem);
  }

  initRibbonMenu = () => {
    const ribbonHolder = document.querySelector('.ribbon-holder');
    this.ribbonMenu = new RibbonMenu(categories);
    ribbonHolder.append(this.ribbonMenu.elem);
    this.ribbonMenu.elem.addEventListener('ribbon-select', (ev) => {
      this.grid.updateFilter({
        category: ev.detail
      });
    });
  }

  initSlider = () => {
    const sliderHolder = document.querySelector('.slider-holder');
    this.stepSlider = new StepSlider({
      steps: 5, value: 3
    });
    sliderHolder.append(this.stepSlider.elem);
  }

  initCartIcon = () => {
    const cartIconHolder = document.querySelector('.cart-icon-holder');
    this.cartIcon = new CartIcon(this.cart);
    cartIconHolder.append(this.cartIcon.elem);
  }

  getProductGrid = () => {
    const gridHolder = document.querySelector('.products-grid-holder');
    this.grid = new ProductsGrid(this.productArray);
    gridHolder.innerHTML = '';
    gridHolder.append(this.grid.elem);
  }

}
