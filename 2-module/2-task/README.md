# Определите наличие свойств в объекте

Необходимо создать функцию isEmpty(obj), которая возвращает `true`, 
если в объекте нет свойств и `false` – если в объекте есть хотя бы одно свойство.

Как должна работать функция:
```js
function isEmpty(obj) {
  // ваш код...
}

let schedule = {};

console.log( isEmpty(schedule) ); // true

schedule["8:30"] = "подъём";

console.log( isEmpty(schedule) ); // false
```
