# 🛒 Учебный проект: Иконка корзины с оформлением заказа

> **Создаем полноценную корзину с модальным окном и формой заказа!** 🚀  
> Эта задача научит вас интегрировать компоненты через события, создавать интерактивные модальные окна,
> отправлять заказы на сервер, управлять состоянием загрузки и показывать результаты пользователю.

## 🎯 Задача

Создайте класс `CartIcon`, который отображает **иконку корзины** с количеством товаров и общей стоимостью,
открывает модальное окно с товарами и формой заказа, позволяет изменять количество товаров,
отправляет заказ на сервер и показывает результат оформления.

```js
const cart = new Cart(); // Корзина с поддержкой событий
const cartIcon = new CartIcon(cart); // Передаем корзину в иконку

document.body.append(cartIcon.elem);

// Клик на иконку открывает модалку с товарами и формой
// Кнопки +/- изменяют количество
// Форма отправляет заказ на сервер
// После успешной отправки показывается подтверждение
```

## 🔍 Архитектура компонента

```mermaid
graph TD
    A[Cart - EventTarget] --> B[dispatchEvent 'cart-changed']
    B --> C[CartIcon слушатель]
    C --> D[update UI иконки]
    
    E[Клик на иконку] --> F{Корзина пуста?}
    F -->|Нет| G[openModal]
    F -->|Да| H[Ничего не делаем]
    
    G --> I[renderModal]
    I --> J[Товары с кнопками +/-]
    I --> K[renderOrderForm]
    
    L[Клик на +/-] --> M[cart.updateProductCount]
    M --> N[cart-changed событие]
    N --> O[updateModal + updateTotal]
    
    P[Submit формы] --> Q[onSubmit]
    Q --> R[toggleLoading true]
    R --> S[fetch POST /api]
    S --> T{Успешно?}
    T -->|Да| U[showSuccess]
    T -->|Нет| V[Показать ошибку]
    U --> W[Очистить корзину]
    W --> X[Показать GIF]
    
    Y[Scroll/Resize] --> Z[updatePosition]
    
    style A fill:#e3f2fd
    style G fill:#e8f5e8
    style K fill:#ffeb3b
    style U fill:#c8e6c9
    style V fill:#ffebee
    style S fill:#fff3e0
```

## 📋 Структура компонента

### 🏗️ HTML структура иконки

```html

<div class="cart-icon cart-icon_visible">
  <div class="cart-icon__inner">
    <span class="cart-icon__count">0</span>
    <span class="cart-icon__price">€0.00</span>
  </div>
</div>
```

### 📝 Структура формы заказа

```html

<form class="cart-form">
  <h5 class="cart-form__title">Delivery</h5>
  <div class="cart-form__group cart-form__group_row">
    <input name="name" type="text" placeholder="Name" required>
    <input name="email" type="email" placeholder="Email" required>
    <input name="tel" type="tel" placeholder="Phone" required>
  </div>
  <div class="cart-form__group">
    <input name="address" type="text" placeholder="Address" required>
  </div>
  <div class="cart-buttons">
    <div class="cart-buttons__info">
      <span class="cart-buttons__info-text">total</span>
      <span class="cart-buttons__info-price">€125.50</span>
    </div>
    <button type="submit" class="cart-buttons__button">order</button>
  </div>
</form>
```

### 🎉 Экран успешного оформления

```html

<div class="modal__body-inner">
  <p>
    Order successful! Your order is being cooked :) <br>
    We'll notify you about delivery time shortly.<br>
    <img src="/assets/images/delivery.gif" alt="delivery">
  </p>
</div>
```

```html

<div class="cart-product" data-product-id="laab-kai">
  <div class="cart-product__img">
    <img src="/assets/images/products/laab_kai.png" alt="product">
  </div>
  <div class="cart-product__info">
    <div class="cart-product__title">Laab kai chicken salad</div>
    <div class="cart-product__price-wrap">
      <div class="cart-counter">
        <button class="cart-counter__button cart-counter__button_minus">
          <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
        </button>
        <span class="cart-counter__count">2</span>
        <button class="cart-counter__button cart-counter__button_plus">
          <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
        </button>
      </div>
      <div class="cart-product__price">€20.00</div>
    </div>
  </div>
</div>
```

