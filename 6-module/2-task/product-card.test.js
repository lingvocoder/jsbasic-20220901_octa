import ProductCard from './product-card.js';

describe('Класс, описывающий компонент "Карточка товара"', () => {
  let item;
  let product;
  let clickEvent;

  beforeEach(() => {
    product = {
      name: "Laab kai chicken salad",
      price: 10,
      category: "salads",
      image: "laab_kai_chicken_salad.png",
      id: "laab-kai-chicken-salad"
    };

    clickEvent = new MouseEvent('click', {bubbles: true});

    item = new ProductCard(product);

    document.body.append(item.elem);
  });

  afterEach(() => {
    item.elem.remove();
  });

  describe('Отрисовка', () => {
    it('Свойство elem возвращает один и тот же элемент, при каждом обращении', () => {
      const elementFirstCall = item.elem;
      const elementSecondCall = item.elem;

      expect(elementFirstCall).toBe(elementSecondCall);
    });

    it('Карточка товара содержит картинку', () => {
      let imageElement = item.elem.querySelector('.card__image');
      let actualImageSrc = imageElement.src.trim();
      let expectedImageSrc = `/assets/images/products/${product.image}`;
      let isCorrectSource = actualImageSrc.includes(expectedImageSrc);

      expect(isCorrectSource).toBe(true);
    });

    it('Карточка товара содержит цену', () => {
      let priceElement = item.elem.querySelector('.card__price');
      let actualPrice = priceElement.innerHTML.trim();
      let expectedPrice = '€10.00';

      expect(actualPrice).toBe(expectedPrice);
    });

    it('Карточка товара содержит название товара', () => {
      let nameElement = item.elem.querySelector('.card__title');
      let actualName = nameElement.innerHTML.trim();
      let expectedName = product.name;

      expect(actualName).toBe(expectedName);
    });
  });

  describe('Генерация события добавления в корзину("product-add")', () => {
    let productAddEventName;
    let productAddEvent;

    beforeEach(() => {
      productAddEventName = 'product-add';

      document.body.addEventListener(productAddEventName, (event) => {
        productAddEvent = event;
      }, {once: true});

      let addButton = item.elem.querySelector('.card__button');

      addButton.dispatchEvent(clickEvent);
    });

    it('При нажатии по кнопке создаётся событие', () => {
      expect(productAddEvent instanceof CustomEvent).toBe(true);
    });

    it('Созданное событие содержит в себе уникальный идентификатор блюда ("id")', () => {
      expect(productAddEvent.detail).toBe(product.id);
    });
  });
});
