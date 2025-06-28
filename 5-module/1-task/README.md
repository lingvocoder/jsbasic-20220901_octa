# Скрыть кнопку

Напишите функцию `hideSelf`, которая скрывает кнопку с классом `hide-self-button` по нажатию. 
Чтобы скрыть кнопку, необходимо установить на соответствующем элементе атрибут `hidden`.

```js
function hideSelf() {
  // ваш код...
}

hideSelf();
```

Разметка кнопки:
```html
<button class="hide-self-button">Нажмите, чтобы скрыть</button>
```

В файле `index.html` вы можете найти пример использования функции.

***
Подсказка!

Атрибут `hidden` — стандартный атрибут, поэтому он представлен в виде свойства DOM-элемента: <code>button.hidden</code>. 
Подробнее можно прочитать [здесь](https://learn.javascript.ru/basic-dom-node-properties#svoystvo-hidden).