### 📊 Данные из события cart-changed

```js
// event.detail содержит:
{
  totalCount: 5,        // Общее количество товаров
    totalPrice
:
  125.50,   // Общая стоимость
    isEmpty
:
  false,       // Флаг пустой корзины
    items
:
  [              // Массив товаров
    {
      product: {
        id: "laab-kai",
        name: "Laab kai chicken salad",
        price: 10,
        image: "laab_kai.png"
      },
      count: 2
    }
  ]
}
```

## ✅ Требования к реализации

| Компонент                 | Требование                                | Статус  |
|---------------------------|-------------------------------------------|---------|
| **Конструктор с cart**    | Принимает экземпляр корзины               | Базовое |
| **subscribeToCart()**     | Подписка на событие 'cart-changed'        | Базовое |
| **initModal()**           | Инициализация модального окна             | Базовое |
| **renderOrderForm()**     | Рендер формы заказа с полями доставки     | ✨ Новое |
| **onSubmit()**            | Асинхронная отправка заказа на сервер     | ✨ Новое |
| **toggleLoading()**       | Управление состоянием загрузки кнопки     | ✨ Новое |
| **showSuccess()**         | Показ успешного оформления с анимацией    | ✨ Новое |
| **isShowingSuccess флаг** | Предотвращение закрытия при показе успеха | ✨ Новое |
| **Обновление total**      | Динамическое обновление суммы в форме     | ✨ Новое |
| **Очистка корзины**       | После успешной отправки заказа            | ✨ Новое |
| **Обработка ошибок**      | try/catch для fetch запроса               | ✨ Новое |
| **Валидация формы**       | HTML5 required атрибуты                   | ✨ Новое |

## 🛠️ Что нужно реализовать

```js
import Modal from '../../7-module/2-task/modal.js';
import escapeHtml from '../../assets/lib/escape-html.js';

export default class CartIcon {
  isShowingSuccess = false; // Флаг для показа успеха

  constructor(cart) {
    this.cart = cart;
    this.render();
    this.addEventListeners();
    this.subscribeToCart();
    this.initModal();
  }

  renderModal() {
    this.modal.setTitle('Your order');
    this.modalBody = document.createElement('div');

    // Рендерим все товары
    for (let item of this.cart.cartItems) {
      this.modalBody.append(
        this.renderProduct(item.product, item.count)
      );
    }

    // Добавляем форму заказа
    this.modalBody.append(this.renderOrderForm());
    this.modal.setBody(this.modalBody);
  }

  renderOrderForm() {
    return createElement(`
      <form class="cart-form">
        <h5 class="cart-form__title">Delivery</h5>
        <!-- Поля формы -->
        <div class="cart-buttons">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">
              ${this.formatPrice(this.cart.getTotalPrice())}
            </span>
          </div>
          <button type="submit" class="cart-buttons__button">order</button>
        </div>
      </form>
    `);
  }

  async onSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');

    // Показываем загрузку
    this.toggleLoading(submitButton, true);

    try {
      const formData = new FormData(form);
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        this.showSuccess();
      } else {
        throw new Error('Order failed');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      this.toggleLoading(submitButton, false);
    }
  }

  showSuccess() {
    this.isShowingSuccess = true;
    this.modal.setTitle('Success!');

    // Показываем сообщение об успехе
    this.modalBody.innerHTML = `
      <div class="modal__body-inner">
        <p>
          Order successful! Your order is being cooked :) <br>
          We'll notify you about delivery time shortly.<br>
          <img src="/assets/images/delivery.gif">
        </p>
      </div>
    `;

    // Очищаем корзину
    this.cart.cartItems.length = 0;
    this.cart.onProductUpdate();

    // Сбрасываем флаг
    setTimeout(() => {
      this.isShowingSuccess = false;
    }, 100);
  }

  updateModal(cartData) {
    // Не закрываем при показе успеха
    if (this.isShowingSuccess) return;

    if (cartData.isEmpty) {
      this.modal.close();
      return;
    }

    // Обновляем товары и общую сумму
    // ...
  }
}
```

