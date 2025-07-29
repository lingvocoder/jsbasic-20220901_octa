import {createElement} from "../../assets/lib/create-element.js";

export default class Carousel {
  elem = null;

  constructor(slides = []) {
    this.slides = slides;
    this.counter = 0;
    this.render();
    this.addEventListeners();
    this.initCarousel();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getCarousel(this.slides));
    }
    return this.elem;
  }

  initCarousel() {
    this.checkEdgeSlides();
  }

  getCarousel = (data) => {
    return `
        <div class="carousel">
            <div class="carousel__arrow carousel__arrow_right">
                <img src="/assets/images/icons/angle-icon.svg" alt="icon">
            </div>
            <div class="carousel__arrow carousel__arrow_left">
                <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
            </div>
            <div class="carousel__inner">${this.getSlides(data)}</div>
        </div>
    `;
  };

  getSlide = ({name, price, image, id}) => {
    return `
    <div class="carousel__slide" data-id="${id}">
        <img src="/assets/images/carousel/${image}" class="carousel__img" alt="slide">
        <div class="carousel__caption">
          <span class="carousel__price">${this.formatPrice(price)}</span>
          <div class="carousel__title">${name}</div>
          <button type="button" class="carousel__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
          </button>
        </div>
      </div>
    `;
  };

  getSlides = (data) => data.map(item => this.getSlide(item)).join('');

  moveSlide() {
    const carouselInner = this.elem.querySelector('.carousel__inner');
    const slideWidth = parseFloat(window.getComputedStyle(carouselInner).width);
    let dist = -this.counter * slideWidth;
    carouselInner.style.transform = `translateX(${dist}px)`;
  }

  checkEdgeSlides() {
    const btnPrev = this.elem.querySelector('.carousel__arrow_left');
    const btnNext = this.elem.querySelector('.carousel__arrow_right');
    let slideCount = this.elem.querySelectorAll('.carousel__slide').length;

    btnPrev.style.display = this.counter === 0 ? 'none' : '';
    btnNext.style.display = this.counter === slideCount - 1 ? 'none' : '';
  }

  prev() {
    this.counter--;
    this.moveSlide();
  }

  next() {
    this.counter++;
    this.moveSlide();
  }

  addEventListeners() {
    this.elem.addEventListener('click', ({target}) => {
      const prevBtn = target.closest('.carousel__arrow_left');
      const nextBtn = target.closest('.carousel__arrow_right');
      this.onAddBtnClick(target);
      if (prevBtn) {
        this.prev();
      }
      if (nextBtn) {
        this.next();
      }
      this.checkEdgeSlides();
    });
  }

  onAddBtnClick = (target) => {
    const addBtn = target.closest('.carousel__button');
    if (!addBtn) {
      return;
    }
    const slideID = target.closest('.carousel__slide[data-id]').dataset.id;
    const event = new CustomEvent('product-add', {
      bubbles: true,
      detail: slideID,
    });
    this.elem.dispatchEvent(event);
  };

  formatPrice = (num) => {
    return `€${parseInt(num).toFixed(2)}`;
  };
}
