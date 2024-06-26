# Учебный проект: Карусель

Создайте класс `Carousel`, описывающий компонент "Карусель".
С данным компонентом интерфейса мы уже познакомились в предыдущем занятии, и для решения этой задачи, вам понадобятся ваши наработки. 
Главным отличием этой задачи будет использование компонентного подхода.

В качестве аргумента в конструктор класса передаётся массив слайдов для отображения:

```js
let slides = [
  {
    name: 'Penang shrimp', // Название товара
    price: 16, // Цена товара
    image: 'penang_shrimp.png', // Название файла картинки
    id: 'penang-shrimp' // Уникальный идентификатор товара
  },
  {
    name: 'Chicken cashew',
    price: 14,
    image: 'chicken_cashew.png',
    id: 'chicken-cashew'
  },
];

let carousel = new Carousel(slides);
```

После этого в `carousel.elem` должен быть доступен корневой DOM-элемент карусели. 

На вёрстку можно посмотреть в файле `static.html`, а пример использования – в файле `index.html`.
Вёрстка идентична вёрстке из предыдущей задачи про карусель, однако в этот раз вам нужно отрисовать её самостоятельно. 

## Отрисовка вёрстки компонента

Как видно из вёрстки готовой карусели в файле `static.html`:
- корневой элемент компонента имеет класс `carousel` 
- все слайды находятся внутри элемента с классом `carousel__inner`
- вёрстка одного слайда выглядит так:

```html
<div class="carousel__slide" data-id="penang-shrimp">
  <img src="/assets/images/carousel/{{slide.image}}" class="carousel__img" alt="slide">
  <div class="carousel__caption">
    <span class="carousel__price">€<!--slide.price--></span>
    <div class="carousel__title"><!--slide.name--></div>
    <button type="button" class="carousel__button">
      <img src="/assets/images/icons/plus-icon.svg" alt="icon">
    </button>
  </div>
</div>
```

Обращаем ваше внимание:
- Для создания DOM-клементов, рекомендуем использовать хэлпер `createElement`, который импортируется в первой строке `index.mjs`: `import createElement from '../../assets/lib/create-element.js';`. Он позволяет создать готовый элемент из вашей вёрстки, пример:

```js
import createElement from './create-element.js';

const table = createElement(`
    <table class="table">
        <thead>
            <tr>
                <th>Имя</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Вася</td>
            </tr>
            <tr>
                <td>Петя</td>
            </tr>
        </tbody>
    </table>
`)
```
- Цена представлена в объекте слайда, как число (например так: `10`), но отобразить её нужно, во-первых, со значком валюты в начале строки – `€`, а во-вторых, с двумя символами после точки – `€10.00`. Чтобы получить два символа, воспользуйтесь методом числа `toFixed`, про который можно прочитать [в этой статье](https://learn.javascript.ru/number#okruglenie).
- Нужно дополнить путь к картинке слайда. Все картинки слайдов лежат в папке `/assets/images/carousel`. Однако, для каждого слайда нам нужно указать путь к конкретной картинке. Название картинки вы найдёте в свойстве `image` объекта слайда. В итоге у вас должен получится путь вида `/assets/images/carousel/penang_shrimp.png`, где `penang_shrimp.png` мы берём из свойства `image` объекта товара. Этот путь нужно прописать в атрибут `src` картинки `img` с CSS классом `carousel__img`.
- Созданный DOM-элемент вашей карусели необходимо сохранить в свойство `elem` вашего класса `Carousel` для того, чтобы его можно было использовать так (пример в `index.html`):

```js
let carousel = new Carousel(slides);
console.log(carousel.elem); // Корневой HTML элемента карусели
```

- Свойство `elem` не должно быть геттером(`get elem()`), который при каждом вызове создает новый DOM-элемент, так как ваш компонент могут использовать несколько раз. Поэтому допускается геттер, который просто возвращает созданный DOM-элемент, например:
```js
get elem() {
    return this._container;
}
```

## Переключение слайдов по стрелкам

Требования к переключениям слайдов точно такие же, как в предыдущей задаче про карусель.
Отличие в том, что здесь количество слайдов не фиксированное, а может быть любым.
Это нужно учесть в решении, а в остальном вы можете переиспользовать ваш код.

## Событие при клике на "+"

Кроме показа карусели и переключения слайдов, нужно генерировать событие при клике по кнопке добавления `"+"`.

В нашем проекте товары можно будет добавлять не только из "Карточки товара", но и из "Карусели".

А именно: при клике пользователя по кнопке с классом `carousel__button` необходимо генерировать пользовательское событие на корневом HTML-элементе компонента (он хранится в свойстве `elem`), следующего вида: 

```js
new CustomEvent("product-add", { // имя события должно быть именно "product-add"
    detail: slide.id, // Уникальный идентификатор товара из объекта слайда
    bubbles: true // это событие всплывает – это понадобится в дальнейшем
}
```

Как вы видите, для генерации такого события необходим уникальный идентификатор товара (`slide.id`). 
Для простоты его можно хранить в дата-атрибуте.
Например, мы используем атрибут `data-id` в элементе слайда.

Про пользовательские события можно прочитать в статье – [Генерация пользовательских событий](https://learn.javascript.ru/dispatch-events).
***
__Важно!__

Событие должно **ОБЯЗАТЕЛЬНО** всплывать.
Для этого не забудьте передать свойство `bubbles: true` в опциях в момент создания объекта события, как это показано выше.
Если этого не сделать, событие невозможно будет отловить на элементе `body`, а это потребуется в дальнейшем.
