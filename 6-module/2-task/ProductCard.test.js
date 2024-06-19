import {ProductCard} from './index.mjs';

describe('Класс, описывающий компонент "Карточка товара"', () => {
  let sut;
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

    sut = new ProductCard(product);

    document.body.append(sut.elem);
  });

  afterEach(() => {
    sut.elem.remove();
  });

  describe('Отрисовка', () => {
    it('Свойство elem возвращает один и тот же элемент, при каждом обращении', () => {
      const elementFirstCall = sut.elem;
      const elementSecondCall = sut.elem;

      expect(elementFirstCall).toBe(elementSecondCall);
    });

    it('Карточка товара содержит картинку', () => {
      let imageElement = sut.elem.querySelector('.card__image');
      let actualImageSrc = imageElement.src.trim();
      let expectedImageSrc = `/assets/images/products/${product.image}`;
      let isCorrectSource = actualImageSrc.includes(expectedImageSrc);

      expect(isCorrectSource).toBe(true);
    });

    it('Карточка товара содержит цену', () => {
      let priceElement = sut.elem.querySelector('.card__price');
      let actualPrice = priceElement.innerHTML.trim();
      let expectedPrice = '€10.00';

      expect(actualPrice).toBe(expectedPrice);
    });

    it('Карточка товара содержит название товара', () => {
      let nameElement = sut.elem.querySelector('.card__title');
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

      let addButton = sut.elem.querySelector('.card__button');

      addButton.dispatchEvent(clickEvent);
    });

    it('После клика по кнопке, создаётся событие', () => {
      expect(productAddEvent instanceof CustomEvent).toBe(true);
    });

    it('Созданное событие содержит в себе уникальный идентификатор товара ("id")', () => {
      expect(productAddEvent.detail).toBe(product.id);
    });
  });
});
