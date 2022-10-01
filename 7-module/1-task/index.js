import createElement from '../../assets/lib/create-element.js';

export default class RibbonMenu {
  elem = null;
  selectedCategory;

  constructor(categories) {
    this.categories = categories;
    this.render();
    this.addEventListeners();
    this.direction = 1;
  }

  render() {
    this.elem = createElement(this.getMenu(this.categories));
  }

  addEventListeners() {
    this.elem.addEventListener('click', (ev) => {
      const prevBtn = ev.target.closest('.ribbon__arrow_left');
      const nextBtn = ev.target.closest('.ribbon__arrow_right');
      this.onCategoryChoose(ev);
      if (prevBtn) {
        this.onPrevButtonClick();
      }
      if (nextBtn) {
        this.onNextButtonClick();
      }
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
  }
  getLink = ({id = '', name = ''}) => {
    return `
            <a href="#" class="ribbon__item" data-id="${id}">${name}</a>
           `;
  }

  getLinks = (data) => {
    return data.map(item => {
      return this.getLink(item);
    }).join('');
  }


  moveSlider = () => {
    const btnNext = document.querySelector('.ribbon__arrow_right');
    const btnPrev = document.querySelector('.ribbon__arrow_left');
    const inner = document.querySelector('.ribbon__inner');
    const scrollWidth = inner.scrollWidth;
    const scrollLeft = inner.scrollLeft;
    const clientWidth = inner.clientWidth;
    const dist = 350;
    let scrollRight = scrollWidth - scrollLeft - clientWidth;

    let offset = this.direction * dist;
    inner.scrollBy(offset, 0);

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
  }

  highlightCategory = (cat) => {
    if (this.selectedCategory) {
      this.selectedCategory.classList.remove('ribbon__item_active');
    }
    this.selectedCategory = cat;
    this.selectedCategory.classList.add('ribbon__item_active');
  }

  onCategoryChoose = (ev) => {
    ev.preventDefault();
    const {target} = ev;
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
  }

  onPrevButtonClick = () => {
    this.direction = -1;
    this.moveSlider();
  }

  onNextButtonClick = () => {
    this.direction = 1;
    this.moveSlider();
  };


}
