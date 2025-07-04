# Учебный проект: Список товаров

Создайте класс `ProductGrid`, описывающий компонент "Список товаров".
В качестве аргумента в конструктор класса передаётся массив объектов товаров:

```js
let products = [
  {
    name: "Laab kai chicken salad", // название товара
    price: 10, // цена товара
    category: "salads", // категория, к которой он относится (понадобится чуть позже)
    image: "laab_kai_chicken_salad.png", // часть URL картинки товара
    id: "laab-kai-chicken-salad" // уникальный идентификатор товара, нужен для добавления данного товара в корзину
  },

  {
    name: "Som tam papaya salad",
    price: 9.5,
    category: "salads",
    image: "som_tam_papaya_salad.png",
    id: "som-tam-papaya-salad",
    spiciness: 0
  },

  // и др.
];

let productGrid = new ProductGrid(products);
```

После этого в `productCard.elem` должен быть доступен DOM-элемент с карточкой товара. Вот его основа:

```html
<div class="products-grid">
  <div class="products-grid__inner">
    <!--ВОТ ТУТ БУДУТ КАРТОЧКИ ТОВАРОВ-->
  </div>
</div>`
```

Для каждого объекта из массива товаров нужно отрисовать карточку товара на основе класса `ProductCard`, который мы сделали ранее, 
и вставить их внутрь элемента с классом `products-grid__inner`.
Здесь используется такой же формат объекта товара как и в классе `ProductCard`.

## Фильтрация товаров

Как вы помните, в нашем ресторане есть возможность показывать только те блюда, которые соответствуют критериям фильтрации, например, 
блюда определённой категории, максимальной остроты, только салаты и другие. 
Для этого необходимо создать метод `updateFilter(filters)`, который отобразит список блюд, соответствующих критериям фильтрации.

В качестве аргумента метод принимает объект `filters`:

```js
let filters = {
  nuts: true, // true/false
  vegetarian: false, // true/false
  spiciness: 3, // числа от 0 до 4
  category: 'soups' // уникальный идентификатор категории товара
};

productGrid.updateFilter(filters); 
```

После вызова метода, должны быть показаны `только те товары, которые удовлетворяют значениям новых фильтров`.
Давайте разберём каждое значение отдельно:
- `filters.nuts` — `true/false` — если значение `false`, то нужно показать только блюда `без орехов` (`nuts`:`false`) или блюда, в которых такое свойство отсутствует вовсе. Если значение `true` — то показываем блюда с орехами. 
- `filters.vegetarian` — `true/false` — если значение `true`, то нужно показать только `вегетарианские` блюда (`vegetarian`:`true`). Если значение `false` — то не учитываем этот критерий.
- `filters.spiciness` — `число от 0 до 4` — показываем только те блюда, в свойстве `spiciness` которых указано число меньше или равное заданному.
- `filters.category` — `уникальный идентификатор категории` — показываем только те блюда, в свойстве `category` которых такое же значение. Если передана пустая строка или такого свойства нет в `filters` — показываем все товары.

Обращаем ваше внимание, что метод `updateFilter`, может вызываться с неполным объектом `filters`:

```js
productGrid.updateFilter({ nuts: true }); 
productGrid.updateFilter({ category: 'soups' });

/* После чего должны быть показаны товары для критериев:
nuts: true и category: 'soups'
*/
```

В таком случае, мы должны сохранять критерии фильтрации после предыдущего вызова.
Например, после выполнения кода из примера выше, должны бы показаны товары, 
которые соответствуют обоим критериям фильтрации: `nuts: true` и `category: 'soups'`. 
