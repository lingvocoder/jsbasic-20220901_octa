import {createElement} from '../../assets/lib/create-element.js';
import ProductCard from '../../6-module/2-task/product-card.js';

export default class ProductGrid {
  elem = null;

  constructor(products) {
    this.products = products;
    this.activeFilters = {};
    this.render();
  }

  render() {
    if (!this.elem) {
      this.elem = createElement(this.getProductGrid(this.products));
    }
    return this.elem;
  }

  getProductGrid = (data) => {
    return `
        <div class="products-grid">
            <div class="products-grid__inner">
                ${this.getProductCards(data)}
            </div>
        </div>
    `;
  };

  getProductCards = (data) => {
    return data.map(item => {
      return new ProductCard(item).elem.outerHTML;
    }).join('');
  };

  /**
   * Обновляет фильтры и перерисовывает товары
   * @param {Object} newFilters — Объект с новыми значениями фильтров
   */
  updateFilter = (newFilters = {}) => {
    // Обрабатываем каждый новый фильтр
    Object.entries(newFilters).forEach(([key, value]) => {
      if (this.shouldRemoveFilter(value)) {
        // Удаляем фильтр если значение означает "сброс"
        delete this.activeFilters[key];
      } else {
        // Устанавливаем фильтр
        this.activeFilters[key] = value;
      }
      this.applyFilters();
    });
  };

  /**
   * Определяет, нужно ли удалить фильтр по его значению
   * @param {*} value — Значение фильтра
   * @returns {boolean} — true если фильтр нужно удалить
   */
  shouldRemoveFilter = (value) => {
    return value === undefined ||
      value === null ||
      value === '' ||
      value === false;
  };

  /**
   * Применяет все активные фильтры и обновляет отображение
   */
  applyFilters = () => {
    const filteredProducts = this.products.filter(product =>
      this.isProductVisible(product)
    );

    const gridInner = this.elem.querySelector('.products-grid__inner');
    gridInner.innerHTML = this.getProductCards(filteredProducts);
  };

  /**
   * Проверяет, должен ли продукт быть видимым с текущими фильтрами
   * @param {Object} product — Продукт для проверки
   * @returns {boolean} — true если продукт должен отображаться
   */
  isProductVisible = (product) => {
    // Фильтр по категории
    if (this.activeFilters.category && product.category !== this.activeFilters.category) {
      return false;
    }

    // Фильтр по максимальной остроте
    if (this.activeFilters.maxSpiciness !== undefined) {
      const productSpiciness = product.spiciness ?? 0;
      if (productSpiciness > this.activeFilters.maxSpiciness) {
        return false;
      }
    }

    // Фильтр "только вегетарианские"
    if (this.activeFilters.onlyVegetarian && product.vegetarian !== true) {
      return false;
    }

    // Фильтр "исключить блюда с орехами"
    if (this.activeFilters.excludeNuts && product.nuts === true) {
      return false;
    }
    return true;
  };

  /**
   * Очищает все фильтры
   */
  clearAllFilters = () => {
    this.activeFilters = {};
    this.applyFilters();
  };

  /**
   * Возвращает текущие активные фильтры
   * @returns {Object} — Копия объекта с активными фильтрами
   */
  getActiveFilters = () => {
    return {...this.activeFilters};
  };

  /**
   * Возвращает количество отфильтрованных продуктов
   * @returns {number} — Количество видимых продуктов
   */
  getVisibleProductsCount = () => {
    return this.products.filter(product => this.isProductVisible(product)).length;
  };
}
