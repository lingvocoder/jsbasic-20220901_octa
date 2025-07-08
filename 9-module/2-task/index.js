import Carousel from '../../6-module/3-task/initCarousel.js';
import slides from '../../6-module/3-task/slides.js';

import RibbonMenu from '../../7-module/1-task/ribbonMenu.js';
import categories from '../../7-module/1-task/categories.js';

import StepSlider from '../../7-module/4-task/slider_drag.js';
import ProductsGrid from '../../8-module/2-task/index.js';

import CartIcon from '../../8-module/1-task/index.js';
import Cart from '../../8-module/4-task/index.js';

export default class Main {

  constructor() {
  }

  async render() {
    this.getCarousel();
    this.getRibbonMenu();
    this.getSlider();
    this.getCartIcon();
    this.productArray = await fetch('products.json').then(res => res.json());
    await this.getProductGrid();
    const cart = new Cart(this.cartIcon);


    document.body.addEventListener('product-add', (ev) => {
      let product = this.productArray.find(item => item.id === ev.detail);
      console.log(product);
      cart.addProduct(product);
    });

    document.getElementById('nuts-checkbox').addEventListener('change', (ev) => {
      console.log(ev.target);
      this.grid.updateFilter({
        noNuts: ev.target.checked
      });
    });

    this.stepSlider.elem.addEventListener('slider-change', (ev) => {
      this.grid.updateFilter({
        maxSpiciness: ev.detail
      });
    });

    document.getElementById('vegeterian-checkbox').addEventListener('change', (ev) => {

      this.grid.updateFilter({
        vegeterianOnly: ev.target.checked
      });
    });
  }

  getCarousel = () => {
    const carouselHolder = document.querySelector('[data-carousel-holder]');
    this.carousel = new Carousel(slides);
    carouselHolder.append(this.carousel.elem);
  }

  getRibbonMenu = () => {
    const ribbonHolder = document.querySelector('[data-ribbon-holder]');
    this.ribbonMenu = new RibbonMenu(categories);
    ribbonHolder.append(this.ribbonMenu.elem);
    this.ribbonMenu.elem.addEventListener('ribbon-select', (ev) => {
      this.grid.updateFilter({
        category: ev.detail
      });
    });
  }

  getSlider = () => {
    const sliderHolder = document.querySelector('[data-slider-holder]');
    this.stepSlider = new StepSlider({
      steps: 5, value: 3
    });
    sliderHolder.append(this.stepSlider.elem);

  }

  getCartIcon = () => {
    const cartIconHolder = document.querySelector('[data-cart-icon-holder]');
    this.cartIcon = new CartIcon();
    cartIconHolder.append(this.cartIcon.elem);
  }

  getProductGrid = () => {
    const gridHolder = document.querySelector('[data-products-grid-holder]');
    this.grid = new ProductsGrid(this.productArray);
    gridHolder.innerHTML = '';
    gridHolder.append(this.grid.elem);
  }

}