💡 **Важно:** Форма отправляется асинхронно, корзина очищается после успешной отправки!

## 💡 Концепции, которые вы изучите

- **Интеграция компонентов**: объединение Cart, CartIcon и Modal
- **Асинхронные операции**: async/await для отправки заказа
- **Управление состоянием загрузки**: UX паттерн loading state
- **Обработка форм**: FormData API и отправка на сервер
- **Try/catch**: правильная обработка ошибок в async функциях
- **Флаги состояния**: isShowingSuccess для управления поведением
- **Событийная архитектура**: подписка на события и реакция на изменения
- **Делегирование событий**: один обработчик для всех кнопок
- **Динамическое обновление DOM**: изменение содержимого без перерисовки
- **Защита от XSS**: использование escapeHtml
- **HTML5 валидация**: required атрибуты для полей формы

## 🎓 Для новичков

### Как работает отправка формы?

```js
// 1. Предотвращаем стандартную отправку
async
onSubmit(event)
{
  event.preventDefault(); // Останавливаем перезагрузку страницы

  // 2. Собираем данные формы
  const formData = new FormData(event.target);
  // FormData автоматически соберет все input с name атрибутами

  // 3. Отправляем на сервер
  const response = await fetch('/api/order', {
    method: 'POST',
    body: formData
  });

  // 4. Проверяем результат
  if (response.ok) {
    console.log('Заказ оформлен!');
  }
}
```

### Что такое состояние загрузки?

Это UX паттерн, показывающий пользователю, что идет процесс:

```js
toggleLoading(button, isLoading)
{
  // Добавляем класс для спиннера
  button.classList.toggle('is-loading', isLoading);
  // Блокируем кнопку от повторных кликов
  button.disabled = isLoading;
}

// Использование:
toggleLoading(submitBtn, true);  // Начало загрузки
await sendData();                 // Отправка данных
toggleLoading(submitBtn, false); // Конец загрузки
```

### Зачем флаг isShowingSuccess?

Предотвращает нежелательное закрытие модалки:

```js
updateModal(cartData)
{
  // Без флага: модалка закроется при очистке корзины
  if (cartData.isEmpty) {
    this.modal.close(); // ❌ Закроет модалку с успехом
  }

  // С флагом: модалка останется открытой
  if (this.isShowingSuccess) {
    return; // ✅ Не закрываем при показе успеха
  }

  if (cartData.isEmpty) {
    this.modal.close(); // Закрываем только обычную пустую корзину
  }
}
```

## ⚡ Частые ошибки

❌ **Забыть preventDefault при отправке формы**

```js
onSubmit(event)
{
  // ❌ Страница перезагрузится
  const formData = new FormData(event.target);
  fetch('/api', {method: 'POST', body: formData});
}
```

✅ **Всегда предотвращать стандартное поведение**

```js
async
onSubmit(event)
{
  event.preventDefault(); // ✅ Останавливаем перезагрузку
  const formData = new FormData(event.target);
  await fetch('/api', {method: 'POST', body: formData});
}
```

❌ **Не блокировать кнопку при загрузке**

```js
async
onSubmit(event)
{
  event.preventDefault();
  // ❌ Пользователь может кликнуть несколько раз
  await fetch('/api', {method: 'POST', body: formData});
}
```

✅ **Управлять состоянием кнопки**

```js
async
onSubmit(event)
{
  event.preventDefault();
  const submitButton = event.target.querySelector('[type="submit"]');

  submitButton.disabled = true; // ✅ Блокируем
  submitButton.classList.add('is-loading');

  try {
    await fetch('/api', {method: 'POST', body: formData});
  } finally {
    submitButton.disabled = false; // ✅ Разблокируем
    submitButton.classList.remove('is-loading');
  }
}
```

❌ **Закрывать модалку при очистке корзины после успеха**

```js
showSuccess()
{
  // Показываем успех
  this.modalBody.innerHTML = '...success...';
  // Очищаем корзину
  this.cart.cartItems.length = 0;
  this.cart.onProductUpdate(); // Генерирует cart-changed с isEmpty = true
  // ❌ Модалка закроется из-за updateModal!
}
```

