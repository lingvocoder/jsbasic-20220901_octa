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
    it('Добавляет корневой элемент в свойство elem', () => {
      expect(productsGrid.elem).not.toBeNull();
      expect(productsGrid.elem.classList.contains('products-grid')).toBe(true);
    });

    it('Элемент productsGrid отображает корректный HTML', () => {
      let productsGridInner = productsGrid.elem.querySelector('.products-grid__inner');
      expect(productsGridInner).not.toBeNull();
    });

    it('Отрисовывает карточки для всех блюд', () => {
      let productCards = productsGrid.elem.querySelectorAll('.card');
      expect(productCards.length).toBe(products.length);
    });

    it('Корректно отрисовывает ProductCard для каждого блюда', () => {
      let productCards = productsGrid.elem.querySelectorAll('.card');
      let firstCard = productCards[0];

      // Проверяем наличие основных элементов карточки
      expect(firstCard.querySelector('.card__title')).not.toBeNull();
      expect(firstCard.querySelector('.card__price')).not.toBeNull();
      expect(firstCard.querySelector('.card__button')).not.toBeNull();
      expect(firstCard.querySelector('.card__image')).not.toBeNull();
    });
  });

  describe('Метод updateFilter(newFilters)', () => {
    // Хелпер-функция для получения названий отфильтрованных блюд
    const getFilteredProductNames = () => {
      return [...productsGrid.elem.querySelectorAll('.card')]
        .map((product) => {
          let cardTitle = product.querySelector('.card__title');
          return cardTitle && cardTitle.textContent.trim();
        });
    };

    describe('Фильтрация по одному параметру', () => {
      it('Фильтрует блюда по параметру excludeNuts', () => {
        productsGrid.updateFilter({ excludeNuts: true });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = [
          "Laab kai chicken salad", "Som tam papaya salad", "Tom yam kai",
          "Tom kha kai", "Tom kha koong", "Tom yam koong", "Tom yam vegetarian",
          "Tom kha vegetarian", "Sweet 'n sour chicken", "Chicken cashew",
          "Kai see ew", "Beef massaman", "Seafood chu chee", "Penang shrimp",
          "Green curry veggies", "Tofu cashew", "Red curry veggies", "Krapau tofu",
          "Prawn crackers", "Fish cakes", "Chicken satay", "Satay sauce",
          "Shrimp springrolls", "Mini vegetarian spring rolls",
          "Chicken springrolls", "Thai fried rice", "Prik nam pla",
          "Fresh prawn crackers", "Stir fried vegetables", "White rice"
        ];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });

      it('Фильтрует блюда по параметру onlyVegetarian', () => {
        productsGrid.updateFilter({ onlyVegetarian: true });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = ["Green curry veggies", "Tofu cashew"];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });

      it('Фильтрует блюда по параметру maxSpiciness', () => {
        productsGrid.updateFilter({ maxSpiciness: 1 });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = [
          "Som tam papaya salad", "Tom yam vegetarian",
          "Tom kha vegetarian", "Chicken cashew", "Green curry veggies",
          "Tofu cashew", "Krapau tofu", "Prawn crackers",
          "Fish cakes", "Chicken satay", "Fresh prawn crackers",
          "Stir fried vegetables", "White rice"
        ];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });

      it('Фильтрует блюда по параметру category', () => {
        productsGrid.updateFilter({ category: 'seafood-dishes' });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = ["Seafood chu chee", "Penang shrimp"];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });
    });

    describe('Граничные случаи фильтрации', () => {
      it('Показывает все блюда при maxSpiciness = 4', () => {
        productsGrid.updateFilter({ maxSpiciness: 4 });

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });

      it('Корректно обрабатывает maxSpiciness = 0', () => {
        productsGrid.updateFilter({ maxSpiciness: 0 });

        let filteredProductNames = getFilteredProductNames();
        // Ожидаем блюда с остротой 0 и блюда без свойства spiciness
        expect(filteredProductNames).toContain("Som tam papaya salad");
        expect(filteredProductNames).toContain("Green curry veggies");
        expect(filteredProductNames).toContain("Tofu cashew");
      });

      it('Возвращает пустой результат для несуществующей категории', () => {
        productsGrid.updateFilter({ category: 'non-existent-category' });

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(0);
      });
    });

    describe('Комбинированная фильтрация', () => {
      it('Объединяет фильтры между разными вызовами', () => {
        productsGrid.updateFilter({ maxSpiciness: 2 });
        productsGrid.updateFilter({ category: 'seafood-dishes' });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = ["Seafood chu chee"];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });

      it('Комбинирует excludeNuts и onlyVegetarian', () => {
        productsGrid.updateFilter({ excludeNuts: true, onlyVegetarian: true });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = ["Green curry veggies", "Tofu cashew"];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });

      it('Применяет все фильтры одновременно', () => {
        productsGrid.updateFilter({
          category: 'vegetable-dishes',
          maxSpiciness: 0,
          onlyVegetarian: true,
          excludeNuts: true
        });

        let filteredProductNames = getFilteredProductNames();
        let expectedProductNames = ["Green curry veggies", "Tofu cashew"];

        expect(filteredProductNames).toEqual(expectedProductNames);
      });
    });

    describe('Сброс фильтров', () => {
      it('Сбрасывает фильтр категории пустой строкой', () => {
        productsGrid.updateFilter({ category: 'soups' });
        productsGrid.updateFilter({ category: '' });

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });

      it('Сбрасывает фильтр через undefined', () => {
        productsGrid.updateFilter({ category: 'soups' });
        productsGrid.updateFilter({ category: undefined });

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });

      it('Сбрасывает boolean фильтры через false', () => {
        productsGrid.updateFilter({ onlyVegetarian: true });
        productsGrid.updateFilter({ onlyVegetarian: false });

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });
    });

    describe('Обработка некорректных данных', () => {
      it('Корректно обрабатывает пустой объект фильтров', () => {
        productsGrid.updateFilter({});

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });

      it('Игнорирует неизвестные фильтры', () => {
        productsGrid.updateFilter({ unknownFilter: 'someValue' });

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });

      it('Вызов без параметров не ломает компонент', () => {
        expect(() => productsGrid.updateFilter()).not.toThrow();

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      });
    });
  });

  describe('Дополнительные методы (если есть)', () => {
    it('clearAllFilters() сбрасывает все фильтры', () => {
      productsGrid.updateFilter({
        category: 'soups',
        maxSpiciness: 1,
        onlyVegetarian: true,
        excludeNuts: true
      });

      if (typeof productsGrid.clearAllFilters === 'function') {
        productsGrid.clearAllFilters();

        let productCards = productsGrid.elem.querySelectorAll('.card');
        expect(productCards.length).toBe(products.length);
      }
    });

    it('getActiveFilters() возвращает текущие фильтры', () => {
      const testFilters = { category: 'soups', maxSpiciness: 2 };
      productsGrid.updateFilter(testFilters);

      if (typeof productsGrid.getActiveFilters === 'function') {
        const activeFilters = productsGrid.getActiveFilters();
        expect(activeFilters).toEqual(testFilters);
      }
    });

    it('getVisibleProductsCount() возвращает количество видимых продуктов', () => {
      productsGrid.updateFilter({ category: 'seafood-dishes' });

      if (typeof productsGrid.getVisibleProductsCount === 'function') {
        const count = productsGrid.getVisibleProductsCount();
        expect(count).toBe(2); // Seafood chu chee, Penang shrimp
      }
    });
  });

  describe('Производительность и стабильность', () => {
    it('Многократные вызовы updateFilter не вызывают утечек памяти', () => {
      const initialCardCount = document.querySelectorAll('.card').length;

      // Множественные вызовы фильтрации
      for (let i = 0; i < 100; i++) {
        productsGrid.updateFilter({ category: i % 2 === 0 ? 'soups' : 'salads' });
      }

      productsGrid.updateFilter({ category: undefined });

      // Проверяем что не накопились лишние элементы
      const finalCardCount = document.querySelectorAll('.card').length;
      expect(finalCardCount).toBe(initialCardCount);
    });

    it('Фильтрация большого количества элементов работает быстро', () => {
      const startTime = performance.now();

      productsGrid.updateFilter({ maxSpiciness: 2 });
      productsGrid.updateFilter({ category: 'seafood-dishes' });
      productsGrid.updateFilter({ onlyVegetarian: true });

      const endTime = performance.now();
      const executionTime = endTime - startTime;

      // Фильтрация должна выполняться быстро (менее 100мс)
      expect(executionTime).toBeLessThan(100);
    });
  });
});
