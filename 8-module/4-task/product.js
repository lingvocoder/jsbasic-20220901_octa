
class Class {

  renderProduct(product, count) {

    return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
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
          <div class="cart-product__price">${this.formatPrice(product.price)}</div>
        </div>
      </div>
    </div>`);
  }

  renderModal() {
    this.modal = new Modal();
    this.modal.setTitle('Your order');
    this.modalBody = document.createElement('div');
    for (let item of this.cartItems) {
      this.modalBody.append(this.renderProduct(item.product, item.count));
    }
    this.modalBody.append(this.renderOrderForm());
    this.modal.setBody(this.modalBody);
    this.modal.open();

    this.modalBody.addEventListener("click", ({target}) => {
      const amount = target.closest('.cart-counter__button_plus') ? 1 : -1;
      const productID = target.closest('.cart-product[data-product-id]').dataset.productId;
      this.updateProductCount(productID, amount);
    });
    const form = this.modalBody.querySelector('.cart-form');
    form.addEventListener('submit', (ev) => this.onSubmit(ev));
  }

}

/*
*  if (document.body.classList.contains('is-modal-open')) {
      const productId = cartItem.product.id;
      const modalBody = this.modalBody;

      const productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      const productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      const infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = this.formatPrice(cartItem.count * cartItem.product.price);
      infoPrice.innerHTML = this.formatPrice(this.getTotalPrice());
    }
    if (!this.cartItems.length) {
      this.modal.close();
    }
    this.cartIcon.update(this);
*/