✅ **Использовать флаг для защиты от закрытия**

```js
showSuccess()
{
  this.isShowingSuccess = true; // ✅ Устанавливаем флаг
  this.modalBody.innerHTML = '...success...';
  this.cart.cartItems.length = 0;
  this.cart.onProductUpdate();

  setTimeout(() => {
    this.isShowingSuccess = false; // Сбрасываем флаг
  }, 100);
}

updateModal(cartData)
{
  if (this.isShowingSuccess) return; // ✅ Не закрываем при успехе
  if (cartData.isEmpty) this.modal.close();
}

❌ **
Не
экранировать
пользовательский
контент **

```js
renderProduct({name}) {
  return createElement(`
< !-- ❌ XSS
уязвимость-- >
< div

class

= "cart-product__title" > $
{
  name
}
</div>
`);
}
```

✅ **Всегда экранировать**

```js
renderProduct({name})
{
  return createElement(`
    <!-- ✅ Безопасно -->
    <div class="cart-product__title">${escapeHtml(name)}</div>
  `);
}
```

## 🔧 Различные подходы к решению

### 🎯 Базовое решение (как в задаче)

```js
export default class CartIcon {
  constructor(cart) {
    this.cart = cart;
    this.render();
    this.addEventListeners();
    this.subscribeToCart();
    this.initModal();
  }

  initModal() {
    this.modal = new Modal();

    this.elem.addEventListener('click', () => {
      if (!this.cart.isEmpty()) {
        this.openModal();
      }
    });
  }

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

  addModalEventListeners() {
    // Делегирование для кнопок
    this.modalBody.addEventListener('click', (event) => {
      const button = event.target.closest('.cart-counter__button');
      if (!button) return;

      const productElem = button.closest('.cart-product');
      const productId = productElem.dataset.productId;
      const isPlus = button.classList.contains('cart-counter__button_plus');
      const amount = isPlus ? 1 : -1;

      this.cart.updateProductCount(productId, amount);
    });

    // Обновление модалки при изменениях
    this.cart.addEventListener('cart-changed', (event) => {
      this.updateModal(event.detail);
    });
  }

  updateModal(cartData) {
    if (cartData.isEmpty) {
      this.modal.close();
      return;
    }

    // Обновляем существующие товары
    cartData.items.forEach(item => {
      const elem = this.modalBody.querySelector(`[data-product-id="${item.product.id}"]`);
      if (elem) {
        elem.querySelector('.cart-counter__count').textContent = item.count;
        elem.querySelector('.cart-product__price').textContent =
          this.formatPrice(item.product.price * item.count);
      }
    });

    // Удаляем товары, которых больше нет
    this.modalBody.querySelectorAll('.cart-product').forEach(elem => {
      const id = elem.dataset.productId;
      const exists = cartData.items.some(item => item.product.id === id);
      if (!exists) elem.remove();
    });
  }
}
```

### 🛡️ С оптимизацией и кешированием

```js
export default class CartIcon {
  constructor(cart) {
    this.cart = cart;
    this.productElements = new Map(); // Кеш элементов товаров
    this.isModalOpen = false;

    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Все обработчики в одном месте
    this.boundHandlers = {
      onCartChange: this.onCartChange.bind(this),
      onModalClick: this.onModalClick.bind(this),
      onIconClick: this.onIconClick.bind(this),
      updatePosition: this.updatePosition.bind(this)
    };

    this.cart.addEventListener('cart-changed', this.boundHandlers.onCartChange);
    this.elem.addEventListener('click', this.boundHandlers.onIconClick);
    document.addEventListener('scroll', this.boundHandlers.updatePosition);
    window.addEventListener('resize', this.boundHandlers.updatePosition);
  }

  onCartChange(event) {
    const cartData = event.detail;

    // Обновляем иконку
    this.update(cartData);

    // Обновляем модалку только если открыта
    if (this.isModalOpen) {
      this.updateModal(cartData);
    }
  }

