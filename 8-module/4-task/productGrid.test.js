import ProductsGrid from './productGrid.js';
import products from './products.js';

describe('Класс, описывающий компонент "Список блюд"', () => {
  let productsGrid;

  beforeEach(() => {
    productsGrid = new ProductsGrid(products);

    document.body.append(productsGrid.elem);
  });

  afterEach(() => {
    productsGrid.elem.remove();
  });

  describe('Отрисовка вёрстки компонента после создания экземпляра класса', () => {
    it('Добавляет корневой элемент в свойство elem', ()=> {
      expect(productsGrid.elem).not.toBeNull();
      expect(productsGrid.elem.classList.contains('products-grid')).toBe(true);
    })

    it('Элемент productsGrid отображает корректный HTML', () => {
      let productsGridInner = productsGrid.elem.querySelector('.products-grid__inner');

      expect(productsGridInner).not.toBeNull();
    });

    it('Отрисовывает карточки для всех блюд', () => {
      let productCards = productsGrid.elem.querySelectorAll('.card');

      expect(productCards.length).toBe(products.length);
    });
  });

  describe('Метод updateFilter(newFilters)', () => {
    it('Фильтрует блюда по параметру excludeNuts', () => {
      productsGrid.updateFilter({ excludeNuts: true });

      let filteredProductCardsNames = [...productsGrid.elem.querySelectorAll('.card')]
        .map((product) => {
          let cardTitle = product.querySelector('.card__title');

          return cardTitle && cardTitle.textContent.trim();
        });

      let expectedProductNames = [
        "Laab kai chicken salad", "Som tam papaya salad", "Tom yam kai",
        "Tom kha kai", "Tom kha koong", "Tom yam koong", "Tom yam vegetarian",
        "Tom kha vegetarian", "Sweet 'n sour chicken", "Chicken cashew",
        "Kai see ew", "Beef massaman", "Seafood chu chee", "Penang shrimp",
        "Green curry veggies", "Tofu cashew", "Red curry veggies", "Krapau tofu",
        "Prawn crackers", "Fish cakes", "Chicken satay", "Satay sauce",
        "Shrimp springrolls", "Mini vegetarian spring rolls",
        "Chicken springrolls", "Thai fried rice", "Prik nam pla",
        "Fresh prawn crackers", "Stir fried vegetables", "White rice"];

      expect(filteredProductCardsNames).toEqual(expectedProductNames);
    });

    it('Фильтрует блюда по параметру onlyVegetarian', () => {
      productsGrid.updateFilter({ onlyVegetarian: true });

      let filteredProductCardsNames = [...productsGrid.elem.querySelectorAll('.card')]
        .map((product) => {
          let cardTitle = product.querySelector('.card__title');

          return cardTitle && cardTitle.textContent.trim();
        });

      let expectedProductNames = ["Green curry veggies", "Tofu cashew"];

      expect(filteredProductCardsNames).toEqual(expectedProductNames);
    });

    it('Фильтрует блюда по параметру maxSpiciness', () => {
      productsGrid.updateFilter({ maxSpiciness: 1 });

      let filteredProductCardsNames = [...productsGrid.elem.querySelectorAll('.card')]
        .map((product) => {
          let cardTitle = product.querySelector('.card__title');

          return cardTitle && cardTitle.textContent.trim();
        });

      let expectedProductNames = [
        "Som tam papaya salad", "Tom yam vegetarian",
        "Tom kha vegetarian", "Chicken cashew", "Green curry veggies",
        "Tofu cashew", "Krapau tofu", "Prawn crackers",
        "Fish cakes", "Chicken satay", "Fresh prawn crackers",
        "Stir fried vegetables", "White rice"
      ];

      expect(filteredProductCardsNames).toEqual(expectedProductNames);
    });

    it('Фильтрует блюда по параметру category', () => {
      productsGrid.updateFilter({ category: 'seafood-dishes' });

      let filteredProductCardsNames = [...productsGrid.elem.querySelectorAll('.card')]
        .map((product) => {
          let cardTitle = product.querySelector('.card__title');

          return cardTitle && cardTitle.textContent.trim();
        });

      let expectedProductNames = ["Seafood chu chee", "Penang shrimp"];

      expect(filteredProductCardsNames).toEqual(expectedProductNames);
    });

    it('Объединяет объекты newFilters между разными вызовами', () => {
      productsGrid.updateFilter({ maxSpiciness: 2 });
      productsGrid.updateFilter({ category: 'seafood-dishes' });

      let filteredProductCardsNames = [...productsGrid.elem.querySelectorAll('.card')]
        .map((productCard) => {
          let cardTitleElement = productCard.querySelector('.card__title');

          return cardTitleElement && cardTitleElement.textContent.trim();
        });

      let expectedProductNames = ["Seafood chu chee"];

      expect(filteredProductCardsNames).toEqual(expectedProductNames);
    });
  });
});
