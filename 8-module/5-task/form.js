import {createElement} from "../../assets/lib/create-element.js";

class Form {
  constructor() {}

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">${this.formatPrice(this.getTotalPrice())}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }
  onSubmit(event) {
    event.preventDefault();
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.classList.add('is-loading');
    const url = "https://httpbin.org/post";
    const modalBody = this.modalBody;
    const formData = modalBody.querySelector('.cart-form');

    fetch(url, {
      method: "POST",
      body: new FormData(formData),
    }).then(() => {
      this.modal.setTitle('Success!');
      modalBody.innerHTML = '' +
        '<div class="modal__body-inner">\n' +
        '  <p>\n' +
        '    Order successful! Your order is being cooked :) <br>\n' +
        '    We’ll notify you about delivery time shortly.<br>\n' +
        '    <img src="/assets/images/delivery.gif">\n' +
        '  </p>\n' +
        '</div>';
      this.cartItems.length = 0;
    });
  }

}