  openModal() {
    if (this.isModalOpen) return;

    this.isModalOpen = true;
    this.renderModal();
    this.modal.open();

    // Добавляем обработчик только при открытии
    this.modalBody.addEventListener('click', this.boundHandlers.onModalClick);

    // Слушаем закрытие модалки
    this.modal.elem.addEventListener('modal-close', () => {
      this.isModalOpen = false;
      this.productElements.clear(); // Очищаем кеш
    }, {once: true});
  }

  renderModal() {
    this.modal.setTitle('Your order');
    this.modalBody = document.createElement('div');
    this.productElements.clear();

    // Рендерим и кешируем элементы
    for (let item of this.cart.cartItems) {
      const productElem = this.renderProduct(item.product, item.count);
      this.modalBody.append(productElem);
      this.productElements.set(item.product.id, productElem);
    }

    this.modal.setBody(this.modalBody);
  }

  updateModal(cartData) {
    if (cartData.isEmpty) {
      this.modal.close();
      return;
    }

    // Быстрое обновление через кеш
    cartData.items.forEach(item => {
      const elem = this.productElements.get(item.product.id);
      if (elem) {
        this.updateProductElement(elem, item);
      } else {
        // Новый товар - добавляем
        const newElem = this.renderProduct(item.product, item.count);
        this.modalBody.append(newElem);
        this.productElements.set(item.product.id, newElem);
      }
    });

    // Удаляем отсутствующие товары
    this.productElements.forEach((elem, id) => {
      const exists = cartData.items.some(item => item.product.id === id);
      if (!exists) {
        elem.remove();
        this.productElements.delete(id);
      }
    });
  }

  updateProductElement(elem, item) {
    const countElem = elem.querySelector('.cart-counter__count');
    const priceElem = elem.querySelector('.cart-product__price');

    // Обновляем только если изменилось
    const newCount = item.count.toString();
    const newPrice = this.formatPrice(item.product.price * item.count);

    if (countElem.textContent !== newCount) {
      countElem.textContent = newCount;
    }
    if (priceElem.textContent !== newPrice) {
      priceElem.textContent = newPrice;
    }
  }

  destroy() {
    // Отписываемся от всех событий
    this.cart.removeEventListener('cart-changed', this.boundHandlers.onCartChange);
    document.removeEventListener('scroll', this.boundHandlers.updatePosition);
    window.removeEventListener('resize', this.boundHandlers.updatePosition);

    if (this.modal) {
      this.modal.close();
    }

    this.elem.remove();
  }
}
```

### ⚡ С анимациями и эффектами

```js
export default class CartIcon {
  renderProduct(product, count) {
    const elem = createElement(`...`);

    // Добавляем анимацию появления
    elem.style.opacity = '0';
    elem.style.transform = 'translateY(-10px)';

    requestAnimationFrame(() => {
      elem.style.transition = 'all 0.3s ease';
      elem.style.opacity = '1';
      elem.style.transform = 'translateY(0)';
    });

    return elem;
  }

  updateModal(cartData) {
    // Анимация изменения количества
    cartData.items.forEach(item => {
      const elem = this.modalBody.querySelector(`[data-product-id="${item.product.id}"]`);
      if (elem) {
        const countElem = elem.querySelector('.cart-counter__count');
        const oldCount = parseInt(countElem.textContent);
        const newCount = item.count;

        if (oldCount !== newCount) {
          // Анимация изменения
          countElem.classList.add('count-changing');
          countElem.textContent = newCount;

          setTimeout(() => {
            countElem.classList.remove('count-changing');
          }, 300);

          // Подсветка строки
          elem.classList.add('product-updated');
          setTimeout(() => {
            elem.classList.remove('product-updated');
          }, 1000);
        }
      }
    });

    // Анимация удаления
    this.modalBody.querySelectorAll('.cart-product').forEach(elem => {
      const id = elem.dataset.productId;
      const exists = cartData.items.some(item => item.product.id === id);

      if (!exists) {
        elem.style.transition = 'all 0.3s ease';
        elem.style.opacity = '0';
        elem.style.transform = 'translateX(20px)';

        elem.addEventListener('transitionend', () => {
          elem.remove();
        }, {once: true});
      }
    });
  }
}
```

## 🌟 Расширенные версии

### 🎨 С формой оформления заказа

```js
class CartIconWithCheckout extends CartIcon {
  renderModal() {
    super.renderModal();

    // Добавляем форму оформления
    const checkoutForm = this.renderCheckoutForm();
    this.modalBody.append(checkoutForm);
  }

