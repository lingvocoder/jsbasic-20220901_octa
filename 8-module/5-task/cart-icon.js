import {createElement} from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';
import Modal from '../../7-module/2-task/modal.js';

const POSITION = {
  TOP_MARGIN: 50,
  LEFT_MARGIN: 10,
  RIGHT_MARGIN: 20
};
export default class CartIcon {
  elem = null;
  isShowingSuccess = false; // Флаг для показа успеха

  constructor(cart) {
    this.cart = cart;
    this.render();
    this.addEventListeners();
    this.subscribeToCart();
    this.initModal(); // Настраиваем модальное окно
  }

  /* ---------- Инициализация ---------- */
  render() {
    if (!this.elem) {
      this.elem = createElement(this.getCartIcon());
    }
    return this.elem;
  }

  subscribeToCart() {
    // Подписываемся на событие изменения корзины
    this.cart.addEventListener('cart-changed', (event) => {
      this.update(event.detail);
    });
  }

  initModal() {
    this.modal = new Modal();

    this.elem.addEventListener('click', () => {
      if (!this.cart.isEmpty()) {
        this.openModal();
      }
    });
  }

  /* ---------- Модальное окно ---------- */
  openModal() {
    this.renderModal();
    this.modal.open();
    this.addModalEventListeners();
  }

  renderModal() {
    this.modal.setTitle('Your order');
    this.modalBody = document.createElement('div');

    for (let item of this.cart.cartItems) {
      this.modalBody.append(this.renderProduct(item.product, item.count));
    }

    //Добавляем форму заказа
    this.modalBody.append(this.renderOrderForm());
    this.modal.setBody(this.modalBody);
  }

  renderProduct({id, image, name, price}, count) {
    return createElement(`
      <div class="cart-product" data-product-id="${id}">
        <div class="cart-product__img">
          <img src="/assets/images/products/${image}" alt="product">
        </div>
        <div class="cart-product__info">
          <div class="cart-product__title">${escapeHtml(name)}</div>
          <div class="cart-product__price-wrap">
            <div class="cart-counter">
              <button type="button" class="cart-counter__button cart-counter__button_minus">
                <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
              </button>
              <span class="cart-counter__count">${count}</span>
              <button type="button" class="cart-counter__button cart-counter__button_plus">
                <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
              </button>
            </div>
            <div class="cart-product__price">${this.formatPrice(price * count)}</div>
          </div>
        </div>
      </div>
    `);
  }

  renderOrderForm() {
    return createElement(`
      <form class="cart-form">
        <h5 class="cart-form__title">Delivery</h5>
        <div class="cart-form__group cart-form__group_row">
          <input name="name" type="text" class="cart-form__input"
                 placeholder="Name" required value="Santa Claus">
          <input name="email" type="email" class="cart-form__input"
                 placeholder="Email" required value="john@gmail.com">
          <input name="tel" type="tel" class="cart-form__input"
                 placeholder="Phone" required value="+1234567">
        </div>
        <div class="cart-form__group">
          <input name="address" type="text" class="cart-form__input"
                 placeholder="Address" required value="North, Lapland, Snow Home">
        </div>
        <div class="cart-buttons">
          <div class="cart-buttons__buttons btn-group">
            <div class="cart-buttons__info">
              <span class="cart-buttons__info-text">total</span>
              <span class="cart-buttons__info-price">${this.formatPrice(this.cart.getTotalPrice())}</span>
            </div>
            <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
          </div>
        </div>
      </form>
    `);
  }

  addModalEventListeners() {
    // Обработчик для кнопок +/-
    this.modalBody.addEventListener('click', (event) => {
      const button = event.target.closest('.cart-counter__button');
      if (!button) {
        return;
      }

      const productElem = button.closest('.cart-product');
      const {productId} = productElem.dataset;

      const amount = button.classList.contains('cart-counter__button_plus') ? 1 : -1;

      this.cart.updateProductCount(productId, amount);
    });

    // Отправка формы
    this.modalBody.addEventListener('submit', (event) => {
      this.onSubmit(event);
    });

    // Подписка на изменения корзины для обновления модального окна
    this.cart.addEventListener('cart-changed', (event) => {
      this.updateModal(event.detail);
    });
  }

  async onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    //Показываем состояние загрузки
    this.toggleLoading(submitButton, true);

    try {
      //Собираем данные формы
      const formData = new FormData(form);
      //Отправляем на сервер
      const response = await fetch(`https://httpbin.org/post`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        this.showSuccess();
      } else {
        throw new Error('Error occurred');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      this.toggleLoading(submitButton, false);
    }
  }

