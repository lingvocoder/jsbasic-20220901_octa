import createElement from '../../assets/lib/create-element.js';
// const createElement = require("../../assets/lib/create-element.js");

class RibbonMenu {
  elem = null;
  selectedCategory;

  constructor(categories) {
    this.categories = categories;
    this.direction = 1;
    this.render();
    this.addEventListeners();
    this.initRibbonMenu();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getMenu(this.categories));
    }
    return this.elem;
  }

  initRibbonMenu() {
    this.checkEdgeSlides();
  }

  getMenu = (data) => {
    return `
            <div class="ribbon">
                <button class="ribbon__arrow ribbon__arrow_left ">
                    <img src="/assets/images/icons/angle-icon.svg" alt="icon">
                </button>
                <nav class="ribbon__inner">
                    ${this.getLinks(data)}
                </nav>
                <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
                    <img src="/assets/images/icons/angle-icon.svg" alt="icon">
                </button>
            </div>
            `;
  };

  getLink = ({id = '', name = ''}) => {
    return `
            <a href="#" class="ribbon__item" data-id="${id}">${name}</a>
           `;
  };
  getLinks = (data) => data.map(item => this.getLink(item)).join('');

  moveRibbon = () => {
    const inner = this.elem.querySelector('.ribbon__inner');
    const dist = 350;
    let offset = this.direction * dist;
    inner.scrollBy(offset, 0);
  };

  checkEdgeSlides = () => {
    const inner = this.elem.querySelector('.ribbon__inner');
    const btnNext = this.elem.querySelector('.ribbon__arrow_right');
    const btnPrev = this.elem.querySelector('.ribbon__arrow_left');
    const scrollWidth = inner.scrollWidth;
    const scrollLeft = inner.scrollLeft;
    const clientWidth = inner.clientWidth;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;

    if (inner.scrollLeft === 0) {
      btnPrev.classList.remove('ribbon__arrow_visible');
    } else {
      btnPrev.classList.add('ribbon__arrow_visible');
    }
    if (scrollRight < 1) {
      btnNext.classList.remove('ribbon__arrow_visible');
    } else {
      btnNext.classList.add('ribbon__arrow_visible');
    }
  };

  prev() {
    this.direction = -1;
    this.moveRibbon();
  }

  next() {
    this.direction = 1;
    this.moveRibbon();
  }

  addEventListeners() {
    this.elem.addEventListener('click', ({target}) => {
      const prevBtn = target.closest('.ribbon__arrow_left');
      const nextBtn = target.closest('.ribbon__arrow_right');
      this.onCategoryChoose(target);
      if (prevBtn) {
        this.prev();
      }
      if (nextBtn) {
        this.next();
      }
      this.checkEdgeSlides();
    });
  }

  onCategoryChoose = (target) => {
    const category = target.closest('.ribbon__item');
    if (!category) {
      return;
    }
    this.highlightCategory(category);
    const categoryID = target.closest('.ribbon__item[data-id]').dataset.id;
    const event = new CustomEvent('ribbon-select', {
      bubbles: true,
      detail: categoryID,
    });
    this.elem.dispatchEvent(event);
  };
  highlightCategory = (categoryItem) => {
    if (this.selectedCategory) {
      this.selectedCategory.classList.remove('ribbon__item_active');
    }
    this.selectedCategory = categoryItem;
    this.selectedCategory.classList.add('ribbon__item_active');
  };

}
export default RibbonMenu;
// module.exports = RibbonMenu;