  renderCheckoutForm() {
    const totalPrice = this.cart.getTotalPrice();

    return createElement(`
      <div class="cart-checkout">
        <div class="cart-total">
          <span>Total:</span>
          <span class="cart-total-price">${this.formatPrice(totalPrice)}</span>
        </div>
        <form class="cart-form">
          <h3>Delivery</h3>
          <input type="text" name="name" placeholder="Name" required>
          <input type="email" name="email" placeholder="Email" required>
          <input type="tel" name="tel" placeholder="Phone" required>
          <input type="text" name="address" placeholder="Address" required>
          <button type="submit" class="button button_primary">
            <span>Order</span>
          </button>
        </form>
      </div>
    `);
  }

  addModalEventListeners() {
    super.addModalEventListeners();

    // Обработчик формы
    const form = this.modalBody.querySelector('.cart-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitOrder(new FormData(form));
      });
    }
  }

  async submitOrder(formData) {
    const orderData = {
      items: this.cart.getItems(),
      ...Object.fromEntries(formData)
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        this.showSuccessMessage();
        this.cart.clear();
        setTimeout(() => this.modal.close(), 2000);
      }
    } catch (error) {
      this.showErrorMessage(error.message);
    }
  }
}
```

### 📦 С сохранением состояния

```js
class PersistentCartIcon extends CartIcon {
  constructor(cart) {
    super(cart);
    this.loadModalState();
  }

  openModal() {
    super.openModal();
    this.saveModalState(true);
  }

  modal
.

  close() {
    super.close();
    this.saveModalState(false);
  }

  saveModalState(isOpen) {
    sessionStorage.setItem('cartModalOpen', isOpen);

    if (isOpen) {
      // Сохраняем позицию скролла в модалке
      const scrollTop = this.modalBody?.scrollTop || 0;
      sessionStorage.setItem('cartModalScroll', scrollTop);
    }
  }

  loadModalState() {
    const wasOpen = sessionStorage.getItem('cartModalOpen') === 'true';

    if (wasOpen && !this.cart.isEmpty()) {
      // Восстанавливаем модалку
      setTimeout(() => {
        this.openModal();

        const scrollTop = parseInt(sessionStorage.getItem('cartModalScroll') || 0);
        if (this.modalBody) {
          this.modalBody.scrollTop = scrollTop;
        }
      }, 100);
    }
  }
}
```

### 🔄 С рекомендациями товаров

```js
class SmartCartIcon extends CartIcon {
  async renderModal() {
    super.renderModal();

    // Добавляем блок рекомендаций
    const recommendations = await this.loadRecommendations();
    if (recommendations.length > 0) {
      this.modalBody.append(this.renderRecommendations(recommendations));
    }
  }

  async loadRecommendations() {
    const productIds = this.cart.getItems().map(item => item.product.id);

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({productIds})
      });

      return await response.json();
    } catch {
      return [];
    }
  }

  renderRecommendations(products) {
    return createElement(`
      <div class="cart-recommendations">
        <h3>You might also like:</h3>
        <div class="recommendations-list">
          ${products.map(product => `
            <div class="recommendation-item" data-product-id="${product.id}">
              <img src="/assets/images/products/${product.image}" alt="${product.name}">
              <span>${escapeHtml(product.name)}</span>
              <span>${this.formatPrice(product.price)}</span>
              <button class="button button_small">Add</button>
            </div>
          `).join('')}
        </div>
      </div>
    `);
  }

  addModalEventListeners() {
    super.addModalEventListeners();

    // Обработчик для рекомендаций
    this.modalBody.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.recommendation-item button');
      if (addBtn) {
        const productId = addBtn.closest('.recommendation-item').dataset.productId;
        this.addRecommendedProduct(productId);
      }
    });
  }

  async addRecommendedProduct(productId) {
    // Загружаем полную информацию о товаре
    const product = await this.loadProduct(productId);
    if (product) {
      this.cart.addProduct(product);

      // Визуальная обратная связь
      const elem = this.modalBody.querySelector(`[data-product-id="${productId}"]`);
      elem.classList.add('added-to-cart');
    }
  }
}
```

## 🎨 Практическое применение

### 🛍️ Полноценная корзина для e-commerce

```js
// main.js - Инициализация всей системы
class ShoppingCartSystem {
  constructor() {
    this.cart = new Cart();
    this.cartIcon = new CartIcon(this.cart);
    this.products = new ProductGrid(this.cart);

    this.init();
  }

