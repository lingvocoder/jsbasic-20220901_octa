import createElement from "../../assets/lib/create-element.js";

export default class Carousel {
  elem = null;

  constructor(slides = []) {
    this.slides = slides;
    this.counter = 0;
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement(this.getCarousel(this.slides));
  }

  getCarousel = (data) => {
    return `
        <div class="carousel">
            <div class="carousel__arrow carousel__arrow_right">
                <img src="/assets/images/icons/angle-icon.svg" alt="icon">
            </div>
            <div class="carousel__arrow carousel__arrow_left" style="display: none">
                <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
            </div>
            <div class="carousel__inner">${this.getSlides(data)}</div>
        </div>
    `;
  }

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
  }

  getSlides = (data) => {
    return data.map(item => {
      return this.getSlide(item);
    }).join('');
  }

  addEventListeners() {
    this.elem.addEventListener('click', ({target}) => {
      const prevBtn = target.closest('.carousel__arrow_left');
      const nextBtn = target.closest('.carousel__arrow_right');
      this.onAddBtnClick(target);
      if (prevBtn) {
        this.onPrevButtonClick();
      }
      if (nextBtn) {
        this.onNextButtonClick();
      }
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
  }

  moveSlider = () => {
    const btnNext = document.querySelector('.carousel__arrow_right');
    const btnPrev = document.querySelector('.carousel__arrow_left');
    const inner = document.querySelector('.carousel__inner');
    const dist = document.querySelector('.carousel__inner').offsetWidth;
    let offset = -this.counter * dist;

    inner.style.transform = `translateX(${offset}px)`;

    if (this.counter === 0) {
      btnPrev.style.display = 'none';
    } else {
      btnPrev.style.display = '';
    }
    if (this.counter === this.slides.length - 1) {
      btnNext.style.display = 'none';
    } else {
      btnNext.style.display = '';
    }
  }

  formatPrice = (num) => {
    return `€${parseInt(num).toFixed(2)}`;
  }

  onPrevButtonClick = () => {
    this.counter--;
    if (this.counter < 0) {
      this.counter = 0;
    }
    this.moveSlider();
  }

  onNextButtonClick = () => {
    this.counter++;
    if (this.counter > this.slides.length - 1) {
      this.counter = this.slides.length - 1;
    }
    this.moveSlider();
  };
}
