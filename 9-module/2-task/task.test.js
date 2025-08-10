import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Main from './index.js';
import { createElement } from '../../assets/lib/create-element.js';

describe('Main Component', () => {
  let main;
  let realFetch;
  let products;
  let bodyInner;

  const createTestProducts = () => [
    {
      name: "Laab kai chicken salad",
      price: 10,
      category: "salads",
      image: "laab_kai_chicken_salad.png",
      id: "laab-kai-chicken-salad",
      nuts: true,
      vegetarian: false,
      spiciness: 2
    },
    {
      name: "Som tam papaya salad",
      price: 9.5,
      category: "salads",
      image: "som_tam_papaya_salad.png",
      id: "som-tam-papaya-salad",
      nuts: false,
      vegetarian: true,
      spiciness: 0
    },
    {
      name: "Tom yam kai",
      price: 7,
      category: "soups",
      image: "tom_yam.png",
      id: "tom-yam-kai",
      nuts: false,
      vegetarian: false,
      spiciness: 3
    },
    {
      name: "Tom kha kai",
      price: 7,
      category: "soups",
      image: "tom_kha.png",
      id: "tom-kha-kai",
      nuts: false,
      vegetarian: false,
      spiciness: 3
    }
  ];

  const createTestHTML = () => createElement(`
    <div>
      <header class="header container">
        <h1 class="heading logo">Bangkok Express</h1>
        <h3 class="subheading">Great food・Free delivery・Fair price</h3>
        <div class="cart-icon-holder" ></div>
      </header>
      <main>
        <div class="container carousel-holder" ></div>
        <div class="container">
          <h2 class="section-heading">Our Menu</h2>
          <div class="ribbon-holder"></div>
        </div>
        <div class="container">
          <div class="filters">
            <div class="filters__inner">
              <div class="filters__group">
                <label class="filters__label">Max spiciness</label>
                <div class="filters__slider slider-holder" ></div>
              </div>
              <div class="filters__group">
                <div class="filters__checkbox">
                  <input class="styled-checkbox" id="exclude-nuts" type="checkbox" value="1">
                  <label for="exclude-nuts">
                    <span class="filters__label">No nuts</span>
                  </label>
                </div>
              </div>
              <div class="filters__group">
                <div class="filters__checkbox">
                  <input class="styled-checkbox" id="vegetarian-only" type="checkbox" value="1">
                  <label for="vegetarian-only">
                    <span class="filters__label">Vegetarian only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="container products-grid-holder" >
          <div class="products-grid is-loading">
            <div class="products-grid__skeleton">
              <div class="products-grid__skeleton-item"></div>
              <div class="products-grid__skeleton-item"></div>
            </div>
            <div class="products-grid__inner"></div>
          </div>
        </div>
      </main>
    </div>
  `);

  beforeEach(() => {
    // Подготовка DOM
    bodyInner = createTestHTML();
    document.body.append(bodyInner);

    // Подготовка данных
    products = createTestProducts();

    // Мокирование fetch
    realFetch = global.fetch;
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(products)
      })
    );

    main = new Main();
  });

  afterEach(() => {
    global.fetch = realFetch;
    bodyInner.remove();
  });

  describe('Component Initialization', () => {
    it('should render carousel component', async () => {
      await main.render();
      const carousel = document.querySelector('.carousel-holder .carousel');
      expect(carousel).toBeTruthy();
    });

    it('should render ribbon menu component', async () => {
      await main.render();
      const ribbon = document.querySelector('.ribbon-holder .ribbon');
      expect(ribbon).toBeTruthy();
    });

    it('should render slider component', async () => {
      await main.render();
      const slider = document.querySelector('.slider-holder .slider');
      expect(slider).toBeTruthy();
    });

    it('should render cart icon component', async () => {
      await main.render();
      const cartIcon = document.querySelector('.cart-icon-holder .cart-icon');
      expect(cartIcon).toBeTruthy();
    });

    it('should render products grid component', async () => {
      await main.render();
      const grid = document.querySelector('.products-grid-holder .products-grid');
      expect(grid).toBeTruthy();
    });

    it('should fetch products from server', async () => {
      await main.render();
      expect(global.fetch).toHaveBeenCalledWith('products.json');
      expect(main.productArray).toEqual(products);
    });
  });

  describe('Component Interactions', () => {
    it('should add product to cart on product-add event', async () => {
      await main.render();

      document.body.dispatchEvent(
        new CustomEvent('product-add', { detail: products[0].id })
      );

      const cartCount = document.querySelector('.cart-icon__count');
      expect(cartCount.textContent).toBe('1');
    });

    it('should filter products by nuts checkbox', async () => {
      await main.render();

      const nutsCheckbox = document.getElementById('exclude-nuts');
      nutsCheckbox.checked = true;
      nutsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

      const productTitles = [...document.querySelectorAll('.card__title')]
        .map(el => el.textContent.trim());

      const expectedTitles = ["Som tam papaya salad", "Tom yam kai", "Tom kha kai"];
      expect(productTitles).toEqual(expectedTitles);
    });

    it('should filter products by vegetarian checkbox', async () => {
      await main.render();

      const vegetarianCheckbox = document.getElementById('vegetarian-only');
      vegetarianCheckbox.checked = true;
      vegetarianCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

      const productTitles = [...document.querySelectorAll('.card__title')]
        .map(el => el.textContent.trim());

      expect(productTitles).toEqual(["Som tam papaya salad"]);
    });

    it('should filter products by spiciness slider', async () => {
      await main.render();

      const slider = document.querySelector('.slider');
      slider.dispatchEvent(
        new CustomEvent('slider-change', { detail: 2, bubbles: true })
      );

      const productTitles = [...document.querySelectorAll('.card__title')]
        .map(el => el.textContent.trim());

      const expectedTitles = ["Laab kai chicken salad", "Som tam papaya salad"];
      expect(productTitles).toEqual(expectedTitles);
    });

    it('should filter products by category selection', async () => {
      await main.render();

      const ribbon = document.querySelector('.ribbon');
      ribbon.dispatchEvent(
        new CustomEvent('ribbon-select', { detail: 'soups', bubbles: true })
      );

      const productTitles = [...document.querySelectorAll('.card__title')]
        .map(el => el.textContent.trim());

      const expectedTitles = ["Tom yam kai", "Tom kha kai"];
      expect(productTitles).toEqual(expectedTitles);
    });
  });

  describe('Cart Functionality', () => {
    it('should update cart icon when products added', async () => {
      await main.render();

      // Добавляем несколько товаров
      document.body.dispatchEvent(
        new CustomEvent('product-add', { detail: products[0].id })
      );
      document.body.dispatchEvent(
        new CustomEvent('product-add', { detail: products[1].id })
      );

      const cartCount = document.querySelector('.cart-icon__count');
      const cartPrice = document.querySelector('.cart-icon__price');

      expect(cartCount.textContent).toBe('2');
      expect(cartPrice.textContent).toBe('€19.50');
    });

    it('should handle duplicate product additions', async () => {
      await main.render();

      // Добавляем один товар дважды
      const productId = products[0].id;
      document.body.dispatchEvent(
        new CustomEvent('product-add', { detail: productId })
      );
      document.body.dispatchEvent(
        new CustomEvent('product-add', { detail: productId })
      );

      const cartCount = document.querySelector('.cart-icon__count');
      expect(cartCount.textContent).toBe('2');
    });
  });

  describe('Filter Combinations', () => {
    it('should apply multiple filters simultaneously', async () => {
      await main.render();

      // Применяем фильтр по категории и остроте
      const ribbon = document.querySelector('.ribbon');
      ribbon.dispatchEvent(
        new CustomEvent('ribbon-select', { detail: 'salads', bubbles: true })
      );

      const slider = document.querySelector('.slider');
      slider.dispatchEvent(
        new CustomEvent('slider-change', { detail: 1, bubbles: true })
      );

      const productTitles = [...document.querySelectorAll('.card__title')]
        .map(el => el.textContent.trim());

      // Должны остаться только салаты с остротой <= 1
      expect(productTitles).toEqual(["Som tam papaya salad"]);
    });

    it('should reset filters correctly', async () => {
      await main.render();

      // Применяем фильтр
      const nutsCheckbox = document.getElementById('exclude-nuts');
      nutsCheckbox.checked = true;
      nutsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

      // Сбрасываем фильтр
      nutsCheckbox.checked = false;
      nutsCheckbox.dispatchEvent(new Event('change', { bubbles: true }));

      const productTitles = [...document.querySelectorAll('.card__title')]
        .map(el => el.textContent.trim());

      // Должны вернуться все товары
      expect(productTitles).toHaveLength(4);
    });
  });
});