  init() {
    // Добавляем иконку в хедер
    const header = document.querySelector('.header__cart');
    header.append(this.cartIcon.elem);

    // Загружаем сохраненную корзину
    this.loadSavedCart();

    // Настраиваем автосохранение
    this.cart.addEventListener('cart-changed', () => {
      this.saveCart();
    });

    // Интеграция с продуктовой сеткой
    this.products.addEventListener('product-add', (e) => {
      this.cart.addProduct(e.detail.product);
      this.showAddedNotification(e.detail.product);
    });
  }

  loadSavedCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const items = JSON.parse(saved);
      items.forEach(item => {
        for (let i = 0; i < item.count; i++) {
          this.cart.addProduct(item.product);
        }
      });
    }
  }

  saveCart() {
    const items = this.cart.getItems();
    localStorage.setItem('cart', JSON.stringify(items));
  }

  showAddedNotification(product) {
    const notification = createElement(`
      <div class="notification notification--success">
        <img src="/assets/images/products/${product.image}" alt="">
        <span>${product.name} добавлен в корзину!</span>
      </div>
    `);

    document.body.append(notification);

    setTimeout(() => {
      notification.classList.add('notification--hiding');
      setTimeout(() => notification.remove(), 300);
    }, 2000);
  }
}

// Запуск системы
const shoppingCart = new ShoppingCartSystem();
```

### 📊 Интеграция с аналитикой

```js
class AnalyticsCartIcon extends CartIcon {
  constructor(cart) {
    super(cart);
    this.setupAnalytics();
  }

  setupAnalytics() {
    // Отслеживаем открытие корзины
    this.elem.addEventListener('click', () => {
      if (!this.cart.isEmpty()) {
        this.trackEvent('cart_opened', {
          items_count: this.cart.getTotalCount(),
          total_value: this.cart.getTotalPrice()
        });
      }
    });

    // Отслеживаем изменения в модалке
    this.modalBody?.addEventListener('click', (e) => {
      const button = e.target.closest('.cart-counter__button');
      if (button) {
        const productId = button.closest('.cart-product').dataset.productId;
        const isIncrease = button.classList.contains('cart-counter__button_plus');

        this.trackEvent('cart_item_updated', {
          product_id: productId,
          action: isIncrease ? 'increase' : 'decrease'
        });
      }
    });

    // Отслеживаем оформление заказа
    this.cart.addEventListener('order-submitted', (e) => {
      this.trackEvent('purchase', {
        transaction_id: e.detail.orderId,
        value: e.detail.totalPrice,
        currency: 'EUR',
        items: e.detail.items
      });
    });
  }

  trackEvent(eventName, eventParams) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, eventParams);
    }

    // Яндекс.Метрика
    if (typeof ym !== 'undefined') {
      ym(12345678, 'reachGoal', eventName, eventParams);
    }

    // Собственная аналитика
    fetch('/api/analytics', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({event: eventName, params: eventParams})
    }).catch(console.error);
  }
}
```

### 💾 С промокодами и скидками

```js
class DiscountCartIcon extends CartIcon {
  renderModal() {
    super.renderModal();

    // Добавляем блок промокода
    const promoBlock = this.renderPromoBlock();
    this.modalBody.append(promoBlock);
  }

