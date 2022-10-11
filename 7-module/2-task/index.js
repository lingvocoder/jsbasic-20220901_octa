import createElement from '../../assets/lib/create-element.js';

export default class Modal {
  elem = null;

  constructor() {
    this.render();
    this.addEventListeners();
  }

  render() {
    this.elem = createElement(this.getModal());
  }

  addEventListeners() {
    this.elem.addEventListener("click", this.onCloseBtnClick);
    document.addEventListener("keydown", this.onEscButtonClick);
  }

  open() {
    const body = document.body;
    body.classList.add('is-modal-open');
    body.append(this.elem);
  }

  close() {
    const body = document.body;
    body.classList.remove('is-modal-open');
    this.elem.remove();
  }

  onEscButtonClick = (ev) => {
    if (ev.keyCode === 27 || ev.key === 'Escape') {
      this.close();
    }
  }

  onCloseBtnClick = (ev) => {
    const target = ev.target;
    const closeBtn = target.closest(".modal__close");
    if (!closeBtn) return;
    this.close();
  }

  setTitle = (title) => {
    this.elem.querySelector('.modal__title').textContent = title;
  }

  setBody = (node) => {
    this.elem.querySelector('.modal__body').append(node);
  }

  getModal = () => {
    return `
    <div class="modal">
    <div class="modal__overlay"></div>
    <div class="modal__inner">
      <div class="modal__header">
        <button type="button" class="modal__close">
          <img src="/assets/images/icons/cross-icon.svg" alt="close-icon" />
        </button>
        <h3 class="modal__title"></h3>
      </div>
      <div class="modal__body"></div>
    </div>
  </div>
    `;
  }

}
