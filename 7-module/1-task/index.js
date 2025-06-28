import createElement from '../../assets/lib/create-element.js';

// const createElement = require("../../assets/lib/create-element.js");

class RibbonMenu {
  elem = null;
  selectedCategory;

  constructor(categories) {
    this.categories = categories;
    this.render();
    this.addEventListeners();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getMenu(this.categories));
    }
    return this.elem;
  }

  addEventListeners() {
    const inner = this.sub('inner');

    this.elem.addEventListener('click', ({target}) => {
      const prevBtn = target.closest('.ribbon__arrow_left');
      const nextBtn = target.closest('.ribbon__arrow_right');
      if (prevBtn) {
        this.onPrevButtonClick();
      }
      if (nextBtn) {
        this.onNextButtonClick();
      }
    });

    this.elem.addEventListener('click', (ev) => {
      this.onCategoryChoose(ev);
    });

    inner.addEventListener('scroll', (ev) => {
      this.onScroll(ev);
    });

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

  sub(ref) {
    return this.elem.querySelector(`.ribbon__${ref}`);
  }

  scrollRight() {
    return this.sub('inner').scrollWidth - (this.sub('inner').scrollLeft + this.sub('inner').clientWidth);
  }

  scrollLeft() {
    return this.sub('inner').scrollLeft;
  }

  updateArrows = () => {

    if (this.scrollLeft() > 0) {
      this.sub('arrow_left').classList.add('ribbon__arrow_visible');
    } else {
      this.sub('arrow_left').classList.remove('ribbon__arrow_visible');
    }

    let scrollRight = this.scrollRight();
    scrollRight = scrollRight < 1 ? 0 : scrollRight; // Это нужно для ситуации, когда скролл произошел с погрешностью
    if (scrollRight > 0) {
      this.sub('arrow_right').classList.add('ribbon__arrow_visible');
    } else {
      this.sub('arrow_right').classList.remove('ribbon__arrow_visible');
    }
  };

  onScroll() {
    this.updateArrows();
  }

  onPrevButtonClick = () => {
    let offset = 350;
    this.sub('inner').scrollBy(-offset, 0);
    this.updateArrows();
  };

  onNextButtonClick = () => {
    let offset = 350;
    this.sub('inner').scrollBy(offset, 0);
    this.updateArrows();
  };

  onCategoryChoose = (ev) => {
    const {target} = ev;
    ev.preventDefault();
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
