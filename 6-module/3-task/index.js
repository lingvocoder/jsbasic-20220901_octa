import createElement from '../../assets/lib/create-element.js';

export default class Carousel {
  elem = null;

  constructor(slides = []) {
    this.slides = slides;
    this.counter = 0;
    this.render();
  }

  render() {
    this.elem = createElement(this.template());
      this.elem.addEventListener('click', this.onAddBtnClick);
    document.addEventListener('DOMContentLoaded', (ev) => {
      const btnPrev = document.querySelector('.carousel__arrow_left');
      const btnNext = document.querySelector('.carousel__arrow_right');
      btnPrev.style.display = 'none';
      btnPrev.addEventListener('click', this.onPrevButtonClick);
      btnNext.addEventListener('click', this.onNextButtonClick);
    });
  }

  template() {
    return `
        <div class="carousel">
            <div class="carousel__arrow carousel__arrow_right">
                <img src="/assets/images/icons/angle-icon.svg" alt="icon">
            </div>
            <div class="carousel__arrow carousel__arrow_left">
                <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
            </div>
            <div class="carousel__inner">
            ${this.slides.map(slide => {
                return this.getSlide(slide);
              }).join("")}
            </div>
        </div>

    `;
  }

  getSlide = ({name, price, image, id}) => {
    return `
    <div class="carousel__slide" id="${id}">
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
  }

  formatPrice = (num) => {
    return `€${parseInt(num).toFixed(2)}`;
  }

  onAddBtnClick = (ev) => {
    const target = ev.target;
    const addBtn = target.closest('.carousel__button');
    if (!addBtn) return;
    const event = new CustomEvent('product-add', {
      bubbles: true,
      detail: target.closest('.carousel__slide').id,
    });

    this.elem.dispatchEvent(event);
  }

  onPrevButtonClick = (ev) => {
    const target = ev.target;
    const btnPrev = target.closest('.carousel__arrow_left');
    const btnNext = document.querySelector('.carousel__arrow_right');
    const inner = document.querySelector('.carousel__inner');
    const dist = document.querySelector('.carousel__inner').offsetWidth;

    btnNext.style.display = '';
    if (!btnPrev) {
      return;
    }
    this.counter--;
    inner.style.transform = `translateX(-${this.counter * dist}px)`;
    if (this.counter < 0) {
      this.counter = 0;
      return;
    }
    if (this.counter === 0) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = '';
    }
  }

  onNextButtonClick = (ev) => {
    const target = ev.target;
    const btnNext = target.closest('.carousel__arrow_right');
    const btnPrev = document.querySelector('.carousel__arrow_left');
    const inner = document.querySelector('.carousel__inner');
    const dist = document.querySelector('.carousel__inner').offsetWidth;

    btnPrev.style.display = '';
    if (!btnNext) {
      return;
    }
    this.counter++;
    inner.style.transform = `translateX(-${this.counter * dist}px)`;

    if (this.counter > this.slides.length - 1) {
      this.counter = this.slides.length - 1;
      return;
    }
    if (this.counter === this.slides.length - 1) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = '';
    }
  };
}