  renderPromoBlock() {
    return createElement(`
      <div class="cart-promo">
        <div class="promo-input-group">
          <input type="text" 
                 class="promo-code-input" 
                 placeholder="Enter promo code">
          <button class="button button_secondary promo-apply">Apply</button>
        </div>
        <div class="promo-message"></div>
        <div class="cart-discounts"></div>
      </div>
    `);
  }

  addModalEventListeners() {
    super.addModalEventListeners();

    // Обработчик промокода
    const applyBtn = this.modalBody.querySelector('.promo-apply');
    applyBtn?.addEventListener('click', () => {
      const input = this.modalBody.querySelector('.promo-code-input');
      this.applyPromoCode(input.value);
    });
  }

  async applyPromoCode(code) {
    if (!code) return;

    const messageElem = this.modalBody.querySelector('.promo-message');
    const discountsElem = this.modalBody.querySelector('.cart-discounts');

    try {
      // Проверяем промокод на сервере
      const response = await fetch('/api/promo/validate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code, items: this.cart.getItems()})
      });

      const result = await response.json();

      if (result.valid) {
        // Применяем скидку
        this.cart.applyDiscount(result.discount);

        messageElem.innerHTML = `
          <span class="success">✓ Promo code applied: ${result.description}</span>
        `;

        discountsElem.innerHTML = `
          <div class="discount-item">
            <span>${result.description}</span>
            <span>-${this.formatPrice(result.discountAmount)}</span>
          </div>
        `;

        // Обновляем итоговую сумму
        this.updateTotalWithDiscount();
      } else {
        messageElem.innerHTML = `
          <span class="error">✗ ${result.error}</span>
        `;
      }
    } catch (error) {
      messageElem.innerHTML = `
        <span class="error">✗ Failed to apply promo code</span>
      `;
    }
  }

  updateTotalWithDiscount() {
    const totalElem = this.modalBody.querySelector('.cart-total-price');
    if (totalElem) {
      const originalPrice = this.cart.getTotalPrice();
      const discountedPrice = this.cart.getTotalPriceWithDiscounts();

      if (originalPrice !== discountedPrice) {
        totalElem.innerHTML = `
          <span class="original-price">${this.formatPrice(originalPrice)}</span>
          <span class="discounted-price">${this.formatPrice(discountedPrice)}</span>
        `;
      }
    }
  }
}
```

## 🧪 Тестирование

```bash
npm test
```

**Проверьте:**

- ✅ Иконка принимает корзину в конструкторе
- ✅ Клик на иконку открывает модалку (если корзина не пуста)
- ✅ Модалка отображает все товары из корзины
- ✅ Кнопки +/- изменяют количество товаров
- ✅ Счетчики и цены обновляются при изменениях
- ✅ Модалка закрывается при пустой корзине
- ✅ Названия товаров экранируются через escapeHtml
- ✅ Делегирование событий работает для всех кнопок
- ✅ Иконка обновляется при изменениях корзины
- ✅ Позиционирование работает при прокрутке
- ✅ Удаленные товары исчезают из модалки
- ✅ Новые товары появляются в модалке

## 🚀 Что дальше?

Поздравляем! Вы создали полноценную систему корзины с модальным окном и событийной архитектурой. Теперь вы готовы
разрабатывать профессиональные e-commerce решения: системы оформления заказов, интеграцию с платежными системами,
управление складскими остатками и создание персонализированных рекомендаций!

---
📚 **Полезные ссылки:**

- [MDN: EventTarget](https://developer.mozilla.org/ru/docs/Web/API/EventTarget)
- [MDN: CustomEvent](https://developer.mozilla.org/ru/docs/Web/API/CustomEvent)
- [MDN: Event Delegation](https://developer.mozilla.org/ru/docs/Learn/JavaScript/Building_blocks/Events#event_delegation)
- [Learn.javascript.ru: Делегирование событий](https://learn.javascript.ru/event-delegation)
- [Learn.javascript.ru: Модальные окна](https://learn.javascript.ru/modals-popups)
- [Learn.javascript.ru: Формы, элементы управления](https://learn.javascript.ru/forms-controls)
- [MDN: Intersection Observer API](https://developer.mozilla.org/ru/docs/Web/API/Intersection_Observer_API)
- [OWASP: XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