  toggleLoading(submitButton, isLoading) {
    submitButton.classList.toggle('is-loading', isLoading);
    submitButton.disabled = isLoading;
  }

  showSuccess() {
    // Устанавливаем флаг показа успеха
    this.isShowingSuccess = true;
    // Обновляем заголовок модального окна
    this.modal.setTitle('Success!');
    this.modalBody.innerHTML = `
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We'll notify you about delivery time shortly.<br>
          <img src="../../assets/images/delivery.gif" alt="delivery">
        </p>
      </div>
    `;

    // Очищаем корзину
    this.cart.cartItems.length = 0;
    // Генерируем событие об изменении
    this.cart.onProductUpdate();
    // Сбрасываем флаг через некоторое время
    setTimeout(() => {
      this.isShowingSuccess = false;
    }, 100);
  }

  /* ---------- Обновления ---------- */
  updateModal(cartData) {
    // Если показываем успех, не закрываем модальное окно
    if (this.isShowingSuccess) {
      return;
    }
    // Если корзина пуста — закрываем модальное окно
    if (cartData.isEmpty) {
      this.modal.close();
      return;
    }

    // Обновляем отображение товаров
    cartData.items.forEach(item => {
      const productElement = this.modalBody.querySelector(`[data-product-id="${item.product.id}"]`);
      if (productElement) {
        productElement.querySelector('.cart-counter__count').textContent = item.count
        productElement.querySelector('.cart-product__price').textContent = this.formatPrice(item.product.price * item.count);
      }
    });

    // Удаляем товары, которых больше нет в корзине
    const allProductElements = this.modalBody.querySelectorAll('.cart-product');
    allProductElements.forEach(productElem => {
      const {productId} = productElem.dataset;
      const itemExists = cartData.items.some(item => item.product.id === productId);

      if (!itemExists) {
        productElem.remove();
      }
    });

    // Обновляем общую сумму в форме
    const totalPriceElem = this.modalBody.querySelector('.cart-buttons__info-price');
    if (totalPriceElem) {
      totalPriceElem.textContent = this.formatPrice(cartData.totalPrice);
    }
  }

  update(cartData) {
    this.elem.querySelector('.cart-icon__count').textContent = cartData.totalCount;
    this.elem.querySelector('.cart-icon__price').textContent = this.formatPrice(cartData.totalPrice);

    // Анимируем иконку только если корзина не пуста
    if (!cartData.isEmpty && !this.elem.classList.contains('shake')) {
      this.elem.classList.add('shake');
      this.elem.addEventListener('transitionend', () => {
        this.elem.classList.remove('shake');
      }, {once: true});
    }
  }

  /* ---------- Вспомогательные ---------- */
  formatPrice(price) {
    return `€${parseFloat(price).toFixed(2)}`;
  }

  getCartIcon() {
    return `
    <div class="cart-icon cart-icon_visible">
        <div class="cart-icon__inner">
          <span class="cart-icon__count">0</span>
          <span class="cart-icon__price">€0.00</span>
        </div>
    </div>
    `;
  }

  getClientWidth() {
    return document.documentElement.clientWidth;
  }

  /* ---------- Позиционирование ---------- */
  addEventListeners() {
    document.addEventListener('scroll', () => this.updatePosition());
    window.addEventListener('resize', () => this.updatePosition());
  }

  resetPosition() {
    Object.assign(this.elem.style, {position: '', top: '', left: '', zIndex: ''});
  }

  updatePosition() {
    const DIST_Y = window.scrollY || document.documentElement.scrollTop;
    const cartIcon = this.elem;
    const container = document.querySelector('.container');

    if (!container || !(cartIcon.offsetHeight || cartIcon.offsetWidth)) {
      return;
    }
    const {right} = container.getBoundingClientRect();
    const rightOffset = right + POSITION.RIGHT_MARGIN;
    const leftOffset = document.documentElement.clientWidth - cartIcon.offsetWidth - POSITION.LEFT_MARGIN;

    if (DIST_Y > cartIcon.offsetTop) {
      Object.assign(cartIcon.style, {
        position: 'fixed',
        top: `${POSITION.TOP_MARGIN}px`,
        left: `${Math.min(rightOffset, leftOffset)}px`,
        zIndex: 100
      });
    } else {
      this.resetPosition();
    }

    if (document.documentElement.clientWidth <= 767) {
      this.resetPosition();
    }
  }
}
